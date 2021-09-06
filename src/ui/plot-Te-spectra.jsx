import React, { useContext } from "react";
import Plot from "react-plotly.js";

import { Card } from "react-bootstrap";

import { sum } from "lodash";

import {PhysicsContext} from '../state'
import { XSNames } from "../physics/neutrino-cross-section";
import { IBD_THRESHOLD } from "../physics/derived";

export function KESpectrumPlot({ cores, spectrum, detector, reactorLF}) {
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
  
  const selectedCores = coreList.filter((core) => core.outputSignal === true);
  const selectedCoreSignal = selectedCores.reduce((previous, current) => {
    return previous.map(
      (value, index) => value + current.detectorSignal[index]
    );
  }, new Float64Array(1000).fill(0));
  
  const isIBD = +[XSNames.IBDSV2003, XSNames.IBDVB1999].includes(
    crossSection.crossSection
  );
  
  var teBins = new Float64Array(1000).map((v, i) => i * 0.01 + 0.005 - IBD_THRESHOLD);
  if(!isIBD) {
  var teBins = new Float64Array(1000).map((v, i) => i * 0.01 + 0.005);
  }
    
  const data = [
    {
      x: teBins,
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
      x: teBins,
      y: closestActiveIAEACoreSignal,
      name: `Closest IAEA core<br />(${closestActiveIAEACore?.name || ""})`,
      type: "scatter",
      mode: "lines",
      marker: { color: "grey" },
      visible: sum(closestActiveIAEACoreSignal) > 0,
    },  
    {
      x: teBins,
      y: selectedCoreSignal,
      name: `Selected Signal<br />(${selectedCores.length} cores)`,
      type: "scatter",
      mode: "lines",
      marker: { color: "black" },
      visible: sum(selectedCoreSignal) > 0,
    },  
    {
      x: teBins,
      y: customCoreSignal,
      name: "Custom cores",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "black" },
      visible: sum(customCoreSignal) > 0,
    },
    {
      x: teBins,
      y: spectrum.geoU238,
      name: "Geo <sup>238</sup>U",
      type: "scatter",
      mode: "lines",
      fill: "tozerox",
      marker: { color: "blue" },
      line: { width: 0.7 },
      visible: sum(spectrum.geoU238) > 0,
    },
    {
      x: teBins,
      y: spectrum.geoU235,
      name: "Geo <sup>235</sup>U",
      type: "scatter",
      mode: "lines",
      fill: "tozerox",
      marker: { color: "purple" },
      line: { width: 0.7 },
      visible: sum(spectrum.geoU235) > 0,
    },
    {
      x: teBins,
      y: spectrum.geoTh232,
      name: "Geo <sup>232</sup>Th",
      type: "scatter",
      mode: "lines",
      fill: "tozerox",
      marker: { color: "red" },
      line: { width: 0.7 },
      visible: sum(spectrum.geoTh232) > 0,
    },
    {
      x: teBins,
      y: spectrum.geoK40_beta,
      name: "Geo <sup>40</sup>K (β<sup>-</sup>)",
      type: "scatter",
      mode: "lines",
      fill: "tozerox",
      marker: { color: "yellow" },
      line: { width: 0.7 },
      visible: sum(spectrum.geoK40_beta) > 0,
    },
  ];

  const ymax = Math.max(...data.map((series) => Math.max(...series.y)));

  const layout = {
    title: `Kinetic Energy Spectrum: ${
      ["custom", "follow"].includes(detector.current)
        ? "Custom Location"
        : detector.current
    } (${detector.lat.toFixed(1)}N, ${detector.lon.toFixed(
      1
    )}E, ${detector.elevation.toFixed(0)}m)<br /><sub>(${reactorLF.start.toISOString().slice(0, 7)} through ${reactorLF.end.toISOString().slice(0, 7)} avg Load Factor)</sub>`,
    showlegend: true,
    legend: {
      x: 1,
      xanchor: "right",
      y: 1,
    },
    autosize: true,
    xaxis: {
      range: [0, 10],
      title: { text: `Kinetic Energy T (MeV)` },
    },
    yaxis: {
      range: [0, ymax * 1.05],
      title: { text: `Rate dR/dT (NIU/MeV)<br /><sub>${crossSection.crossSection}</sub>` },
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
    <Card>
      <Card.Header>Scattered Lepton Kinetic Energy</Card.Header>
      <Plot
        data={data}
        layout={layout}
        useResizeHandler={true}
        style={{ width: "100%" }}
        config={{ toImageButtonOptions: { filename: 'Kinetic-Energy-Spectrum' } }}
        />
    </Card>
  );
};
