import React from 'react';

import { Container, Row, Col, Tab, Tabs, Card, Form, InputGroup } from 'react-bootstrap';

//import { NuSpectrumPlot } from './ui/plot'
import { NuMap, StatsPanel } from './ui';
import { defaultCoreList, ReactorCore } from './reactor-cores';
import { presets } from './detectors';

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

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ready: false,
      coreList: defaultCoreList,
      physics: {
        crossSection: "SV2003",
        massOrdering: "normal", // or "inverted"
      },
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
    //setTimeout(() => {
    //  this.state.coreList.map((core) => core.spectrumSV2003)
    //  this.state.coreList.map((core) => core.spectrumVB1999)
    //  this.setState({ ready: true })
    //}, 10)
    this.setState({ ready: true })
  }

  updateSpectrum = () => {
    
  }

  render() {
    console.debug(this.state)
    //const presetGroups = groupBy(presets,(detector) => detector.region)
    //const presetOptions = Object.keys(presetGroups).map((key)=> {
    //  const group = presetGroups[key];
    //  const options = group.map((detector) => <option key={detector.name} value={detector.name}>{detector.name} ({detector.overburden} mwe)</option>)
    //  return <optgroup key={key} label={key}>{options}</optgroup>
    //})

    if (this.state.ready === false) {
      return <div>Doing an initial model run...</div>
    }

    return (
      <Container fluid={true}>
        <Row style={{ minHeight: "100vh" }}>
          <Col style={{minHeight:"50vh"}}>
            <NuMap coreList={this.state.coreList} />
          </Col>
          <Col lg={4} style={{maxHeight:"100vh", overflow:"scroll"}}>
            <h3>Reactor Antineutrinos</h3>
            <h1>Plot Goes Here</h1>
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
                      <Form.Control as="select" value={this.state.physics.massOrdering}>
                        <option value="normal">Normal</option>
                        <option value="inverted">Inverted</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="neutrinoCrossSection">
                      <Form.Label>Neutrino Cross Section</Form.Label>
                      <Form.Control as="select" value={this.state.physics.crossSection}>
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
