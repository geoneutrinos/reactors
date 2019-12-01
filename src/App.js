import React from 'react';
import { getCrustFlux } from './crust-model'
import { normalNeutrinoOscilationSpectrum, invertedNeutrinoOscilationSpectrum } from './physics/neutrino-oscillation'
import { defaultCoreList, ReactorCore } from './reactor-cores'
import {memoize} from 'lodash';

let memoed_nuosc = memoize(normalNeutrinoOscilationSpectrum)
let memoedi_nuosc = memoize(invertedNeutrinoOscilationSpectrum)

const CoreList = () => {
  let items = defaultCoreList.sort(ReactorCore.sortCompare).map((core) => (<li key={core.name}>
    {core.name}
    </li>))
  return (
    <ul>
      {items}
    </ul>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      crustFlux: "",
      normal: "",
      inverted: ""
    }
  }
  componentDidMount = () => {
    setInterval(() => {
      const lat = Math.random() * 180 - 90;
      const lon = Math.random() * 360 - 180;
      const dist = Math.floor(Math.random() * 6000);
      const crustFlux = JSON.stringify(getCrustFlux(lon,lat));
      const normal= JSON.stringify(memoed_nuosc(dist)[0]);
      const invert = JSON.stringify(memoedi_nuosc(dist)[0]);
      if (crustFlux === '{}'){
        console.log(lon, lat)
      }
      this.setState({crustFlux: crustFlux, normal: normal, invert: invert});
    }, 1)
  }

  render() {
    return (
      <div className="App">
        {this.state.crustFlux}<br/>
        {this.state.normal}<br/>
        {this.state.invert}<br/>
        {this.state.normal - this.state.invert}<br/>
        <CoreList />
      </div>
    );
  }
}

export default App;
