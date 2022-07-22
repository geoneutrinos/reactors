import React, { useEffect, useState, useRef } from "react";

export { NuMap } from "./map";
export { NuSpectrumPlot, CoreDirectionPlot, KESpectrumPlot } from "./plot";
export { StatsPanel } from "./detector-stats";
export { DetectorPhysicsPane } from "./detector-physics";
export { NeutrinoOscillationPane } from "./neutrino-oscillation";
export { DetectorLocationPane } from "./detector-location";
export { CoreList } from "./reactors-corelist";
export { MantleFlux, CrustFlux, GeoNuSpectrumSource } from "./geonu";
export { CalculatorPanel } from "./output-calculator";
export {
  AddCustomCoreModal,
  ManageCustomCoreModal,
} from "./reactors-core-custom";
export { CoreIAEARange } from "./reactors-core-iaea-select";
export { OutputDownload } from "./output-download";
export { PhysicsOscillationPane } from "./physics-osc-params";
export { PhysicsConstants } from "./physics-constants";
export { ParticleMasses } from "./physics-masses";
export { GeoFluxUncertainties } from "./geo-uncertainties";
export { IsotopeData } from "./isotope-data";
export { 
  SupernovaNusEvents,
  SupernovaNusESeTmin,
  SupernovaNusESpTmin,
  SupernovaNusPane, 
} from "./supernova-nus";
export {
  CrossSectionPlots,
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
  FissionIsotopeSpectraPlots,
  U235IsotopeSpectraPlots,
  U238IsotopeSpectraPlots,
  CoreDirectionSignalPlots,
} from "./reactors-plots";
export { Boron8SpectraPlot, AnalemmaPlot, Boron8KEPlot } from "./solar-plots";
export {
  SupernovaFluxPlots,
  SupernovaPlotsIBD,
  SupernovaOscillatedFluxPlots,
  SupernovaOscillatedInvertedFluxPlots,
  NeutrinoElectronElasticScatteringCrossSection,
} from "./supernova-plots";
export { FissionFractionPane } from "./reactors-fission";
export { RASwitcher } from "./reactors-ra-switcher";

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

    let observer = new IntersectionObserver((entries, observer) => {
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
}

export const Num: React.FC<NumProps> = ({ v, p, u, func }) => {
  const [full, setFull] = useState(false);
  if (func === undefined) {
    func = (v) => v;
  }
  const value = func(v)
  const uncertainty = u ? func(u) : undefined
  const formattedString = uncertainty ? `${value.toFixed(p).toString()} ± ${uncertainty.toFixed(p).toString()}` : `${value.toFixed(p).toString()}`
  const fullString = uncertainty ? `${value.toString()} ± ${uncertainty.toString()}` : `${value.toString()}`
  return (
    <span onDoubleClick={() => setFull(!full)} title={fullString}>
      {full ? fullString: formattedString}
    </span>
  );
};
