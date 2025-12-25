import React, { useEffect, useState, useRef } from "react";

export { NuMap } from "./map";
export { NuSpectrumPlot, CoreDirectionPlot, KESpectrumPlot } from "./plot";
export { StatsPanel } from "./detector-stats";
export { DetectorPhysicsPane } from "./detector-physics";
export { NeutrinoOscillationPane } from "./neutrino-oscillation";
export { DetectorLocationPane } from "./detector-location";
export { CoreList } from "./reactors-corelist";
export { LayeredMantleFlux, MantleFlux, CrustFlux, GeoNuSpectrumSource, GeoNusPane } from "./geonu";
export { CalculatorPanel } from "./output-calculator";
export { AboutPane } from "./about";
export {
  AddCustomCoreModal,
  ManageCustomCoreModal,
} from "./reactors-core-custom";
export { CoreIAEARange } from "./reactors-core-iaea-select";
export { OutputDownload } from "./output-download";
export { PhysicsOscillationPane, AverageSurvivalPane } from "./physics-osc-params";
export { PhysicsConstants } from "./physics-constants";
export { ParticleMasses } from "./physics-masses";
export { EesCouplingFactors, PesCouplingFactors } from "./physics-coupling-factors";
export { GeoneutrinoResults } from "./geonu-results";
export { GeoFluxUncertainties } from "./geo-uncertainties";
export { GeoDataPREM } from "./geo-prem-data";
export { IsotopeData } from "./isotope-data";
export { GeoRateFluxYields } from "./geo-ratefluxyields";
export { SupernovaNus } from "./supernova-nus";
export { Muons } from "./muon-backgrounds";
export { DetectorOverburdens } from "./detector-overburden";
export {
  CrossSectionPlots,
  SV03PercentDifference,
  CrossSectionPlotsNormal,
  DifferentialCrossSectionPlots,
  DifferentialCrossSectionPlotsNeutrinos,
  AngularDifferentialCrossSectionPlots,
  AngularDifferentialCrossSectionPlotsNeutrinos,
  CDFdifferentialCrossSectionPlots,
  CDFAngularDifferentialCrossSectionPlots,
  CDFdifferentialCrossSectionPlotsNeutrinos,
  CDFAngularDifferentialCrossSectionPlotsNeutrinos,
} from "./physics-plots";
export {
  FissionIsotopeSpectraPlotsHK,
  FissionIsotopeSpectraPlotsHM,
  FissionIsotopeSpectraPlotsES,
  CoreDirectionSignalPlots,
} from "./reactors-plots";
export { Boron8SpectraPlot, AnalemmaPlot, Boron8KEPlot } from "./solar-plots";
export { FissionFractionPane } from "./reactors-fission";
export { RASwitcher } from "./reactors-ra-switcher";
export { 
  GeoDensityPlot,
  GeoMassPlot,
  GeoIntegralPlot,
  GeophysicalResponsePlot,
} from "./geo-prem-plots";
export { CelestialBodySwitcher } from "./celestial-body-switcher";
export {
  Lunar238UFlux,
  Lunar232ThFlux,
  Lunar40KFlux,
  LunarThickness,
  LunarHeatFLux,
} from "./lunar-input-plots"

interface VisibleProps {
  children: React.ReactNode
}

export const Visible: React.FC<VisibleProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };

    let observer = new IntersectionObserver((entries, _) => {
      setVisible(entries[0].isIntersecting);
    }, options);
    observer.observe(ref.current as Element);
  }, []);
  return <div ref={ref}>{visible && children}</div>;
};

interface NumProps {
  v: number
  p: number
  u?: number
  func?: (arg: number) =>  number
  formatFunc?: "toFixed" | "toExponential" | "toPrecision"
}

export const Num: React.FC<NumProps> = ({ v, p, u, func, formatFunc = "toFixed" }) => {
  const [full, setFull] = useState(false);
  if (func === undefined) {
    func = (v) => v;
  }
  const value = func(v)
  const uncertainty = u ? func(u) : undefined
  const formattedString = uncertainty ? `${value[formatFunc](p).toString()} ± ${uncertainty[formatFunc](p).toString()}` : `${value[formatFunc](p).toString()}`
  const fullString = uncertainty ? `${value.toString()} ± ${uncertainty.toString()}` : `${value.toString()}`
  return (
    <span onDoubleClick={() => setFull(!full)} title={fullString}>
      {full ? fullString: formattedString}
    </span>
  );
};
