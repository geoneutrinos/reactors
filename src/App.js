import React from 'react';

import { project } from 'ecef-projector';
import { Container, Row, Col, Tab, Tabs, Card, Form, InputGroup } from 'react-bootstrap';

import { normalNeutrinoOscilationSpectrum, invertedNeutrinoOscilationSpectrum} from './physics/neutrino-oscillation'

import { NuSpectrumPlot } from './ui/plot'
import { NuMap, StatsPanel } from './ui';
import { defaultCoreList, ReactorCore } from './reactor-cores';
import { presets } from './detectors';

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


const MEM_normalNeutrinoOscilationSpectrum = memoize(normalNeutrinoOscilationSpectrum)
const MEM_invertedNeutrinoOscilationSpectrum = memoize(invertedNeutrinoOscilationSpectrum)

class App extends React.Component {
  constructor(props) {
    super(props)
    this.plot = React.createRef();

    this.state = {
      coreList: defaultCoreList,
      crossSection: "SV2003",
      massOrdering: "normal", // or "inverted"
      detector: {
        follow: true,
        preset: "Boulby",
        lat: 54.555129,
        lon: -0.80089,
        elevation: -1050,
      },
      geoneutrino: {
        mantleSignal: 8.2, //TNU
        ThURatio: 3.9, //no units
        crustSignal: true
      },
      spectrum: {
        total: (new Float64Array(1000)).fill(0),
        iaea: (new Float64Array(1000)).fill(0),
        closest: (new Float64Array(1000)).fill(0),
        custom: (new Float64Array(1000)).fill(0),
        geoU: (new Float64Array(1000)).fill(0),
        geoTh: (new Float64Array(1000)).fill(0)
      },
      distances: {
        closestIAEA: 10000,
        closestUser: 10000
      }
    }
  }
  componentDidMount = () => {
    setTimeout(() => {
      this.state.coreList.map((core) => core.spectrumSV2003)
      this.state.coreList.map((core) => core.spectrumVB1999)
      this.updateSpectrum();
    }, 10)
  }

  updateSpectrum = () => {
    let closestCoreSpectrum = (new Float64Array(1000)).fill(0);
    let IAEACoreSpectrum = (new Float64Array(1000)).fill(0);
    let CustomCoreSpectrum = (new Float64Array(1000)).fill(0);
    let closestUser, closestIAEA;

    let currentDistUser = 1e10;
    let currentDistIAEA = 1e10;

    const {lat, lon, elevation} = this.state.detector;
    const [x, y, z] = project(lat, lon, elevation).map((n)=> n/1000);

    this.state.coreList.map((core) => {
      let dist = Math.hypot(x - core.x, y - core.y, z - core.z);

      if (dist > 100){
        dist = Math.round(dist)
      }

      let spectrum;
      switch (this.state.crossSection){
        case "VB1999":
          spectrum = core.spectrumVB1999;
          break;
        case "SV2003":
        default:
          spectrum = core.spectrumSV2003;
          break;
      }

      let oscillation;
      switch (this.state.massOrdering){
        case ("inverted"):
          oscillation = MEM_invertedNeutrinoOscilationSpectrum(dist);
          break;
        case ("normal"):
        default:
          oscillation = MEM_normalNeutrinoOscilationSpectrum(dist);
          break
      }

      const signal = zip(spectrum, oscillation).map(([spec, osc])=>{
        return (spec * osc * core.power)/(dist ** 2)
      });

      IAEACoreSpectrum = zip(IAEACoreSpectrum, signal).map(sum)
    });
    console.log('stateupdate')
    this.setState({
      spectrum: {
        total: IAEACoreSpectrum,
        iaea: IAEACoreSpectrum,
        closest: (new Float64Array(1000)).fill(0),
        custom: (new Float64Array(1000)).fill(0),
        geoU: (new Float64Array(1000)).fill(0),
        geoTh: (new Float64Array(1000)).fill(0)
      },
    })
  }
  changeMassOrder = (event) =>{
    this.setState({massOrdering: event.currentTarget.value}, this.updateSpectrum)
  }
  changeCrossSection = (event) =>{
    this.setState({crossSection: event.currentTarget.value}, this.updateSpectrum)
  }
  mapMouseMove = (event) =>{
    let {lat, lng} = event.latlng;
    while (lng > 180){
     lng = lng - 360;
    }
    while (lng < -180){
      lng = lng + 360;
    }
    this.setState({detector: {...this.state.detector, lat:lat, lon:lng}}, this.updateSpectrum)
  }
  render() {
    //const presetGroups = groupBy(presets,(detector) => detector.region)
    //const presetOptions = Object.keys(presetGroups).map((key)=> {
    //  const group = presetGroups[key];
    //  const options = group.map((detector) => <option key={detector.name} value={detector.name}>{detector.name} ({detector.overburden} mwe)</option>)
    //  return <optgroup key={key} label={key}>{options}</optgroup>
    //})

    return (
      <Container fluid={true}>
        <Row style={{ minHeight: "100vh" }}>
          <Col style={{minHeight:"50vh"}}>
            <NuMap onMousemove={this.mapMouseMove} coreList={this.state.coreList} />
          </Col>
          <Col lg={4} style={{maxHeight:"100vh", overflow:"scroll"}}>
            <h3>Reactor Antineutrinos</h3>
            <NuSpectrumPlot ref={this.plot}  spectrum={this.state.spectrum} />
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
                        <option value="VB1999">Vogel and Beacom (1999)</option>
                        <option value="SV2003">Strumia and Vissani (2003)</option>
                      </Form.Control>
                    </Form.Group>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Body>
                    <Card.Title>Detector Location</Card.Title>
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
                GeoNu content
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
