import React from 'react';

import { project } from 'ecef-projector';
import { Container, Row, Col, Tab, Tabs, Card, Form, InputGroup } from 'react-bootstrap';

import { normalNeutrinoOscilationSpectrum, invertedNeutrinoOscilationSpectrum} from './physics/neutrino-oscillation'

import { NuSpectrumPlot } from './ui/plot'
import { NuMap, StatsPanel } from './ui';
import Plot from 'react-plotly.js';
import { defaultCoreList, ReactorCore } from './reactor-cores';
import { presets } from './detectors';
import { getCrustFlux } from './crust-model';
import { averageSurvivalProbabilityNormal, averageSurvivalProbabilityInverted } from './physics/neutrino-oscillation';
import { antineutrinoSpectrum238U, antineutrinoSpectrum232Th, antineutrinoSpectrum40K} from './antineutrino-spectrum';
import { crossSectionSV2003, crossSectionElectronAntineutrinoES, crossSectionMuTauAntineutrinoES, crossSectionVB1999 } from './physics/neutrino-cross-section';
import { SECONDS_PER_YEAR, ISOTOPIC_NEUTRINO_LUMINOSITY, ISOTOPIC_NATURAL_ABUNDANCE } from './physics/constants'


import { groupBy, zip, sum, memoize } from 'lodash';

import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const evBins = (new Float64Array(1000)).map((v, i) => i * 0.01 + 0.005)


class App extends React.Component {
  constructor(props) {
    super(props)
    this.plot = React.createRef();

    this.state = {
      coreList: defaultCoreList,
      crossSection: "SV2003",
      massOrdering: "normal", // or "inverted"
      reactorLFStart: new Date("2018-01"),
      reactorLFEnd: new Date("2018-12"),
      detector: {
        current: "Boulby",
        lat: 54.555129,
        lon: -0.80089,
        elevation: -1050,
      },
      geoneutrino: {
        U238flux: 1e6, // cm-2 s-1
        ThURatio: 3.9, // no units
        KURatio: 1e4, // no units
        crustSignal: true
      },
      spectrum: {
        total: (new Float64Array(1000)).fill(0),
        iaea: (new Float64Array(1000)).fill(0),
        closest: (new Float64Array(1000)).fill(0),
        custom: (new Float64Array(1000)).fill(0),
        geoU: (new Float64Array(1000)).fill(0),
        geoTh: (new Float64Array(1000)).fill(0),
        geoK: (new Float64Array(1000)).fill(0)
      },
      distances: {
        closestIAEA: 10000,
        closestIAEAName: "",
        closestUser: 10000
      }
    }
  }
  componentDidMount = () => {
    setTimeout(() => {
      //this.state.coreList.map((core) => core.spectrumSV2003)
      //this.state.coreList.map((core) => core.spectrumVB1999)
      this.updateSpectrum();
    }, 10)
  }

  updateSpectrum = (newState = {}) => {
    const state = {...this.state, ...newState}
    let closestCoreSpectrum;
    let IAEACoreSpectrum;
    let CustomCoreSpectrum = (new Float64Array(1000)).fill(0);
    let closestUser, closestIAEA;

    let currentDistUser = 1e10;
    let currentDistIAEA = 1e10;

    const {lat, lon, elevation} = state.detector;
    const [x, y, z] = project(lat, lon, elevation).map((n)=> n/1000);

    const coreSignals = state.coreList.map((core) => {
      let dist = Math.hypot(x - core.x, y - core.y, z - core.z);
      const lf = core.loadFactor(state.reactorLFStart, state.reactorLFEnd)

      if (dist > 100){
        dist = Math.round(dist)
      }

      let spectrum;
      switch (state.crossSection){
        case "ESMUTAU":
          spectrum = core.spectrumESMUTAU;
          break;
        case "ESANTI":
          spectrum = core.spectrumESANTI;
          break;
        case "VB1999":
          spectrum = core.spectrumVB1999;
          break;
        case "SV2003":
        default:
          spectrum = core.spectrumSV2003;
          break;
      }

      let oscillation;
      switch (state.massOrdering){
        case ("inverted"):
          oscillation = invertedNeutrinoOscilationSpectrum(dist);
          break;
        case ("normal"):
        default:
          oscillation = normalNeutrinoOscilationSpectrum(dist);
          break
      }

      if (state.crossSection === "ESMUTAU"){
        oscillation = oscillation.map((v) => 1 - v)
      }

      const distsq = dist ** 2;
      const power = core.power;
      const signal = zip(spectrum, oscillation).map(([spec, osc])=>{
        return (spec * osc * power * lf)/distsq
      });

      if (dist < currentDistIAEA && sum(signal) > 0){
        currentDistIAEA = dist;
        closestCoreSpectrum = signal;
        closestIAEA = core.name;
      }
      return signal
    });
    IAEACoreSpectrum = zip(...coreSignals).map(sum)

    const crustFlux = getCrustFlux(lon, lat)
    
    let crossSection;
    switch (state.crossSection){
      case "ESMUTAU":
        crossSection = crossSectionMuTauAntineutrinoES;
        break;
      case "ESANTI":
        crossSection = crossSectionElectronAntineutrinoES;
        break;
      case "VB1999":
        crossSection = crossSectionVB1999;
        break;
      case "SV2003":
      default:
        crossSection = crossSectionSV2003;
        break;
    }
    let survivalProbability;
    switch (state.massOrdering){
      case ("inverted"):
        survivalProbability = averageSurvivalProbabilityInverted;
        break;
      case ("normal"):
      default:
        survivalProbability = averageSurvivalProbabilityNormal;
        break;
    }
    const uMantleFlux = this.state.geoneutrino.U238flux;
    const geoU = antineutrinoSpectrum238U.map((v, i)=> {
      return v * (crustFlux.u * 1e6 + uMantleFlux) * SECONDS_PER_YEAR * crossSection((0.005 + i/100)) * 1e32 * survivalProbability;
    })
    const thMantleFlux = uMantleFlux * this.state.geoneutrino.ThURatio * (ISOTOPIC_NEUTRINO_LUMINOSITY.TH232/ISOTOPIC_NEUTRINO_LUMINOSITY.U238) * (ISOTOPIC_NATURAL_ABUNDANCE.TH232/ISOTOPIC_NATURAL_ABUNDANCE.U238);
    const geoTh = antineutrinoSpectrum232Th.map((v, i)=> {
      return v * (crustFlux.th * 1e6 + thMantleFlux) * SECONDS_PER_YEAR * crossSection((0.005 + i/100)) * 1e32 * survivalProbability;
    })
    const kMantleFlux = uMantleFlux * this.state.geoneutrino.KURatio * (ISOTOPIC_NEUTRINO_LUMINOSITY.K40/ISOTOPIC_NEUTRINO_LUMINOSITY.U238) * (ISOTOPIC_NATURAL_ABUNDANCE.K40/ISOTOPIC_NATURAL_ABUNDANCE.U238);
    const geoK = antineutrinoSpectrum40K.map((v, i)=> {
      return v * (crustFlux.th * 1e6 + kMantleFlux) * SECONDS_PER_YEAR * crossSection((0.005 + i/100)) * 1e32 * survivalProbability;
    })

    this.setState({
      ...state,
      spectrum: {
        total: IAEACoreSpectrum,
        iaea: IAEACoreSpectrum,
        closest: closestCoreSpectrum,
        custom: (new Float64Array(1000)).fill(0),
        geoU: geoU,
        geoTh: geoTh,
        geoK: geoK
      },
      distances: {
        closestIAEA: currentDistIAEA,
        closestIAEAName: closestIAEA,
        closestUser: 10000
      }
    })
  }
  changeMassOrder = (event) =>{
    this.updateSpectrum({massOrdering: event.currentTarget.value})
  }
  changeCrossSection = (event) =>{
    this.updateSpectrum({crossSection: event.currentTarget.value})
  }
  changeDetectorMode = (event) =>{
    const value = event.currentTarget.value;
    let newDetector = {current: value};
    if (value !== 'custom' && value !== 'follow'){
      let preset = presets.find(detector => detector.name === value);
      newDetector.lat = preset.lat;
      newDetector.lon = preset.lon;
      newDetector.elevation = preset.elevation;
    }
    this.updateSpectrum({detector:{...this.state.detector, ...newDetector}})
  }
  changeDetector = (newDetector) => {
    this.updateSpectrum({detector:{...this.state.detector, ...newDetector}})
  }
  mapMouseMove = (event) =>{
    if (this.state.detector.current !== 'follow'){
      return null;
    }
    let {lat, lng} = event.latlng;
    while (lng > 180){
     lng = lng - 360;
    }
    while (lng < -180){
      lng = lng + 360;
    }
    this.updateSpectrum({detector: {...this.state.detector, lat:lat, lon:lng}})
  }
  render() {
    const presetGroups = groupBy(presets,(detector) => detector.region)
    const presetOptions = Object.keys(presetGroups).map((key)=> {
      const group = presetGroups[key];
      const options = group.map((detector) => <option key={detector.name} value={detector.name}>{detector.name} ({detector.overburden} mwe)</option>)
      return <optgroup key={key} label={key}>{options}</optgroup>
    })

    return (
      <Container fluid={true}>
        <Row style={{ minHeight: "100vh" }}>
          <Col style={{minHeight:"50vh"}}>
            <NuMap 
            onMousemove={this.mapMouseMove} 
            coreList={this.state.coreList} 
            detectorList={presets} 
            detector={this.state.detector}
            changeDetector={this.changeDetector}
            />
          </Col>
          <Col lg={6} style={{maxHeight:"100vh", overflow:"scroll"}}>
            <Plot
              data={[
                {
                  x: evBins,
                  y: this.state.spectrum.geoK,
                  name: 'GeoK',
                  type: 'scatter',
                  mode: 'lines',
                  fill: 'tozerox',
                  marker: { color: 'yellow' },
                },
                {
                  x: evBins,
                  y: this.state.spectrum.geoU,
                  name: 'GeoU',
                  type: 'scatter',
                  mode: 'lines',
                  fill: 'tozerox',
                  marker: { color: 'blue' },
                },
                {
                  x: evBins,
                  y: this.state.spectrum.geoTh,
                  name: 'GeoTh',
                  type: 'scatter',
                  mode: 'lines',
                  fill: 'tozerox',
                  marker: { color: 'red' },
                },
                {
                  x: evBins,
                  y: this.state.spectrum.iaea,
                  name: 'Reactor Cores',
                  type: 'scatter',
                  mode: 'lines',
                  fill: 'tozerox',
                  marker: { color: 'green' },
                },
                {
                  x: evBins,
                  y: this.state.spectrum.closest,
                  name: `Closest IAEA Core\n (${this.state.distances.closestIAEAName})`,
                  type: 'scatter',
                  mode: 'lines',
                  marker: { dash:'dot'},
                },
              ]}
              layout={{ 
                title: `Antineutrino Spectrum: ${["custom", "follow"].includes(this.state.detector.current) ? "Custom Location" : this.state.detector.current} (${this.state.detector.lat.toFixed(1)}N, ${this.state.detector.lon.toFixed(1)}E)`,
                showlegend: true,
                legend: {
                  x: 1,
                  xanchor: 'right',
                  y: 1
                },
                autosize:true, 
                xaxis: {
                  title: {text: "Antineutrino Energy E (MeV)"}
                },
                yaxis: {
                  rangemode: 'nonnegative',
                  autorange: true,
                  title: {text:"Rate dR/dE (NIU/MeV)"}
                }
              }}
              useResizeHandler={true}
              style={{width: "100%"}}
              config={{toImageButtonOptions:{width: 900, height: 500, scale:2}}}
            />
            <Tabs defaultActiveKey="detector">
              <Tab eventKey="detector" title="Detector">
                <Card>
                  <Card.Body>
                    <Card.Title>Spectrum Stats</Card.Title>
                    <StatsPanel spectrum={this.state.spectrum} distances={this.state.distances}/>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Body>
                    <Card.Title>Physics</Card.Title>
                    <Form.Group controlId="neutrinoMassOrder">
                      <Form.Label>Neutrino Mass Ordering</Form.Label>
                      <Form.Control as="select" onChange={this.changeMassOrder} value={this.state.massOrdering}>
                        <option value="normal">Normal</option>
                        <option value="inverted">Inverted</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="neutrinoCrossSection">
                      <Form.Label>Neutrino Cross Section</Form.Label>
                      <Form.Control as="select" onChange={this.changeCrossSection} value={this.state.crossSection}>
                        <option value="VB1999">IBD: Vogel and Beacom (1999)</option>
                        <option value="SV2003">IBD: Strumia and Vissani (2003)</option>
                        <option value="ESANTI">Elastic Scattering: Electron Antineutrino</option>
                        <option value="ESMUTAU">Elastic Scattering: Mu Tau Antineutrino</option>
                      </Form.Control>
                    </Form.Group>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Body>
                    <Card.Title>Detector Location</Card.Title>
                    <Form.Group controlId="presetMode">
                      <Form.Label>Detector Presets/Modes</Form.Label>
                      <Form.Control as="select" onChange={this.changeDetectorMode} value={this.state.detector.current}>
                        <option value="follow">Follow Cursor on Map</option>
                        <option value="custom">Custom Detector Location</option>
                        {presetOptions}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="detectorLat">
                      <Form.Label>Latitude</Form.Label>
                      <InputGroup>
                        <Form.Control value={this.state.detector.lat} type="number" placeholder="0" step="0.1" />
                        <InputGroup.Append>
                          <InputGroup.Text>deg N</InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="detectorLon">
                      <Form.Label>Longitude</Form.Label>
                      <InputGroup>
                      <Form.Control value={this.state.detector.lon} type="number" placeholder="0" step="0.1" />
                        <InputGroup.Append>
                          <InputGroup.Text>deg E</InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="detectorElevation">
                      <Form.Label>Elevation</Form.Label>
                      <InputGroup>
                      <Form.Control value={this.state.detector.elevation} type="number" placeholder="0" step="1" />
                        <InputGroup.Append>
                          <InputGroup.Text>meters</InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Tab>
              <Tab eventKey="reactors" title="Reactors">
                <ul>
                  {this.state.coreList.sort(ReactorCore.sortCompare).map((core)=> <li key={core.name}>{core.name}</li>)}
                </ul>
              </Tab>
              <Tab eventKey="geonu" title="GeoNu">
                <Card>
                  <Card.Body>
                    <Card.Title>Mantle Flux</Card.Title>
                    <Form.Group controlId="u238flux">
                      <Form.Label><sup>238</sup>U Mantle Flux</Form.Label>
                      <InputGroup>
                        <Form.Control value={this.state.geoneutrino.U238flux} type="number" placeholder="0" step="0.1" />
                        <InputGroup.Append>
                          <InputGroup.Text>cm<sup>-2</sup>s<sup>-1</sup></InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="thuratio">
                      <Form.Label>Th/U Ratio</Form.Label>
                      <InputGroup>
                        <Form.Control value={this.state.geoneutrino.ThURatio} type="number" placeholder="0" step="0.1" />
                      </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="kuratio">
                      <Form.Label>K/U Ratio</Form.Label>
                      <InputGroup>
                        <Form.Control value={this.state.geoneutrino.KURatio} type="number" placeholder="0" step="0.1" />
                      </InputGroup>
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Tab>
              <Tab eventKey="output" title="Output">
                Output content
              </Tab>
              <Tab eventKey="about" title="About">
                About content
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
