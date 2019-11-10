import React from 'react';
import { getCrustFlux } from './crust-model'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      crustFlux: ""
    }
  }
  componentDidMount = () => {
    setInterval(() => {
      const lat = Math.random() * 180 - 90;
      const lon = Math.random() * 360 - 180;
      const crustFlux = JSON.stringify(getCrustFlux(lon,lat));
      if (crustFlux === '{}'){
        console.log(lon, lat)
      }
      this.setState({crustFlux: crustFlux});
    }, 1)
  }

  render() {
    return (
      <div className="App">
        {this.state.crustFlux}
      </div>
    );
  }
}

export default App;
