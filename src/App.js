import React from 'react';

import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import { Container, Row, Col} from 'react-bootstrap';

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
    this.state ={
      ready: false,
      crustFlux: "",
      normal: "",
      inverted: "",
      //coreList: defaultCoreList
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
    if (this.state.ready === false){
      return <div>Doing an initial model run...</div>
    }
    return (
      <Container fluid={true}>
        <Row style={{minHeight: "100vh"}}>
          <Col>
            <Map style={{height: "100%"}} center={[0,0]} zoom={2}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              />
              <Marker position={[51.505, -0.09]}>
                <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
              </Marker>
            </Map>
          </Col>
          <Col lg={4}><h1>Reactors</h1></Col>
        </Row>
      </Container>
    );
  }
}

export default App;
