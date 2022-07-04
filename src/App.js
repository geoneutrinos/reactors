import React, { useState, useMemo, useReducer } from "react";

import { project } from "ecef-projector";
import { Container, Row, Col, Tab, Tabs } from "react-bootstrap";

import {
  // Left pane
  NuMap,

  // Right Pane
  NuSpectrumPlot,
  // Detector Tab
  StatsPanel,
  DetectorLocationPane,
  //Reactors Tab
  RASwitcher,
  CoreIAEARange,
  CoreList,
  //GeuNu Tab
  MantleFlux,
  CrustFlux,
  GeoFluxUncertainties,
  GeoRateFluxYields,
  GeoNuSpectrumSource,
  IsotopeData,
  //Direction Tab
  AnalemmaPlot,
  CoreDirectionPlot,
  CoreDirectionSignalPlots,
  //IBD/ES Tab
  DetectorPhysicsPane,
  CrossSectionPlots,
  DifferentialCrossSectionPlots,
  AngularDifferentialCrossSectionPlots,
  CDFdifferentialCrossSectionPlots,
  CDFAngularDifferentialCrossSectionPlots,
  //Input Tab
  NeutrinoOscillationPane,
  PhysicsOscillationPane,
  PhysicsConstants,
  ParticleMasses,
  FissionFractionPane,
  FissionIsotopeSpectraPlots,
  U235IsotopeSpectraPlots,
  U238IsotopeSpectraPlots,
  //Output Tab
  OutputDownload,
  CalculatorPanel,
  //solar tab
  AngularDifferentialCrossSectionPlotsNeutrinos,
  DifferentialCrossSectionPlotsNeutrinos,
  CDFdifferentialCrossSectionPlotsNeutrinos,
  CDFAngularDifferentialCrossSectionPlotsNeutrinos,
  Boron8KEPlot,
  Boron8SpectraPlot,
  CrossSectionPlotsNormal,
  //SN nus tab
  SupernovaNusPane,

  // Custom Core UI
  AddCustomCoreModal,
  ManageCustomCoreModal,
  //Helpers
  Visible,
} from "./ui";

import { defaultCores } from "./reactor-cores";
import { presets, detectorENUProjector } from "./detectors";
import { getCrustFlux } from "./crust-model";
import { geoSpectrum } from "./mantle";

import { crossSection as initialCrossSection } from "./physics/neutrino-cross-section";
import { crossSectionReducer } from "./physics/neutrino-cross-section";

import { oscillation as initalOscillation } from "./physics/neutrino-oscillation";
import { oscillationReducer } from "./physics/neutrino-oscillation";

import { reactorAntineutrinoModel as initalReactorAntineutrinoModel } from "./physics/reactor-antineutrinos";
import { reactorAntineutrinoModelReducer } from "./physics/reactor-antineutrinos";

import { defaultBoron8 } from "./solar";

import { PhysicsContext } from "./state";

import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";

import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

const defaultDetector = presets.find((detector) => detector.name === "SURF");

function App(props) {
  const [oscillation, oscillationDispatch] = useReducer(
    oscillationReducer,
    initalOscillation
  );
  const [crossSection, crossSectionDispatch] = useReducer(
    crossSectionReducer,
    initialCrossSection
  );

  const [reactorAntineutrinoModel, reactorAntineutrinoModelDispatch] = useReducer(
    reactorAntineutrinoModelReducer,
    initalReactorAntineutrinoModel
  );

  const [detector, setDetector] = useState({
    current: defaultDetector.name,
    ...defaultDetector,
  });
  const [reactorLF, setReactorLF] = useState({
    start: new Date("2021-01-01T00:00:00Z"),
    end: new Date("2021-12-01T00:00:00Z"),
  });

  const [coreMods, setCoreMods] = useState({});
  const [customCores, setCustomCores] = useState({});

  //geonu state
  const [includeCrust, setIncludeCrust] = useState(true);
  const [geoFluxRatios, setGeoFluxRatios] = useState({
    U238flux: 1e6, // cm-2 s-1
    ThURatio: 3.9, // no units
    KURatio: 1e4, // no units
  });

  // UI State
  const [addCustomModal, setAddCustomModal] = useState(false);
  const [addCustomModalXY, setAddCustomModalXY] = useState({});
  const [manCustomModal, setManCustomModal] = useState(false);
  const [activeTab, setActiveTab] = useState("detector")

  const addCustomModelWithLoc = ({ lon, lat }) => {
    setAddCustomModal(true);
    setAddCustomModalXY({ lon: lon, lat: lat });
  };

  const cores = useMemo(() => {
    const enuProject = detectorENUProjector(detector);
    const { lat, lon, elevation } = detector;
    const [x, y, z] = project(lat, lon, elevation).map((n) => n / 1000);

    const tmpCores = { ...defaultCores, ...customCores };

    return Object.fromEntries(
      Object.entries(tmpCores).map(([name, core]) => {
        const modCore = { ...core, ...coreMods[name] };
        const dist = Math.hypot(x - modCore.x, y - modCore.y, z - modCore.z);
        const lf = modCore.loadFactor(reactorLF.start, reactorLF.end);

        const direction = enuProject([
          modCore.x - x,
          modCore.y - y,
          modCore.z - z,
        ]);

        return [
          name,
          modCore.setSignal(dist, lf, oscillation, crossSection, direction, reactorAntineutrinoModel),
        ];
      })
    );
  }, [coreMods, reactorLF, crossSection, oscillation, detector, customCores, reactorAntineutrinoModel]);

  const crustFlux = useMemo(() => {
    return {
      u: 0,
      th: 0,
      k: 0,
      ...(includeCrust ? getCrustFlux(detector.lon, detector.lat) : {}),
    };
  }, [includeCrust, detector]);
  const geo = useMemo(
    () =>
      geoSpectrum(crossSection, oscillation, geoFluxRatios, crustFlux),
    [crossSection, oscillation, geoFluxRatios, crustFlux]
  );

  const boron8 = useMemo(() => defaultBoron8.updateRate(crossSection, reactorLF), [
    crossSection, reactorLF
  ]);

  const physicsContextValue = {
    oscillation: oscillation,
    oscillationDispatch: oscillationDispatch,
    crossSection: crossSection,
    crossSectionDispatch: crossSectionDispatch,
    reactorAntineutrinoModel: reactorAntineutrinoModel, 
    reactorAntineutrinoModelDispatch: reactorAntineutrinoModelDispatch,
  };
  return (
    <PhysicsContext.Provider value={physicsContextValue}>
      <Container fluid={true}>
        <Row style={{ minHeight: "100vh" }}>
          <Col style={{ minHeight: "50vh" }}>
            <NuMap
              cores={defaultCores}
              customCores={customCores}
              detectorList={presets}
              detector={detector}
              setDetector={setDetector}
              setCore={addCustomModelWithLoc}
            />
          </Col>
          <Col lg={6} style={{ maxHeight: "100vh", overflow: "scroll" }}>
            <NuSpectrumPlot
              detector={detector}
              cores={cores}
              geo={geo}
              reactorLF={reactorLF}
            />
            <Tabs unmountOnExit={false} activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
              <Tab eventKey="detector" title="Detector">
                <Visible>
                  <StatsPanel cores={cores} geo={geo} reactorLF={reactorLF}/>
                  <DetectorLocationPane
                    detector={detector}
                    setDetector={setDetector}
                  />
                </Visible>
              </Tab>
              <Tab eventKey="reactors" title="Reactors">
                <RASwitcher active={activeTab === "reactors"}/>
                <AddCustomCoreModal
                  {...addCustomModalXY}
                  show={addCustomModal}
                  customCores={customCores}
                  setCustomCores={setCustomCores}
                  close={() => {
                    setAddCustomModalXY({});
                    setAddCustomModal(false);
                  }}
                />
                <ManageCustomCoreModal
                  show={manCustomModal}
                  customCores={customCores}
                  setCustomCores={setCustomCores}
                  close={() => setManCustomModal(false)}
                />
                <CoreIAEARange
                  reactorLF={reactorLF}
                  setReactorLF={setReactorLF}
                />
                <CoreList
                  addCustomModal={() => setAddCustomModal(true)}
                  manCustomModal={() => setManCustomModal(true)}
                  cores={cores}
                  reactorLF={reactorLF}
                  coreMods={coreMods}
                  setCoreMods={setCoreMods}
                  // The following is for the download filename...
                  detector={detector}
                />
              </Tab>
              <Tab eventKey="geonu" title="GeoNu">
                <Visible>
                  <MantleFlux
                    geoFluxRatios={geoFluxRatios}
                    setGeoFluxRatios={setGeoFluxRatios}
                    geo={geo}
                  />
                  <CrustFlux
                    includeCrust={includeCrust}
                    setIncludeCrust={setIncludeCrust}
                  />
                  <GeoFluxUncertainties />
                  <GeoRateFluxYields />
                  <GeoNuSpectrumSource />
                  <IsotopeData />
                </Visible>
              </Tab>
              <Tab eventKey="ccsnnu" title="SNNu">
                <Visible>
                  <SupernovaNusPane />
                </Visible>
              </Tab>
              <Tab eventKey="solarnu" title="SolarNu">
                <Visible>
                  <Boron8SpectraPlot boron8={boron8} reactorLF={reactorLF} />
                  <Boron8KEPlot boron8={boron8} />
                  <CrossSectionPlotsNormal />
                  <DifferentialCrossSectionPlotsNeutrinos />
                  <CDFdifferentialCrossSectionPlotsNeutrinos />
                  <AngularDifferentialCrossSectionPlotsNeutrinos />
                  <CDFAngularDifferentialCrossSectionPlotsNeutrinos />
                </Visible>
              </Tab>
              <Tab eventKey="directionality" title="Direction">
                <Visible>
                  <AnalemmaPlot boron8={boron8} detector={detector} cores={cores} reactorLF={reactorLF} />
                  <CoreDirectionPlot cores={cores} detector={detector} />
                  <CoreDirectionSignalPlots
                    cores={cores}
                    detector={detector}
                    reactorLF={reactorLF}
                  />
                </Visible>
              </Tab>
              <Tab eventKey="ibd/es" title="IBD/ES">
                <Visible>
                  <DetectorPhysicsPane />
                  <CrossSectionPlots />
                  <DifferentialCrossSectionPlots />
                  <CDFdifferentialCrossSectionPlots />
                  <AngularDifferentialCrossSectionPlots />
                  <CDFAngularDifferentialCrossSectionPlots />
                </Visible>
              </Tab>
              <Tab eventKey="input" title="Input">
                <Visible>
                  <NeutrinoOscillationPane />
                  <PhysicsOscillationPane />
                  <ParticleMasses />
                  <PhysicsConstants />
                  <FissionFractionPane />
                  <FissionIsotopeSpectraPlots />
                  <U235IsotopeSpectraPlots />
                  <U238IsotopeSpectraPlots />
                </Visible>
              </Tab>
              <Tab eventKey="output" title="Output">
                <h5> REFERENCE </h5>
                  <p> The model presented by this website is further documented here{" "}
                  <a href="https://arxiv.org/pdf/1510.05633.pdf">arXiv:1510.05633.v3</a>. 
                  Cite this paper when using the results of this model in your research papers and presentations.
                  </p>
                <Visible>
                  <OutputDownload
                    geo={geo}
                    cores={cores}
                    detector={detector}
                    boron8={boron8}
                  />
                </Visible>
                <CalculatorPanel cores={cores} geo={geo} active={activeTab === "output"}/>
                <h5> ACKNOWLEDGMENT </h5>
                  <p> Development of the model and this web application is supported in part by Lawrence Livermore National 
                  Security, LLC. 
                  </p>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </PhysicsContext.Provider>
  );
}

export default App;
