import React, { useContext } from "react";
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
