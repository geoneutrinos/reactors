import React, { useState, useMemo } from "react";

import { project } from "ecef-projector";
import { Container, Row, Col, Tab, Tabs } from "react-bootstrap";

import { NuSpectrumPlot, CoreDirectionPlot } from "./ui/plot";
import {
  NuMap,
  StatsPanel,
  CoreList,
  MantleFlux,
  CrustFlux,
  DetectorPhysicsPane,
  DetectorLocationPane,
} from "./ui";
import { CoreIAEARange } from "./ui/reactors-core-iaea-select";
import { defaultCores } from "./reactor-cores";
import { presets, detectorENUProjector } from "./detectors";
import { getCrustFlux } from "./crust-model";
import { mantleGeoSpectrum } from "./mantle";
import { XSNames } from "./physics/neutrino-cross-section";
import { MassOrdering } from "./physics/neutrino-oscillation";

import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";

import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

//let cores = defaultCores;

const defaultDetector = presets.find((detector) => detector.name === "Boulby");

function App(props) {
  const [massOrdering, setMassOrdering] = useState(MassOrdering.Normal);
  const [crossSection, setCrossSection] = useState(XSNames.SV2003);
  const [detector, setDetector] = useState({
    current: defaultDetector.name,
    ...defaultDetector,
  });
  const [reactorLF, setReactorLF] = useState({
    start: new Date("2018-01-01T00:00:00Z"),
    end: new Date("2018-12-01T00:00:00Z"),
  });

  const [coreMods, setCoreMods] = useState({});

  //geonu state
  const [includeCrust, setIncludeCrust] = useState(true);
  const [geoFluxRatios, setGeoFluxRatios] = useState({
    U238flux: 1e6, // cm-2 s-1
    ThURatio: 3.9, // no units
    KURatio: 1e4, // no units
  });


  const cores = useMemo(
    () => {
      const enuProject = detectorENUProjector(detector)
      const { lat, lon, elevation } = detector;
      const [x, y, z] = project(lat, lon, elevation).map((n) => n / 1000);

      return Object.fromEntries(
        Object.entries(defaultCores).map(([name, core]) => {
          const modCore = { ...core, ...coreMods[name] };
          const dist = Math.hypot(x - modCore.x, y - modCore.y, z - modCore.z);
          const lf = modCore.loadFactor(reactorLF.start, reactorLF.end);

          const direction = enuProject([modCore.x - x, modCore.y - y, modCore.z - z])

          return [
            name,
            modCore.setSignal(dist, lf, massOrdering, crossSection, direction),
          ];
        })
      )},
    [coreMods, reactorLF, crossSection, massOrdering, detector]
  );

  const crustFlux = {
    u: 0,
    th: 0,
    k: 0,
    ...(includeCrust ? getCrustFlux(detector.lon, detector.lat) : {}),
  };
  const spectrum = useMemo(
    () =>
      mantleGeoSpectrum(crossSection, massOrdering, geoFluxRatios, crustFlux),
    [crossSection, massOrdering, geoFluxRatios, crustFlux]
  );

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
          <NuSpectrumPlot
            detector={detector}
            cores={cores}
            spectrum={spectrum}
          />
          <Tabs unmountOnExit={false} defaultActiveKey="detector">
            <Tab eventKey="detector" title="Detector">
              <CoreDirectionPlot cores={cores} />
              <StatsPanel
                cores={cores}
                spectrum={spectrum}
                crossSection={crossSection}
              />
              <DetectorLocationPane
                detector={detector}
                setDetector={setDetector}
              />
            </Tab>
            <Tab eventKey="reactors" title="Reactors">
              <CoreIAEARange
                reactorLF={reactorLF}
                setReactorLF={setReactorLF}
              />
              <CoreList
                cores={cores}
                reactorLF={reactorLF}
                coreMods={coreMods}
                setCoreMods={setCoreMods}
              />
            </Tab>
            <Tab eventKey="geonu" title="GeoNu">
              <MantleFlux
                geoFluxRatios={geoFluxRatios}
                setGeoFluxRatios={setGeoFluxRatios}
              />
              <CrustFlux
                includeCrust={includeCrust}
                setIncludeCrust={setIncludeCrust}
              />
            </Tab>
            <Tab eventKey="physics" title="Physics">
              <DetectorPhysicsPane
                crossSection={crossSection}
                massOrdering={massOrdering}
                setCrossSection={setCrossSection}
                setMassOrdering={setMassOrdering}
                XSNames={XSNames}
              />
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
