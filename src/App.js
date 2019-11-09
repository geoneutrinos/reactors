import React from 'react';
import { getCrustFlux } from './crust-model'

function App() {
  return (
    <div className="App">
      {JSON.stringify(getCrustFlux(0,0))}
    </div>
  );
}

export default App;
