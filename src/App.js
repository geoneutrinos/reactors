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
  const [massOrdering, setMassOrdering] = useState("normal")
  const [crossSection, setCrossSection] = useState(XSNames.SV2003)
  const [detector, setDetector] = useState({current: defaultDetector.name, ...defaultDetector})
  const [reactorLF, setReactorLF] = useState({start: new Date("2018-01-01T00:00:00Z"), end: new Date("2018-12-01T00:00:00Z")})

  const [coreMods, setCoreMods] = useState({})

  //geonu state
  const [includeCrust, setIncludeCrust] = useState(true)
  const [geoFluxRatios, setGeoFluxRatios] = useState({
      U238flux: 1e6, // cm-2 s-1
      ThURatio: 3.9, // no units
      KURatio: 1e4, // no units
    })

  const { lat, lon, elevation } = detector;
  const [x, y, z] = project(lat, lon, elevation).map((n) => n / 1000);

  const cores = Object.fromEntries(Object.entries(defaultCores).map(([name, core]) => {
    const modCore = {...core, ...coreMods[name]}
    const dist = Math.hypot(x - modCore.x, y - modCore.y, z - modCore.z);
    const lf = modCore.loadFactor(reactorLF.start, reactorLF.end)

    return [name, modCore.setSignal(dist, lf, massOrdering, crossSection)];
  }));

  let crustFlux = {
    u: 0,
    th: 0,
    k: 0,
  }

  if (includeCrust === true){
    crustFlux = getCrustFlux(detector.lon, detector.lat)
  }

  const XSFunc = XSFuncs[crossSection]

  const survivalProbability = {
    "inverted": averageSurvivalProbabilityInverted,
    "normal": averageSurvivalProbabilityNormal,
  }[massOrdering]

  const uMantleFlux = geoFluxRatios.U238flux;
  const geoU = antineutrinoSpectrum238U.map((v, i) => {
    return v * (crustFlux.u * 1e6 + uMantleFlux) * SECONDS_PER_YEAR * XSFunc((0.005 + i / 100)) * 1e32 * survivalProbability;
  })
  const thMantleFlux = uMantleFlux * geoFluxRatios.ThURatio * (ISOTOPIC_NEUTRINO_LUMINOSITY.TH232 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) * (ISOTOPIC_NATURAL_ABUNDANCE.TH232 / ISOTOPIC_NATURAL_ABUNDANCE.U238);
  const geoTh = antineutrinoSpectrum232Th.map((v, i) => {
    return v * (crustFlux.th * 1e6 + thMantleFlux) * SECONDS_PER_YEAR * XSFunc((0.005 + i / 100)) * 1e32 * survivalProbability;
  })
  const kMantleFlux = uMantleFlux * geoFluxRatios.KURatio * (ISOTOPIC_NEUTRINO_LUMINOSITY.K40 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) * (ISOTOPIC_NATURAL_ABUNDANCE.K40 / ISOTOPIC_NATURAL_ABUNDANCE.U238);
  const geoK = antineutrinoSpectrum40K.map((v, i) => {
    return v * (crustFlux.k * 1e6 + kMantleFlux) * SECONDS_PER_YEAR * XSFunc((0.005 + i / 100)) * 1e32 * survivalProbability;
  })
  const spectrum ={
    geoU:geoU,
    geoTh: geoTh,
    geoK: geoK,
  }
  return (
      <Container fluid={true}>
        <Row style={{ minHeight: "100vh" }}>
          <Col style={{ minHeight: "50vh" }}>
            <NuMap
              cores={defaultCores}
              detectorList={presets}
              detector={detector}
              setDetector={setDetector}
            />
          </Col>
          <Col lg={6} style={{ maxHeight: "100vh", overflow: "scroll" }}>
            <NuSpectrumPlot detector={detector} cores={cores} spectrum={spectrum}/>
            <Tabs unmountOnExit={false} defaultActiveKey="detector">
              <Tab eventKey="detector" title="Detector">
                <StatsPanel cores={cores} spectrum={spectrum} crossSection={crossSection}/>
                <DetectorPhysicsPane crossSection={crossSection} massOrdering={massOrdering} setCrossSection={setCrossSection} setMassOrdering={setMassOrdering} XSNames={XSNames}/>
                <DetectorLocationPane detector={detector} setDetector={setDetector}/>
             </Tab>
              <Tab eventKey="reactors" title="Reactors">
                <CoreIAEARange reactorLF={reactorLF} setReactorLF={setReactorLF}/>
                <CoreList cores={cores} reactorLF={reactorLF} coreMods={coreMods} setCoreMods={setCoreMods}/>
              </Tab>
              <Tab eventKey="geonu" title="GeoNu">
                <MantleFlux geoFluxRatios={geoFluxRatios} setGeoFluxRatios={setGeoFluxRatios} />
                <CrustFlux includeCrust={includeCrust} setIncludeCrust={setIncludeCrust}/>
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
