import React, { useState, useMemo, useReducer } from "react";
import { MathJaxContext } from "better-react-mathjax";

import { Container, Row, Col, Tab, Tabs } from "react-bootstrap";
import { project } from "./lla-to-xyz";

import {
  // Left pane
  NuMap,

  CelestialBodySwitcher,

  // Right Pane
  NuSpectrumPlot,
  // Detector Tab
  StatsPanel,
  DetectorLocationPane,
  //Reactors Tab
  CoreIAEARange,
  CoreList,
  RASwitcher,
  FissionIsotopeSpectraPlotsHK,
  FissionIsotopeSpectraPlotsHM,
  FissionIsotopeSpectraPlotsES,
  FissionFractionPane,
  //GeuNu Tab
  GeoneutrinoResults,
  GeoNusPane,
  CrustFlux,
  MantleFlux,
  LayeredMantleFlux,
  GeoDensityPlot,
  GeoMassPlot,
  GeoIntegralPlot,
  GeophysicalResponsePlot,
  GeoDataPREM,
  GeoFluxUncertainties,
  GeoRateFluxYields,
  GeoNuSpectrumSource,
  IsotopeData,
  //Direction Tab
  CoreDirectionSignalPlots,
  CoreDirectionPlot,
  AnalemmaPlot,
  //pIBD/eES Tab
  DetectorPhysicsPane,
  CrossSectionPlots,
  SV03PercentDifference,
  ParticleMasses,
  PhysicsConstants,
  EesCouplingFactors,
  PesCouplingFactors,
  DifferentialCrossSectionPlots,
  AngularDifferentialCrossSectionPlots,
  CDFdifferentialCrossSectionPlots,
  CDFAngularDifferentialCrossSectionPlots,
  //NuOsc Tab
  NeutrinoOscillationPane,
  PhysicsOscillationPane,
  AverageSurvivalPane,
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
  SupernovaNus,
  //About tab
  AboutPane,
  // Lunar Tab
  Lunar238UFlux,
  Lunar232ThFlux,
  Lunar40KFlux,
  LunarThickness,
  LunarHeatFLux,
  // Muon tab
  Muons,
  DetectorOverburdens,
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
import {GeoCEvNS} from "./ui/geonu";

import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";

import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

const mathJaxConfig = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"]
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"]
    ]
  }
};


L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

const defaultDetector = presets.find((detector) => detector.name === "SNOLAB");

function App(props) {
  // Where is this?
  const [celestialBody, setCelestialBody] = useState("earth")

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
    start: new Date("2024-01-01T00:00:00Z"),
    end: new Date("2024-12-01T00:00:00Z"),
  });

  const [coreMods, setCoreMods] = useState({});
  const [customCores, setCustomCores] = useState({});

  //geonu state
  const [includeCrust, setIncludeCrust] = useState(true);
  const [earthGeoFluxRatios, setEarthGeoFluxRatios] = useState({
    U238flux: 1e6, // cm-2 s-1
    ThURatio: 3.9, // no units
    KURatio: 1e4, // no units
  });

  const [lunarGeoFluxRatios, setLunarGeoFluxRatios] = useState({
    U238flux: 1.61e5, // cm-2 s-1
    ThURatio: 3.92, // no units
    KURatio: 2956, // no units
  });


  // UI State
  const [addCustomModal, setAddCustomModal] = useState(false);
  const [addCustomModalXY, setAddCustomModalXY] = useState({});
  const [manCustomModal, setManCustomModal] = useState(false);
  const [activeTab, setActiveTab] = useState("detector")

  let geoFluxRatios = earthGeoFluxRatios;
  let setGeoFluxRatios = setEarthGeoFluxRatios;

  if (celestialBody === "moon"){
    geoFluxRatios = lunarGeoFluxRatios;
    setGeoFluxRatios = setLunarGeoFluxRatios;
  }

  const addCustomModelWithLoc = ({ lon, lat }) => {
    setAddCustomModal(true);
    setAddCustomModalXY({ lon: lon, lat: lat });
  };

  const cores = useMemo(() => {
    const enuProject = detectorENUProjector(detector);
    const { lat, lon, elevation } = detector;
    const [x, y, z] = project(lat, lon, elevation, celestialBody).map((n) => n / 1000);

    const tmpCores = { ...defaultCores, ...customCores };

    return Object.fromEntries(
      Object.entries(tmpCores).filter(([name, core]) => core.celestialBody === celestialBody ).map(([name, core]) => {
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
  }, [coreMods, reactorLF, crossSection, oscillation, detector, customCores, reactorAntineutrinoModel, celestialBody]);

  const crustFlux = useMemo(() => {
    return {
      u: 0,
      th: 0,
      k: 0,
      ...(includeCrust ? getCrustFlux(detector.lon, detector.lat, celestialBody) : {}),
    };
  }, [includeCrust, detector, celestialBody]);
  const geo = useMemo(
    () =>
      geoSpectrum(crossSection, oscillation, geoFluxRatios, crustFlux, celestialBody),
    [crossSection, oscillation, geoFluxRatios, crustFlux, celestialBody]
  );

  const geoCEvNS = useMemo(
    () =>
      geoSpectrum({crossSectionFunction: (_) => 1}, {averageSurvivalProbability: 1e-32}, geoFluxRatios, crustFlux, celestialBody),
    [crossSection, oscillation, geoFluxRatios, crustFlux, celestialBody]
  );
  
  const boron8 = useMemo(() => defaultBoron8.updateRate(crossSection, reactorLF), [
    crossSection, reactorLF
  ]);

  const physicsContextValue = {
    celestialBody,
    oscillation: oscillation,
    oscillationDispatch: oscillationDispatch,
    crossSection: crossSection,
    crossSectionDispatch: crossSectionDispatch,
    reactorAntineutrinoModel: reactorAntineutrinoModel,
    reactorAntineutrinoModelDispatch: reactorAntineutrinoModelDispatch,
  };
  return (
    <PhysicsContext.Provider value={physicsContextValue}>
      <MathJaxContext config={mathJaxConfig}>
      <Container fluid={true}>
        <Row style={{ minHeight: "100vh" }}>
          <Col style={{ minHeight: "50vh" }}>
            <NuMap
              cores={cores}
              detectorList={presets}
              detector={detector}
              setDetector={setDetector}
              setCore={addCustomModelWithLoc}
              celestialBody={celestialBody}
              key={celestialBody} // this is needed to force the entire component to remount
            />
          </Col>
          <Col lg={6} style={{ maxHeight: "100vh", overflow: "scroll" }}>
            <NuSpectrumPlot
              detector={detector}
              cores={cores}
              geo={geo}
              reactorLF={reactorLF}
              celestialBody={celestialBody}
            />
            <Tabs unmountOnExit={false} activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
              <Tab eventKey="detector" title="Detector">
                <Visible>
                  <CelestialBodySwitcher celestialBody={celestialBody} setCelestialBody={setCelestialBody} />
                  <StatsPanel cores={cores} geo={geo} reactorLF={reactorLF} />
                  <DetectorLocationPane
                    detector={detector}
                    setDetector={setDetector}
                  />
                </Visible>
              </Tab>
              <Tab eventKey="reactors" title="Reactors">
                <RASwitcher active={activeTab === "reactors"} />
                <AddCustomCoreModal
                  {...addCustomModalXY}
                  show={addCustomModal}
                  customCores={customCores}
                  setCustomCores={setCustomCores}
                  close={() => {
                    setAddCustomModalXY({});
                    setAddCustomModal(false);
                  }}
                  celestialBody={celestialBody}
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
                <Visible>
                  <FissionFractionPane />
                  <FissionIsotopeSpectraPlotsHK />
                  <FissionIsotopeSpectraPlotsHM />
                  <FissionIsotopeSpectraPlotsES />
                </Visible>
              </Tab>
              <Tab eventKey="geonu" title="GeoNu">
                <Visible>
                  <GeoneutrinoResults />
                  <GeoNusPane />
                  <CrustFlux
                    includeCrust={includeCrust}
                    setIncludeCrust={setIncludeCrust}
                  />
                  <MantleFlux
                    geoFluxRatios={geoFluxRatios}
                    setGeoFluxRatios={setGeoFluxRatios}
                    geo={geo}
                    celestialBody={celestialBody}
                  />
                  <LayeredMantleFlux />
                  <GeoCEvNS GeoCEvNSFlux={geoCEvNS} />
                  <GeoDensityPlot />
                  <GeoMassPlot />
                  <GeoIntegralPlot />
                  <GeophysicalResponsePlot />
                  <GeoDataPREM />
                  <GeoFluxUncertainties />
                  <GeoRateFluxYields />
                  <GeoNuSpectrumSource />
                  <IsotopeData />
                </Visible>
              </Tab>
              <Tab eventKey="ccsnnu" title="SnNu">
                  <SupernovaNus />
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
                  <CoreDirectionSignalPlots
                    cores={cores}
                    detector={detector}
                    reactorLF={reactorLF}
                  />
                  <CoreDirectionPlot cores={cores} detector={detector} reactorLF={reactorLF} />
                  <AnalemmaPlot boron8={boron8} detector={detector} cores={cores} reactorLF={reactorLF} />
                </Visible>
              </Tab>
              <Tab eventKey="ibd/es" title="pIBD/eES">
                <Visible>
                  <DetectorPhysicsPane />
                  <CrossSectionPlots />
                  <SV03PercentDifference />
                  <ParticleMasses />
                  <PhysicsConstants />
                  <EesCouplingFactors />
                  <PesCouplingFactors />
                  <DifferentialCrossSectionPlots />
                  <CDFdifferentialCrossSectionPlots />
                  <AngularDifferentialCrossSectionPlots />
                  <CDFAngularDifferentialCrossSectionPlots />
                </Visible>
              </Tab>
              <Tab eventKey="nuosc" title="NuOsc">
                <Visible>
                  <NeutrinoOscillationPane />
                  <PhysicsOscillationPane />
                  <AverageSurvivalPane />
                </Visible>
              </Tab>
              <Tab eventKey="muon" title="Muon">
                  <Muons />
                  <DetectorOverburdens />
              </Tab>
              <Tab eventKey="moon" title="Lunar">
                <div><p>The lunar crust flux model is described in S.T. Dye and A.M. Barna (2024), <i>Lunar antineutrinos and heat: Fluxes from primordial radioactivity</i> <a href="https://doi.org/10.48550/arXiv.2406.00882">arXiv:2406.008822.</a> Known bug: Plot download on some browsers fails on the first try but succeeds on the second.</p></div>
                  <LunarHeatFLux />
                  <LunarThickness />
                  <Lunar238UFlux />
                  <Lunar232ThFlux />
                  <Lunar40KFlux />
              </Tab>
              <Tab eventKey="output" title="Output">
                <Visible>
                  <OutputDownload
                    geo={geo}
                    cores={cores}
                    detector={detector}
                    boron8={boron8}
                  />
                </Visible>
                <CalculatorPanel cores={cores} geo={geo} active={activeTab === "output"} />
              </Tab>
              <Tab eventKey="about" title="About">
                <Visible>
                  <AboutPane />
                </Visible>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
      </MathJaxContext>
    </PhysicsContext.Provider>
  );
}

export default App;
