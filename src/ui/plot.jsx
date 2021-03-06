import React, { useContext } from "react";
import Plot from "react-plotly.js";

import { sum } from "lodash";

import {PhysicsContext} from '../state'

const evBins = new Float64Array(1000).map((v, i) => i * 0.01 + 0.005);

export function NuSpectrumPlot({ cores, spectrum, detector}) {
  const { crossSection } = useContext(PhysicsContext)
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

  const customCores = coreList.filter((core) => core.custom === true);
  const customCoreSignal = customCores.reduce((previous, current) => {
    return previous.map(
      (value, index) => value + current.detectorSignal[index]
    );
  }, new Float64Array(1000).fill(0));

  const data = [
  {
      x: evBins,
      y: totalCoreSignal,
      name: "Reactor cores",
      type: "scatter",
      mode: "lines",
      fill: "tozerox",
      marker: { color: "green" },
      line: { width: 0.7 },
      visible: sum(totalCoreSignal) > 0,
    },
    {
      x: evBins,
      y: closestActiveIAEACoreSignal,
      name: `Closest IAEA core<br />(${closestActiveIAEACore?.name || ""})`,
      type: "scatter",
      mode: "lines",
      marker: { color: "grey" },
      visible: sum(closestActiveIAEACoreSignal) > 0,
    },  
    {
      x: evBins,
      y: customCoreSignal,
      name: "Custom cores",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "black" },
      visible: sum(customCoreSignal) > 0,
    },
    {
      x: evBins,
      y: spectrum.geoU,
      name: "Geo <sup>238</sup>U",
      type: "scatter",
      mode: "lines",
      fill: "tozerox",
      marker: { color: "blue" },
      line: { width: 0.7 },
      visible: sum(spectrum.geoU) > 0,
    },
    {
      x: evBins,
      y: spectrum.geoTh,
      name: "Geo <sup>232</sup>Th",
      type: "scatter",
      mode: "lines",
      fill: "tozerox",
      marker: { color: "red" },
      line: { width: 0.7 },
      visible: sum(spectrum.geoTh) > 0,
    },
    {
      x: evBins,
      y: spectrum.geoK,
      name: "Geo <sup>40</sup>K",
      type: "scatter",
      mode: "lines",
      fill: "tozerox",
      marker: { color: "yellow" },
      line: { width: 0.7 },
      visible: sum(spectrum.geoK) > 0,
    },
  ];

  const ymax = Math.max(...data.map((series) => Math.max(...series.y)));

  const layout = {
    title: `Antineutrino Spectrum: ${
      ["custom", "follow"].includes(detector.current)
        ? "Custom Location"
        : detector.current
    } (${detector.lat.toFixed(1)}N, ${detector.lon.toFixed(
      1
    )}E, ${detector.elevation.toFixed(0)}m)`,
    showlegend: true,
    legend: {
      x: 1,
      xanchor: "right",
      y: 1,
    },
    autosize: true,
    xaxis: {
      title: { text: `Antineutrino Energy E (MeV)` },
    },
    yaxis: {
      range: [0, ymax * 1.05],
      title: { text: `Rate dR/dE (NIU/MeV)<br /><sub>${crossSection.crossSection}</sub>` },
    },
    annotations: [
      {
        showarrow: false,
        text: "geoneutrinos.org",
        x: 1.1,
        xref: "paper",
        y: -0.15,
        yref: "paper",
      },
    ],
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

export function CoreDirectionPlot({ cores, detector }) {
  const coreArr = Object.values(cores);

  const PHWRcores = coreArr.filter((core) => core.spectrumType === "PHWR");
  const GCRcores = coreArr.filter((core) => core.spectrumType === "GCR");
  const LEUMoxCores = coreArr.filter((core) => core.spectrumType === "LEU_MOX");
  const CustomCores = coreArr.filter((core) => core.spectrumType === "custom");
  const AllOtherCores = coreArr.filter(
    (core) =>
      core.spectrumType !== "LEU_MOX" &&
      core.spectrumType !== "GCR" &&
      core.spectrumType !== "PHWR" &&
      core.type !== "custom"
  );
  const layout = {
    title: `Core Directions at ${
      ["custom", "follow"].includes(detector.current)
        ? "Custom Location"
        : detector.current
    } (${detector.lat.toFixed(1)}N, ${detector.lon.toFixed(
      1
    )}E, ${detector.elevation.toFixed(0)}m)`,
    showlegend: true,
    autosize: true,
    polar: {
      angularaxis: {
        thetaunit: "degrees",
        dtick: 45,
        tickmode: "array",
        tickvals: [0, 45, 90, 135, 180, 225, 270, 315],
        ticktext: ["90&deg;", "45&deg;", "0&deg;", "315&deg;", "270&deg;", "225&deg;", "180&deg;", "135&deg;"],
      },
    },
    legend: {
      x: 1,
      xanchor: "left",
      y: 1,
      yanchor: "top",
    },
    margin: {
      b: 110,
    },
    annotations: [
      {
        showarrow: false,
        align: "right",
        text:
          "geoneutrinos.org <br />Angular Axis is Azimuth (deg): North is 0&deg;, East is 90&deg;, etc. <br />Radial Axis is Altitude (deg): Horizon 0&deg;, Nadir -90&deg; ",
        x: 1.1,
        xref: "paper",
        y: -0.075,
        yref: "paper",
        yanchor: "top",
        xanchor: "right",
      },
    ],
  };
  return (
    <div>
      <Plot
        data={[
          {
            name: "PWR,BWR", //All other
            type: "scatterpolar",
            r: AllOtherCores.map((core) => core.direction.elev),
            theta: AllOtherCores.map((core) => core.direction.phi),
            text: AllOtherCores.map((core) => `${core.name} (${core.type})`),
            mode: "markers",
            hoverinfo: "text",
            marker: {
              color: "#009000",
            },
          },
          {
            name: "Custom Cores",
            type: "scatterpolar",
            r: CustomCores.map((core) => core.direction.elev),
            theta: CustomCores.map((core) => core.direction.phi),
            text: CustomCores.map((core) => core.name),
            mode: "markers",
            hoverinfo: "text",
            marker: {
              color: "#000",
            },
          },
          {
            name: "GCR", //GCR Cores
            type: "scatterpolar",
            r: GCRcores.map((core) => core.direction.elev),
            theta: GCRcores.map((core) => core.direction.phi),
            text: GCRcores.map((core) => `${core.name} (${core.type})`),
            mode: "markers",
            hoverinfo: "text",
            marker: {
              color: "#D69537",
            },
          },
          {
            name: "PWR/MOX", //LEU MOX COres
            type: "scatterpolar",
            r: LEUMoxCores.map((core) => core.direction.elev),
            theta: LEUMoxCores.map((core) => core.direction.phi),
            text: LEUMoxCores.map((core) => `${core.name} (${core.type} MOX)`),
            mode: "markers",
            hoverinfo: "text",
            marker: {
              color: "#0000ff",
            },
          },
          {
            name: "PHWR", //PHWR Cores
            type: "scatterpolar",
            r: PHWRcores.map((core) => core.direction.elev),
            theta: PHWRcores.map((core) => core.direction.phi),
            text: PHWRcores.map((core) => `${core.name} (${core.type})`),
            mode: "markers",
            hoverinfo: "text",
            marker: {
              color: "#ff0000",
            },
          },
        ]}
        useResizeHandler={true}
        style={{ width: "100%", height: "500px", minHeight: "400px" }}
        config={{ toImageButtonOptions: { width: 900, height: 900, scale: 2 } }}
        layout={layout}
      />
    </div>
  );
}
