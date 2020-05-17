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


function App(props){
  const [appLoaded, setAppLoaded] = useState(false);

  const [state, setState] = useState({
      cores: defaultCores,
      crossSection: XSNames.SV2003,
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
  })
  useEffect(() => updateSpectrum({}), [])

  const updateSpectrum = (newState = {}) => {
    const nstate = { ...state, ...newState }

    const { lat, lon, elevation } = nstate.detector;
    const [x, y, z] = project(lat, lon, elevation).map((n) => n / 1000);

    const newCores = Object.fromEntries(Object.entries(nstate.cores).map(([name, core]) => {
      const dist = Math.hypot(x - core.x, y - core.y, z - core.z);
      const lf = core.loadFactor(nstate.reactorLFStart, nstate.reactorLFEnd)

      return [name, core.setSignal(dist, lf, nstate.massOrdering, nstate.crossSection)];
    }));

    let crustFlux = {
      u: 0,
      th: 0,
      k: 0,
    }

    if (nstate.geoneutrino.crustSignal === true){
      crustFlux = getCrustFlux(lon, lat)
    }

    const crossSection = XSFuncs[nstate.crossSection]

    let survivalProbability;
    switch (nstate.massOrdering) {
      case ("inverted"):
        survivalProbability = averageSurvivalProbabilityInverted;
        break;
      case ("normal"):
      default:
        survivalProbability = averageSurvivalProbabilityNormal;
        break;
    }
    const uMantleFlux = nstate.geoneutrino.U238flux;
    const geoU = antineutrinoSpectrum238U.map((v, i) => {
      return v * (crustFlux.u * 1e6 + uMantleFlux) * SECONDS_PER_YEAR * crossSection((0.005 + i / 100)) * 1e32 * survivalProbability;
    })
    const thMantleFlux = uMantleFlux * nstate.geoneutrino.ThURatio * (ISOTOPIC_NEUTRINO_LUMINOSITY.TH232 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) * (ISOTOPIC_NATURAL_ABUNDANCE.TH232 / ISOTOPIC_NATURAL_ABUNDANCE.U238);
    const geoTh = antineutrinoSpectrum232Th.map((v, i) => {
      return v * (crustFlux.th * 1e6 + thMantleFlux) * SECONDS_PER_YEAR * crossSection((0.005 + i / 100)) * 1e32 * survivalProbability;
    })
    const kMantleFlux = uMantleFlux * nstate.geoneutrino.KURatio * (ISOTOPIC_NEUTRINO_LUMINOSITY.K40 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) * (ISOTOPIC_NATURAL_ABUNDANCE.K40 / ISOTOPIC_NATURAL_ABUNDANCE.U238);
    const geoK = antineutrinoSpectrum40K.map((v, i) => {
      return v * (crustFlux.k * 1e6 + kMantleFlux) * SECONDS_PER_YEAR * crossSection((0.005 + i / 100)) * 1e32 * survivalProbability;
    })

    setAppLoaded(true)
    setState({
      ...nstate,
      cores: newCores,
      spectrum: {
        geoU: geoU,
        geoTh: geoTh,
        geoK: geoK
      },
    })
  }
  const setMassOrdering = (value) => {
    updateSpectrum({ massOrdering: value })
  }
  const setCrossSection = (value) => {
    updateSpectrum({ crossSection: value })
  }
  const setDetectorMode = (event) => {
    const value = event.currentTarget.value;
    let newDetector = { current: value };
    if (value !== 'custom' && value !== 'follow') {
      let preset = presets.find(detector => detector.name === value);
      newDetector.lat = preset.lat;
      newDetector.lon = preset.lon;
      newDetector.elevation = preset.elevation;
    }
    updateSpectrum({ detector: { ...state.detector, ...newDetector } })
  }
  const setDetector = (newDetector) => {
    updateSpectrum({ detector: { ...state.detector, ...newDetector } })
  }
  const mapMouseMove = (event) => {
    if (state.detector.current !== 'follow') {
      return null;
    }
    let { lat, lng } = event.latlng;
    while (lng > 180) {
      lng = lng - 360;
    }
    while (lng < -180) {
      lng = lng + 360;
    }
    updateSpectrum({ detector: { ...state.detector, lat: lat, lon: lng } })
  }
  return (
      <Container fluid={true}>
        <Row style={{ minHeight: "100vh" }}>
          <Col style={{ minHeight: "50vh" }}>
            <NuMap
              onMousemove={mapMouseMove}
              cores={defaultCores}
              detectorList={presets}
              detector={state.detector}
              changeDetector={setDetector}
            />
          </Col>
          <Col lg={6} style={{ maxHeight: "100vh", overflow: "scroll" }}>
           {!appLoaded &&
            <h1>Loading...</h1>
            }
            <NuSpectrumPlot cores={state.cores} {...state} />
            <Tabs unmountOnExit={false} defaultActiveKey="detector">
              <Tab eventKey="detector" title="Detector">
                <StatsPanel cores={state.cores} spectrum={state.spectrum} crossSection={state.crossSection}/>
                <DetectorPhysicsPane {...state} setCrossSection={setCrossSection} setMassOrdering={setMassOrdering} XSNames={XSNames}/>
                <DetectorLocationPane {...state} setDetectorMode={setDetectorMode} updateSpectrum={updateSpectrum}/>
             </Tab>
              <Tab eventKey="reactors" title="Reactors">
                <CoreIAEARange {...state} updateSpectrum={updateSpectrum}/>
                <CoreList cores={state.cores} {...state} updateSpectrum={updateSpectrum} />
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
