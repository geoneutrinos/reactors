import React from 'react';

import { project } from 'ecef-projector';
import { Container, Row, Col, Tab, Tabs, Card, Form, InputGroup } from 'react-bootstrap';

import { NuSpectrumPlot } from './ui/plot'
import { NuMap, StatsPanel, CoreList, MantleFlux, CrustFlux, DetectorPhysicsPane } from './ui';
import { CoreIAEARange } from './ui/reactors-core-iaea-select'
import { defaultCores } from './reactor-cores';
import { presets } from './detectors';
import { getCrustFlux } from './crust-model';
import { averageSurvivalProbabilityNormal, averageSurvivalProbabilityInverted } from './physics/neutrino-oscillation';
import { antineutrinoSpectrum238U, antineutrinoSpectrum232Th, antineutrinoSpectrum40K } from './antineutrino-spectrum';
import { crossSectionSV2003, crossSectionElectronAntineutrinoES, crossSectionMuTauAntineutrinoES, crossSectionVB1999 } from './physics/neutrino-cross-section';
import { SECONDS_PER_YEAR, ISOTOPIC_NATURAL_ABUNDANCE } from './physics/constants';
import { ISOTOPIC_NEUTRINO_LUMINOSITY } from './physics/derived';


import { groupBy } from 'lodash';

import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

let cores = defaultCores;


class App extends React.Component {
  constructor(props) {
    super(props)
    this.plot = React.createRef();

    this.state = {
      coresVersion: 0,
      crossSection: "SV2003",
      massOrdering: "normal", // or "inverted"
      reactorLFStart: new Date("2018-01-01T00:00:00Z"),
      reactorLFEnd: new Date("2018-12-01T00:00:00Z"),
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
        geoU: (new Float64Array(1000)).fill(0),
        geoTh: (new Float64Array(1000)).fill(0),
        geoK: (new Float64Array(1000)).fill(0)
      },
    }
  }
  componentDidMount = () => {
    setTimeout(() => {
      //this.state.coreList.map((core) => core.spectrumSV2003)
      //this.state.coreList.map((core) => core.spectrumVB1999)
      this.incrimentCoresVersions();
    }, 10)
  }

  incrimentCoresVersions = () => {
    this.updateSpectrum({ coresVersion: this.statecoresVersion + 1 })
  }

  updateSpectrum = (newState = {}) => {
    const state = { ...this.state, ...newState }

    const { lat, lon, elevation } = state.detector;
    const [x, y, z] = project(lat, lon, elevation).map((n) => n / 1000);

    Object.values(cores).forEach((core) => {
      const dist = Math.hypot(x - core.x, y - core.y, z - core.z);
      const lf = core.loadFactor(state.reactorLFStart, state.reactorLFEnd)

      core.setSignal(dist, lf, state.massOrdering, state.crossSection);
    });

    let crustFlux = {
      u: 0,
      th: 0,
      k: 0,
    }

    if (state.geoneutrino.crustSignal === true){
      crustFlux = getCrustFlux(lon, lat)
    }

    let crossSection;
    switch (state.crossSection) {
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
    switch (state.massOrdering) {
      case ("inverted"):
        survivalProbability = averageSurvivalProbabilityInverted;
        break;
      case ("normal"):
      default:
        survivalProbability = averageSurvivalProbabilityNormal;
        break;
    }
    const uMantleFlux = state.geoneutrino.U238flux;
    const geoU = antineutrinoSpectrum238U.map((v, i) => {
      return v * (crustFlux.u * 1e6 + uMantleFlux) * SECONDS_PER_YEAR * crossSection((0.005 + i / 100)) * 1e32 * survivalProbability;
    })
    const thMantleFlux = uMantleFlux * state.geoneutrino.ThURatio * (ISOTOPIC_NEUTRINO_LUMINOSITY.TH232 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) * (ISOTOPIC_NATURAL_ABUNDANCE.TH232 / ISOTOPIC_NATURAL_ABUNDANCE.U238);
    const geoTh = antineutrinoSpectrum232Th.map((v, i) => {
      return v * (crustFlux.th * 1e6 + thMantleFlux) * SECONDS_PER_YEAR * crossSection((0.005 + i / 100)) * 1e32 * survivalProbability;
    })
    const kMantleFlux = uMantleFlux * state.geoneutrino.KURatio * (ISOTOPIC_NEUTRINO_LUMINOSITY.K40 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) * (ISOTOPIC_NATURAL_ABUNDANCE.K40 / ISOTOPIC_NATURAL_ABUNDANCE.U238);
    const geoK = antineutrinoSpectrum40K.map((v, i) => {
      return v * (crustFlux.k * 1e6 + kMantleFlux) * SECONDS_PER_YEAR * crossSection((0.005 + i / 100)) * 1e32 * survivalProbability;
    })

    this.setState({
      ...state,
      //cores: newCores,
      spectrum: {
        geoU: geoU,
        geoTh: geoTh,
        geoK: geoK
      },
    })
  }
  setMassOrdering = (value) => {
    this.updateSpectrum({ massOrdering: value })
  }
  setCrossSection = (value) => {
    this.updateSpectrum({ crossSection: value })
  }
  changeDetectorMode = (event) => {
    const value = event.currentTarget.value;
    let newDetector = { current: value };
    if (value !== 'custom' && value !== 'follow') {
      let preset = presets.find(detector => detector.name === value);
      newDetector.lat = preset.lat;
      newDetector.lon = preset.lon;
      newDetector.elevation = preset.elevation;
    }
    this.updateSpectrum({ detector: { ...this.state.detector, ...newDetector } })
  }
  changeDetector = (newDetector) => {
    this.updateSpectrum({ detector: { ...this.state.detector, ...newDetector } })
  }
  mapMouseMove = (event) => {
    if (this.state.detector.current !== 'follow') {
      return null;
    }
    let { lat, lng } = event.latlng;
    while (lng > 180) {
      lng = lng - 360;
    }
    while (lng < -180) {
      lng = lng + 360;
    }
    this.updateSpectrum({ detector: { ...this.state.detector, lat: lat, lon: lng } })
  }
  render() {
    const presetGroups = groupBy(presets, (detector) => detector.region)
    const presetOptions = Object.keys(presetGroups).map((key) => {
      const group = presetGroups[key];
      const options = group.map((detector) => <option key={detector.name} value={detector.name}>{detector.name} ({detector.overburden} mwe)</option>)
      return <optgroup key={key} label={key}>{options}</optgroup>
    })

    return (
      <Container fluid={true}>
        <Row style={{ minHeight: "100vh" }}>
          <Col style={{ minHeight: "50vh" }}>
            <NuMap
              onMousemove={this.mapMouseMove}
              cores={cores}
              detectorList={presets}
              detector={this.state.detector}
              changeDetector={this.changeDetector}
            />
          </Col>
          <Col lg={6} style={{ maxHeight: "100vh", overflow: "scroll" }}>
           {this.state.coresVersion === 0 &&
            <h1>Loading...</h1>
            }
            <NuSpectrumPlot cores={cores} {...this.state} />
            <Tabs unmountOnExit={true} defaultActiveKey="detector">
              <Tab eventKey="detector" title="Detector">
                <StatsPanel cores={cores} spectrum={this.state.spectrum} />
                <DetectorPhysicsPane {...this.state} setCrossSection={this.setCrossSection} setMassOrdering={this.setMassOrdering}/>
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
                        <Form.Control value={this.state.detector.lat} type="number" placeholder="0" step="0.1" readOnly />
                        <InputGroup.Append>
                          <InputGroup.Text>deg N</InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="detectorLon">
                      <Form.Label>Longitude</Form.Label>
                      <InputGroup>
                        <Form.Control value={this.state.detector.lon} type="number" placeholder="0" step="0.1" readOnly />
                        <InputGroup.Append>
                          <InputGroup.Text>deg E</InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="detectorElevation">
                      <Form.Label>Elevation</Form.Label>
                      <InputGroup>
                        <Form.Control value={this.state.detector.elevation} type="number" placeholder="0" step="1" readOnly />
                        <InputGroup.Append>
                          <InputGroup.Text>meters</InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Tab>
              <Tab eventKey="reactors" title="Reactors">
                <CoreIAEARange {...this.state} updateSpectrum={this.updateSpectrum}/>
                <CoreList cores={cores} {...this.state} incrimentCoresVersions={this.incrimentCoresVersions} />
              </Tab>
              <Tab eventKey="geonu" title="GeoNu">
                <MantleFlux {...this.state} updateSpectrum={this.updateSpectrum}/>
                <CrustFlux {...this.state} updateSpectrum={this.updateSpectrum}/>
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
