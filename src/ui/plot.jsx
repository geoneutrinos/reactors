import React from "react";
import Plot from "react-plotly.js";

import { sum } from "lodash";

const evBins = new Float64Array(1000).map((v, i) => i * 0.01 + 0.005);

export function NuSpectrumPlot({ cores, spectrum, detector }) {
  const coreList = Object.values(cores);
  const closestActiveIAEACore = coreList
    .filter((core) => core.detectorAnySignal && !core.custom)
    .sort((a, b) => a.detectorDistance - b.detectorDistance)[0];

  const totalCoreSignal = coreList.reduce((previous, current) => {
    return previous.map(
      (value, index) => value + current.detectorSignal[index]
    );
  }, new Float64Array(1000).fill(0));

  const closestActiveIAEACoreSignal =
    closestActiveIAEACore?.detectorSignal || new Float32Array(1000).fill(0);

  const customCores = coreList.filter((core) => core.custom === true)
  const customCoreSignal = customCores.reduce((previous, current) => {
    return previous.map(
      (value, index) => value + current.detectorSignal[index]
    );
  }, new Float64Array(1000).fill(0));

  const data = [
    {
      x: evBins,
      y: customCoreSignal,
      name: "Custom Cores",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "black" },
      visible: sum(customCoreSignal) > 0,
    },
    {
      x: evBins,
      y: spectrum.geoK,
      name: "GeoK",
      type: "scatter",
      mode: "lines",
      fill: "tozerox",
      marker: { color: "yellow" },
      visible: sum(spectrum.geoK) > 0,
    },
    {
      x: evBins,
      y: spectrum.geoU,
      name: "GeoU",
      type: "scatter",
      mode: "lines",
      fill: "tozerox",
      marker: { color: "blue" },
      visible: sum(spectrum.geoU) > 0,
    },
    {
      x: evBins,
      y: spectrum.geoTh,
      name: "GeoTh",
      type: "scatter",
      mode: "lines",
      fill: "tozerox",
      marker: { color: "red" },
      visible: sum(spectrum.geoTh) > 0,
    },
    {
      x: evBins,
      y: totalCoreSignal,
      name: "Reactor Cores",
      type: "scatter",
      mode: "lines",
      fill: "tozerox",
      marker: { color: "green" },
      visible: sum(totalCoreSignal) > 0,
    },
    {
      x: evBins,
      y: closestActiveIAEACoreSignal,
      name: `Closest IAEA Core\n (${closestActiveIAEACore?.name || ""})`,
      type: "scatter",
      mode: "lines",
      marker: { color: "grey" },
      visible: sum(closestActiveIAEACoreSignal) > 0,
    },
  ];

  const layout = {
    title: `Antineutrino Spectrum: ${
      ["custom", "follow"].includes(detector.current)
        ? "Custom Location"
        : detector.current
    } (${detector.lat.toFixed(1)}N, ${detector.lon.toFixed(1)}E)`,
    showlegend: true,
    legend: {
      x: 1,
      xanchor: "right",
      y: 1,
    },
    autosize: true,
    xaxis: {
      title: { text: "Antineutrino Energy E (MeV)" },
    },
    yaxis: {
      rangemode: "nonnegative",
      autorange: true,
      title: { text: "Rate dR/dE (NIU/MeV)" },
    },
  };
  return (
    <Plot
      data={data}
      layout={layout}
      useResizeHandler={true}
      style={{ width: "100%" }}
      config={{ toImageButtonOptions: { width: 900, height: 500, scale: 2 } }}
    />
  );
}

export function CoreDirectionPlot({ cores }) {
  const coreArr = Object.values(cores)

  const PHWRcores = coreArr.filter((core) => core.spectrumType === "PHWR")
  const GCRcores = coreArr.filter((core) => core.spectrumType === "GCR")
  const LEUMoxCores = coreArr.filter((core) => core.spectrumType === "LEU_MOX")
  const CustomCores = coreArr.filter((core) => core.spectrumType === "custom")
  const AllOtherCores = coreArr.filter((core) => core.spectrumType !== "LEU_MOX" && core.spectrumType !== "GCR" && core.spectrumType !== "PHWR" && core.type !== "custom")
  return (
    <Plot
      data={[
        {
          name: "All Other Cores",
          showlegend: false,
          type: "scatterpolar",
          r: AllOtherCores.map((core) => core.direction.elev),
          theta: AllOtherCores.map((core) => core.direction.phi),
          text: AllOtherCores.map((core) => core.name),
          mode: "markers",
          hovertemplate: "%{text}",
          marker: {
            color: "#009000"
          }
        },
        {
          name: "Custom Cores",
          showlegend: false,
          type: "scatterpolar",
          r: CustomCores.map((core) => core.direction.elev),
          theta: CustomCores.map((core) => core.direction.phi),
          text: CustomCores.map((core) => core.name),
          mode: "markers",
          hovertemplate: "%{text}",
          marker: {
            color: "#000"
          }
        },
        {
          name: "GCR Cores",
          type: "scatterpolar",
          showlegend: false,
          r: GCRcores.map((core) => core.direction.elev),
          theta: GCRcores.map((core) => core.direction.phi),
          text: GCRcores.map((core) => core.name),
          mode: "markers",
          hovertemplate: "%{text}",
          marker: {
            color: "#D69537"
          }
        },
        {
          name: "LEU MOX Cores",
          type: "scatterpolar",
          showlegend: false,
          r: LEUMoxCores.map((core) => core.direction.elev),
          theta: LEUMoxCores.map((core) => core.direction.phi),
          text: LEUMoxCores.map((core) => core.name),
          mode: "markers",
          hovertemplate: "%{text}",
          marker: {
            color: "#0000ff"
          }
        },
        {
          name: "PHWR Cores",
          type: "scatterpolar",
          showlegend: false,
          r: PHWRcores.map((core) => core.direction.elev),
          theta: PHWRcores.map((core) => core.direction.phi),
          text: PHWRcores.map((core) => core.name),
          mode: "markers",
          hovertemplate: "%{text}",
          marker: {
            color: "#ff0000"
          }
        },
      ]}
      useResizeHandler={true}
      style={{ width: "100%", height: "50vh", minHeight: "400px"}}
      config={{ toImageButtonOptions: { width: 900, height: 900, scale: 2 } }}
    />
  );
}
