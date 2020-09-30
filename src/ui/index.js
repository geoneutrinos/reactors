import React, { useEffect, useState, useRef } from "react";

export { NuMap } from './map';
export { NuSpectrumPlot, CoreDirectionPlot } from './plot';
export { StatsPanel } from './detector-stats';
export { DetectorPhysicsPane } from './detector-physics';
export { DetectorLocationPane } from './detector-location';
export { CoreList } from './reactors-corelist';
export { MantleFlux, CrustFlux, GeoNuSpectrumSource } from './geonu';
export { CalculatorPanel } from './output-calculator';
export { AddCustomCoreModal, ManageCustomCoreModal } from './reactors-core-custom';
export { CoreIAEARange } from './reactors-core-iaea-select'
export { OutputDownload } from './output-download'
export { PhysicsOscillationPane } from './physics-osc-params'
export { PhysicsConstants } from './physics-constants';
export { CrossSectionPlots } from './physics-plots';
export { FissionIsotopeSpectraPlots } from './reactors-plots';


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