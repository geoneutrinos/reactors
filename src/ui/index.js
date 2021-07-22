import React, { useEffect, useState, useRef } from "react";

export { NuMap } from './map';
export { NuSpectrumPlot, CoreDirectionPlot } from './plot';
export { StatsPanel } from './detector-stats';
export { DetectorPhysicsPane } from './detector-physics';
export { DetectorLocationPane } from './detector-location';
export { CoreList } from './reactors-corelist';
export { MantleFlux, CrustFlux, GeoNuSpectrumSource  } from './geonu';
export { CalculatorPanel } from './output-calculator';
export { AddCustomCoreModal, ManageCustomCoreModal } from './reactors-core-custom';
export { CoreIAEARange } from './reactors-core-iaea-select'
export { OutputDownload } from './output-download'
export { PhysicsOscillationPane } from './physics-osc-params'
export { PhysicsConstants } from './physics-constants';
export { ParticleMasses } from './physics-masses';
export { CrossSectionPlots, DifferentialCrossSectionPlots, AngularDifferentialCrossSectionPlots, CDFdifferentialCrossSectionPlots, CDFAngularDifferentialCrossSectionPlots } from './physics-plots';
export { FissionIsotopeSpectraPlots, CoreDirectionSignalPlots } from './reactors-plots';
export { Boron8SpectraPlot, AnalemmaPlot } from './solar-plots';
export { FissionFractionPane } from './reactors-fission';


export const Visible = ({ children }) => {
  const [visible, setVisible] = useState(false);

  const ref = useRef(this)

  useEffect(() => {
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 0
    }

    let observer = new IntersectionObserver((entries, observer) => { setVisible(entries[0].isIntersecting) }, options);
    observer.observe(ref.current)
  }, [])
  return <div ref={ref}>{visible && children}</div>
}

export const Num = ({ v, p, func }) => {
  const [full, setFull] = useState(false)
  if (func === undefined) {
    func = (v) => v;
  }
  return <span onDoubleClick={() => setFull(!full)} title={v.toString()}>{full ? func(v).toString() : func(v).toFixed(p)}</span>;
}
