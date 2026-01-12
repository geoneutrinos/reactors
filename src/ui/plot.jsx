import React, { useContext } from "react";
import Plot from "react-plotly.js";

import { sum } from "lodash";

import {PhysicsContext} from '../state'

import bins, {binCount, shiftByIBD} from "../physics/bins"
import {XSNames} from "../physics/neutrino-cross-section"


export function NuSpectrumPlot({ cores, geo, detector, reactorLF, xaxisExtra={}, yaxisExtra={}, layoutExtra={}, func=(v) => v, celestialBody}) {
  const { crossSection, oscillation, reactorAntineutrinoModel} = useContext(PhysicsContext)
  const isIBD = +[XSNames.IBDSV2003, XSNames.IBDVB1999].includes(
    crossSection.crossSection
  );

  const coreList = Object.values(cores);
  const closestActiveIAEACore = coreList
    .filter((core) => core.detectorAnySignal && !core.custom)
    .sort((a, b) => a.detectorDistance - b.detectorDistance)[0];

  const totalCoreSignal = coreList.reduce((previous, current) => {
    return previous.map(
      (value, index) => value + current.detectorSignal[index]
    );
  }, new Float64Array(binCount).fill(0));

  const closestActiveIAEACoreSignal =
    closestActiveIAEACore?.detectorSignal || new Float32Array(binCount).fill(0);

  const customCores = coreList.filter((core) => core.custom === true);
  const customCoreSignal = customCores.reduce((previous, current) => {
    return previous.map(
      (value, index) => value + current.detectorSignal[index]
    );
  }, new Float64Array(binCount).fill(0));
  
  const selectedCores = coreList.filter((core) => core.outputSignal === true);
  const selectedCoreSignal = selectedCores.reduce((previous, current) => {
    return previous.map(
      (value, index) => value + current.detectorSignal[index]
    );
  }, new Float64Array(binCount).fill(0));

  const data = [
  {
      x: bins,
      y: func(totalCoreSignal),
      name: "Reactor cores",
      type: "scatter",
      mode: "lines",
      fill: "tozerox",
      marker: { color: "green" },
      line: { width: 0.7 },
      visible: sum(totalCoreSignal) > 0,
    },
    {
      x: bins,
      y: func(closestActiveIAEACoreSignal),
      name: `Closest IAEA core<br />(${closestActiveIAEACore?.name || ""})`,
      type: "scatter",
      mode: "lines",
      marker: { color: "grey" },
      visible: sum(closestActiveIAEACoreSignal) > 0,
    },  
    {
      x: bins,
      y: func(selectedCoreSignal),
      name: `Selected Signal<br />(${selectedCores.length} cores)`,
      type: "scatter",
      mode: "lines",
      marker: { color: "black" },
      visible: sum(selectedCoreSignal) > 0,
    },  
    {
      x: bins,
      y: func(customCoreSignal),
      name: "Custom cores",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "black" },
      visible: sum(customCoreSignal) > 0,
    },
    {
      x: bins,
      y: func(geo.total.U238.spectrum),
      name: "Geo <sup>238</sup>U",
      type: "scatter",
      mode: "lines",
      fill: "tozerox",
      marker: { color: "blue" },
      line: { width: 0.7 },
      visible: geo.total.U238.NIU > 0,
    },
    {
      x: bins,
      y: func(geo.total.U235.spectrum),
      name: "Geo <sup>235</sup>U",
      type: "scatter",
      mode: "lines",
      fill: "tozerox",
      marker: { color: "purple" },
      line: { width: 0.7 },
      visible: geo.total.U235.NIU > 0,
    },
    {
      x: bins,
      y: func(geo.total.Th232.spectrum),
      name: "Geo <sup>232</sup>Th",
      type: "scatter",
      mode: "lines",
      fill: "tozerox",
      marker: { color: "red" },
      line: { width: 0.7 },
      visible: geo.total.Th232.NIU > 0,
    },
    {
      x: bins,
      y: func(geo.total.K40Beta.spectrum),
      name: "Geo <sup>40</sup>K<sub>β</sub>",
      type: "scatter",
      mode: "lines",
      fill: "tozerox",
      marker: { color: "yellow" },
      line: { width: 0.7 },
      visible: geo.total.K40Beta.NIU > 0,
    },
  ];

  let ymax = Math.max(...data.map((series) => Math.max(...series.y)));
  if (celestialBody === "moon"){
    ymax = Math.max(ymax, 20)
  }

  const layout = {
    title: `Antineutrino Spectrum: ${
      ["custom", "follow"].includes(detector.current)
        ? "Custom Location"
        : detector.current
    } (${detector.lat.toFixed(1)}N, ${detector.lon.toFixed(
      1
    )}E, ${detector.elevation.toFixed(0)}m)<br /><sub>NuFit v6.0 ${oscillation.massOrdering}; ${reactorAntineutrinoModel.modelName}; Avg LF ${reactorLF.start.toISOString().slice(0, 7)} thru ${reactorLF.end.toISOString().slice(0, 7)}</sub>`,
    showlegend: true,
    legend: {
      x: 1,
      xanchor: "right",
      y: 1,
    },
    autosize: true,
    xaxis: {
      range: [0, 10],
      title: { text: `Antineutrino Energy E (MeV)` },
      ...xaxisExtra
    },
    yaxis: {
      range: [0, ymax * 1.05],
      title: { text: `Rate dR/dE (NIU/MeV)<br /><sub>${crossSection.crossSection} ${isIBD? "": "(" + crossSection.elasticScatteringTMin.toFixed(1) + " < T < " + crossSection.elasticScatteringTMax.toFixed(1) + " MeV)"}</sub>` },
      ...yaxisExtra
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
    ...layoutExtra
  };
  const config = { toImageButtonOptions: { width: 900, height: 500, scale: 2, filename: 'Antineutrino-Spectrum' } }

  if (!isIBD){
    config.toImageButtonOptions.filename = `Antineutrino-Spectrum_Tmin${crossSection.elasticScatteringTMin.toFixed(1)}_to_Tmax${crossSection.elasticScatteringTMax.toFixed(1)}`
  }
  return (
    <Plot
      data={data}
      layout={layout}
      useResizeHandler={true}
      style={{ width: "100%" }}
      config={config}
    />
  );
}

export function KESpectrumPlot({ cores, spectrum, detector, reactorLF}) {
  const { crossSection } = useContext(PhysicsContext)
  const isIBD = +[XSNames.IBDSV2003, XSNames.IBDVB1999].includes(
    crossSection.crossSection
  );
  const func = isIBD? shiftByIBD: (v) => v;
  return  <NuSpectrumPlot
  detector={detector}
  cores={cores}
  spectrum={spectrum}
  reactorLF={reactorLF}
  func={func}
  layoutExtra={{
    title: `Kinetic Energy Spectrum: ${
      ["custom", "follow"].includes(detector.current)
        ? "Custom Location"
        : detector.current
    } (${detector.lat.toFixed(1)}N, ${detector.lon.toFixed(
      1
    )}E, ${detector.elevation.toFixed(0)}m)<br /><sub>(${reactorLF.start.toISOString().slice(0, 7)} through ${reactorLF.end.toISOString().slice(0, 7)} avg Load Factor)</sub>`, 
  }}
  xaxisExtra={{
      title: { text: `Kinetic Energy T (MeV)` },
  }}
  yaxisExtra={{
      title: { text: `Rate dR/dT (NIU/MeV)<br /><sub>${crossSection.crossSection}</sub>` },
  }}
/>
}

export function CoreDirectionPlot({ cores, detector, reactorLF }) {
  const coreArr = Object.values(cores).filter(core => core.shutdown > new Date());

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
    )}E, ${detector.elevation.toFixed(0)}m)<br /><sub>(${reactorLF.start.toISOString().slice(0, 7)} through ${reactorLF.end.toISOString().slice(0, 7)} avg Load Factor)</sub>`,
    showlegend: true,
    autosize: true,
    polar: {
      angularaxis: {
        thetaunit: "degrees",
        dtick: 45,
        tickmode: "auto",
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
          "geoneutrinos.org <br />Angular Axis is Azimuth (deg): East is 0&deg;, North is 90&deg;, etc. <br />Radial Axis is Altitude (deg): Horizon 0&deg;, Nadir -90&deg; ",
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
            text: AllOtherCores.map((core) => `${core.name} (${core.type})<br>θ=${core.direction.elev.toFixed(3)}<br>φ=${core.direction.phi.toFixed(3)}<br>signal=${core.detectorNIU.toExponential(2)}`),
            mode: "markers",
            hoverinfo: "text",
            marker: {
              color: "#009000",
              size: 4,
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
              size: 6,
            },
          },
          {
            name: "GCR", //GCR Cores
            type: "scatterpolar",
            r: GCRcores.map((core) => core.direction.elev),
            theta: GCRcores.map((core) => core.direction.phi),
            text: GCRcores.map((core) => `${core.name} (${core.type})<br>θ=${core.direction.elev.toFixed(3)}<br>φ=${core.direction.phi.toFixed(3)}<br>signal=${core.detectorNIU.toExponential(2)}`),
            mode: "markers",
            hoverinfo: "text",
            marker: {
              color: "#D69537",
              size: 4,
            },
          },
          {
            name: "PWR/MOX", //LEU MOX COres
            type: "scatterpolar",
            r: LEUMoxCores.map((core) => core.direction.elev),
            theta: LEUMoxCores.map((core) => core.direction.phi),
            text: LEUMoxCores.map((core) => `${core.name} (${core.type} MOX)<br>θ=${core.direction.elev.toFixed(3)}<br>φ=${core.direction.phi.toFixed(3)}<br>signal=${core.detectorNIU.toExponential(2)}`),
            mode: "markers",
            hoverinfo: "text",
            marker: {
              color: "#0000ff",
              size: 4,
            },
          },
          {
            name: "PHWR", //PHWR Cores
            type: "scatterpolar",
            r: PHWRcores.map((core) => core.direction.elev),
            theta: PHWRcores.map((core) => core.direction.phi),
            text: PHWRcores.map((core) => `${core.name} (${core.type})<br>θ=${core.direction.elev.toFixed(3)}<br>φ=${core.direction.phi.toFixed(3)}<br>signal=${core.detectorNIU.toExponential(2)}`),
            mode: "markers",
            hoverinfo: "text",
            marker: {
              color: "#ff0000",
              size: 4,
            },
          },
        ]}
        useResizeHandler={true}
        style={{ width: "100%", height: "500px", minHeight: "400px" }}
        config={{ toImageButtonOptions: { width: 900, height: 900, scale: 2, filename: 'Core-Directions-Alt-Azim' } }}
        layout={layout}
      />
    </div>
  );
}
