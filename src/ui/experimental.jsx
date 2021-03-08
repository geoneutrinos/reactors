import React, { useState } from "react";
import Plot from "react-plotly.js";

const evBins = new Float64Array(1000).map((v, i) => i * 0.01 + 0.005);

export function InterferencePlot({ cores }) {
    const [core, setCore] = useState()
  const coreList = Object.values(cores);
  const closestActiveIAEACore = coreList
    .filter((core) => core.detectorAnySignal && !core.custom)
    .sort((a, b) => a.detectorDistance - b.detectorDistance)[0];

    const currentCoreValue = core? coreList.filter((c) => c.name === core.name)[0]: closestActiveIAEACore

    const snapshot = () => {
      if (closestActiveIAEACore === undefined){
        return
      }
        setCore(closestActiveIAEACore)
    }
    const ratio = currentCoreValue === undefined? []: currentCoreValue.detectorSignal.map((v, i) => core? core.detectorSignal[i] / v : 1)

  const data = [
    {
      x: evBins,
      y: ratio,
      name: "Custom Cores",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "black" },
    },
  ];
  const layout = {
      title: "Signal Ratio (snapshot / current)"
  }
  return (
      <div>
      <button onClick={() => snapshot()}>Snapshot Closest Core ({closestActiveIAEACore === undefined? "none" : closestActiveIAEACore.name})</button>
      
    <Plot
      data={data}
      layout={layout}
      useResizeHandler={true}
      style={{ width: "100%" }}
      config={{ toImageButtonOptions: { width: 900, height: 500, scale: 2 } }}
    />
    </div>
  );
}
