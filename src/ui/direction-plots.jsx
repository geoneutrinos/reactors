import React, { useContext } from "react";
import { Card } from "react-bootstrap";
import Plot from "react-plotly.js";

import { sum } from "lodash";

import {PhysicsContext} from '../state'

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
        config={{ toImageButtonOptions: { width: 900, height: 900, scale: 2, filename: 'Core-Directions-Alt-Azim' } }}
        layout={layout}
      />
    </div>
  );
}

export const CoreDirectionSignalPlots = ({ cores, detector, reactorLF }) => {
  const sortedCores = Object.values(cores)
    .filter((a) => a.detectorNIU > 0)
    .sort((a, b) => b.detectorNIU - a.detectorNIU);
  let [first, ...rest] = sortedCores;
  let coreData = []
  if (first !== undefined){
   coreData = [first, ...rest].map((core) => {
    return { y: core, x: first.cos(core) };
   });
  } else {
    first = {"name": "No Cores"}
  }

  const PHWRcores = coreData.filter((core) => core.y.spectrumType === "PHWR");
  const GCRcores = coreData.filter((core) => core.y.spectrumType === "GCR");
  const LEUMoxCores = coreData.filter(
    (core) => core.y.spectrumType === "LEU_MOX"
  );
  const CustomCores = coreData.filter(
    (core) => core.y.spectrumType === "custom"
  );
  const AllOtherCores = coreData.filter(
    (core) =>
      core.y.spectrumType !== "LEU_MOX" &&
      core.y.spectrumType !== "GCR" &&
      core.y.spectrumType !== "PHWR" &&
      core.y.type !== "custom"
  );
  const data = [
    {
      y: AllOtherCores.map((d) => d.y.detectorNIU),
      x: AllOtherCores.map((d) => d.x),
      text: AllOtherCores.map((core) => `${core.y.name} (${core.y.type})<br>cosθ= ${core.x.toFixed(3)}<br>signal= ${core.y.detectorNIU.toExponential(2)}`),
      name: `PWR,BWR`,
      type: "scatter",
      mode: "markers",
      hoverinfo: "text",
      marker: {
        color: "#009000",
      },
    },
    {
      name: "Custom",
      type: "scatter",
      y: CustomCores.map((d) => d.y.detectorNIU),
      x: CustomCores.map((d) => d.x),
      text: CustomCores.map((core) => `${core.y.name} (${core.y.type})<br>cosθ= ${core.x.toFixed(3)}<br>signal= ${core.y.detectorNIU.toExponential(2)}`),
      mode: "markers",
      hoverinfo: "text",
      marker: {
        color: "#000",
      },
    },
    {
      name: "GCR", //GCR Cores
      type: "scatter",
      y: GCRcores.map((d) => d.y.detectorNIU),
      x: GCRcores.map((d) => d.x),
      text: GCRcores.map((core) => `${core.y.name} (${core.y.type})<br>cosθ= ${core.x.toFixed(3)}<br>signal= ${core.y.detectorNIU.toExponential(2)}`),
      mode: "markers",
      hoverinfo: "text",
      marker: {
        color: "#D69537",
      },
    },
    {
      name: "PWR/MOX", //LEU MOX COres
      type: "scatter",
      y: LEUMoxCores.map((d) => d.y.detectorNIU),
      x: LEUMoxCores.map((d) => d.x),
      text: LEUMoxCores.map((core) => `${core.y.name} (${core.y.type})<br>cosθ= ${core.x.toFixed(3)}<br>signal= ${core.y.detectorNIU.toExponential(2)}`),
      mode: "markers",
      hoverinfo: "text",
      marker: {
        color: "#0000ff",
      },
    },
    {
      name: "PHWR", //PHWR Cores
      type: "scatter",
      y: PHWRcores.map((d) => d.y.detectorNIU),
      x: PHWRcores.map((d) => d.x),
      text: PHWRcores.map((core) => `${core.y.name} (${core.y.type})<br>cosθ= ${core.x.toFixed(3)}<br>signal= ${core.y.detectorNIU.toExponential(2)}`),
      mode: "markers",
      hoverinfo: "text",
      marker: {
        color: "#ff0000",
      },
    },
  ];
  var layout = {
    hovermode: "closest",
    title: `Core Directions w.r.t. ${
      ["custom", "follow"].includes(detector.current)
        ? "Custom Location"
        : detector.current
    } to ${first.name}<br /><sub>(${reactorLF.start.toISOString().slice(0, 7)} through ${reactorLF.end.toISOString().slice(0, 7)} avg Load Factor)</sub>`,
    yaxis: {
      title: { text: `signal (NIU)` },
      type: 'log',
      autorange: true
    },
    xaxis: {
      range: [-1.05 , 1.05],
      zeroline: false,
      title: { text: `cosθ` },
    },
    autosize: true,
    legend: {
      x: 1,
      y: 1,
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
  var config = {
    toImageButtonOptions: {
      filename: 'Core-Directions-signal-vs-cos(theta)'
    }
  };
  return (
    <Card>
      <Card.Header>Core Directions Plot</Card.Header>
      <Card.Body>
        <p> Reactor core signals in NIU versus the cosine of the angle &theta; w.r.t. the direction from the detector to the core with the highest signal (1 NIU = 1 interaction/10<sup>32</sup>{" "}
            targets/year).
        </p>
        <Plot
          useResizeHandler={true}
          style={{ width: "100%" }}
          data={data}
          layout={layout}
          config={config}
        />
      </Card.Body>
    </Card>
  );
};
