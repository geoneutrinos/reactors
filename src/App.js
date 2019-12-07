import React from 'react';

import { Container, Row, Col } from 'react-bootstrap';

//import { NuSpectrumPlot } from './ui/plot'
import { NuMap } from './ui/map'
import { defaultCoreList} from './reactor-cores'

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
      crustFlux: "",
      normal: "",
      inverted: "",
      coreList: defaultCoreList
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

  render() {

    if (this.state.ready === false) {
      return <div>Doing an initial model run...</div>
    }

    return (
      <Container fluid={true}>
        <Row style={{ minHeight: "100vh" }}>
          <Col>
            <NuMap coreList={this.state.coreList} />
          </Col>
          <Col lg={4}><h1>Reactors</h1></Col>
        </Row>
      </Container>
    );
  }
}

export default App;
