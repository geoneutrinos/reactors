import React, {useState, useEffect} from 'react';

import { project } from 'ecef-projector';
import { Container, Row, Col, Tab, Tabs } from 'react-bootstrap';

import { NuSpectrumPlot } from './ui/plot'
import { NuMap, StatsPanel, CoreList, MantleFlux, CrustFlux, DetectorPhysicsPane, DetectorLocationPane } from './ui';
import { CoreIAEARange } from './ui/reactors-core-iaea-select'
import { defaultCores } from './reactor-cores';
import { presets } from './detectors';
import { getCrustFlux } from './crust-model';
import { averageSurvivalProbabilityNormal, averageSurvivalProbabilityInverted } from './physics/neutrino-oscillation';
import { antineutrinoSpectrum238U, antineutrinoSpectrum232Th, antineutrinoSpectrum40K } from './antineutrino-spectrum';
import { XSFuncs, XSNames } from './physics/neutrino-cross-section';
import { SECONDS_PER_YEAR, ISOTOPIC_NATURAL_ABUNDANCE } from './physics/constants';
import { ISOTOPIC_NEUTRINO_LUMINOSITY } from './physics/derived';


import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

//let cores = defaultCores;

const defaultDetector = presets.find(detector => detector.name === "Boulby")

function App(props){
  const [appLoaded, setAppLoaded] = useState(false);

  const [massOrdering, setMassOrdering] = useState("normal")
  const [crossSection, setCrossSection] = useState(XSNames.SV2003)
  const [detector, setDetector] = useState({current: defaultDetector.name, ...defaultDetector})

  const [state, setState] = useState({
      reactorLFStart: new Date("2018-01-01T00:00:00Z"),
      reactorLFEnd: new Date("2018-12-01T00:00:00Z"),
      geoneutrino: {
        U238flux: 1e6, // cm-2 s-1
        ThURatio: 3.9, // no units
        KURatio: 1e4, // no units
        crustSignal: true
      },
  })
  useEffect(() => updateSpectrum({}), [])

  const updateSpectrum = (newState = {}) => {
    console.log("newState", newState)
    const nstate = { ...state, ...newState }

    setAppLoaded(true)
    setState({
      ...nstate,
    })
  }

  const mapMouseMove = (event) => {
    if (detector.current !== 'follow') {
      return null;
    }
    let { lat, lng } = event.latlng;
    while (lng > 180) {
      lng = lng - 360;
    }
    while (lng < -180) {
      lng = lng + 360;
    }
    setDetector({ ...detector, lat: lat, lon: lng })
  }

  const { lat, lon, elevation } = detector;
  const [x, y, z] = project(lat, lon, elevation).map((n) => n / 1000);

  const cores = Object.fromEntries(Object.entries(defaultCores).map(([name, core]) => {
    const dist = Math.hypot(x - core.x, y - core.y, z - core.z);
    const lf = core.loadFactor(state.reactorLFStart, state.reactorLFEnd)

    return [name, core.setSignal(dist, lf, massOrdering, crossSection)];
  }));

  let crustFlux = {
    u: 0,
    th: 0,
    k: 0,
  }

  if (state.geoneutrino.crustSignal === true){
    crustFlux = getCrustFlux(detector.lon, detector.lat)
  }

  const XSFunc = XSFuncs[crossSection]

  const survivalProbability = {
    "inverted": averageSurvivalProbabilityInverted,
    "normal": averageSurvivalProbabilityNormal,
  }[massOrdering]
  console.log("survivalProb", survivalProbability)

  const uMantleFlux = state.geoneutrino.U238flux;
  const geoU = antineutrinoSpectrum238U.map((v, i) => {
    return v * (crustFlux.u * 1e6 + uMantleFlux) * SECONDS_PER_YEAR * XSFunc((0.005 + i / 100)) * 1e32 * survivalProbability;
  })
  const thMantleFlux = uMantleFlux * state.geoneutrino.ThURatio * (ISOTOPIC_NEUTRINO_LUMINOSITY.TH232 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) * (ISOTOPIC_NATURAL_ABUNDANCE.TH232 / ISOTOPIC_NATURAL_ABUNDANCE.U238);
  const geoTh = antineutrinoSpectrum232Th.map((v, i) => {
    return v * (crustFlux.th * 1e6 + thMantleFlux) * SECONDS_PER_YEAR * XSFunc((0.005 + i / 100)) * 1e32 * survivalProbability;
  })
  const kMantleFlux = uMantleFlux * state.geoneutrino.KURatio * (ISOTOPIC_NEUTRINO_LUMINOSITY.K40 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) * (ISOTOPIC_NATURAL_ABUNDANCE.K40 / ISOTOPIC_NATURAL_ABUNDANCE.U238);
  const geoK = antineutrinoSpectrum40K.map((v, i) => {
    return v * (crustFlux.k * 1e6 + kMantleFlux) * SECONDS_PER_YEAR * XSFunc((0.005 + i / 100)) * 1e32 * survivalProbability;
  })
  const spectrum ={
    geoU:geoU,
    geoTh: geoTh,
    geoK: geoK,
  }
  console.log(spectrum)
  return (
      <Container fluid={true}>
        <Row style={{ minHeight: "100vh" }}>
          <Col style={{ minHeight: "50vh" }}>
            <NuMap
              onMousemove={mapMouseMove}
              cores={defaultCores}
              detectorList={presets}
              detector={detector}
              changeDetector={setDetector}
            />
          </Col>
          <Col lg={6} style={{ maxHeight: "100vh", overflow: "scroll" }}>
           {!appLoaded &&
            <h1>Loading...</h1>
            }
            <NuSpectrumPlot detector={detector} cores={cores} spectrum={spectrum}/>
            <Tabs unmountOnExit={false} defaultActiveKey="detector">
              <Tab eventKey="detector" title="Detector">
                <StatsPanel cores={cores} spectrum={spectrum} crossSection={crossSection}/>
                <DetectorPhysicsPane crossSection={crossSection} massOrdering={massOrdering} setCrossSection={setCrossSection} setMassOrdering={setMassOrdering} XSNames={XSNames}/>
                <DetectorLocationPane detector={detector} setDetector={setDetector} updateSpectrum={updateSpectrum}/>
             </Tab>
              <Tab eventKey="reactors" title="Reactors">
                <CoreIAEARange {...state} updateSpectrum={updateSpectrum}/>
                <CoreList cores={cores} {...state} updateSpectrum={updateSpectrum} />
              </Tab>
              <Tab eventKey="geonu" title="GeoNu">
                <MantleFlux {...state} updateSpectrum={updateSpectrum}/>
                <CrustFlux {...state} updateSpectrum={updateSpectrum}/>
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

export default App;
