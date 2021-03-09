import React from "react";

import { Card } from "react-bootstrap";
import Plot from "react-plotly.js";

import { Isotopes } from "../physics/constants";
import { neutrinoEnergyFor } from "../physics/helpers";

export const FissionIsotopeSpectraPlots = () => {
  const bins = new Float64Array(1000).map((v, i) => 0.005 + i / 100);
  const data = [
    {
      y: bins.map(neutrinoEnergyFor(Isotopes.U238)),
      x: bins,
      name: `<sup>238</sup>U`,
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
    },
    {
      y: bins.map(neutrinoEnergyFor(Isotopes.U235)),
      x: bins,
      name: `<sup>235</sup>U`,
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: bins.map(neutrinoEnergyFor(Isotopes.PU239)),
      x: bins,
      name: `<sup>239</sup>Pu`,
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: bins.map(neutrinoEnergyFor(Isotopes.PU241)),
      x: bins,
      name: `<sup>241</sup>Pu`,
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "magenta" },
    },
  ];
  var layout = {
    title: "Fission Isotope Emission Spectra",
    yaxis: {
      title: { text: `Emission Spectra (/MeV/fission)` },
      type: "log",
      range: [-4, 1],
    },
    xaxis: {
      title: { text: `Antineutrino Energy (MeV)` },
      range: [1.8, 10],
    },
    autosize: true,
    legend: {
      x: 1,
      xanchor: "right",
      y: 1,
    },
  };
  return (
    <Card>
      <Card.Header>Fission Isotope Emission Spectra</Card.Header>
      <Card.Body>
        <p>
          <sup>235</sup>U, <sup>239</sup>Pu, <sup>241</sup>Pu spectra from:
          <br />
          P. Huber, "Determination of antineutrino spectra from nuclear
          reactors," Phys. Rev. C 84, 024617 (2011).
        </p>
        <p>
          <sup>238</sup>U spectrum from:
          <br />
          Mueller, Th. A. et al., "Improved predictions of reactor antineutrino
          spectra," Phys. Rev. C 83, 054615 (2011).
        </p>
        <Plot
          useResizeHandler={true}
          style={{ width: "100%" }}
          data={data}
          layout={layout}
        />
      </Card.Body>
    </Card>
  );
};

export const CoreDirectionSignalPlots = ({ cores }) => {
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
    title: `Core Direction (${first.name})`,
    yaxis: {
      title: { text: `signal (NIU)` },
      type: 'log',
      autorange: true
    },
    xaxis: {
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
        x: 1,
        xref: "paper",
        y: 0,
        yref: "paper",
      },
    ],
  };
  return (
    <Card>
      <Card.Header>Core Direction Plot</Card.Header>
      <Card.Body>
        <p> Reactor core signal in NIU versus the cosine of the angle w.r.t. the direction from the detector to the closest core. (1 NIU = 1 interaction/10<sup>32</sup>{" "}
            targets/year)
        </p>
        <Plot
          useResizeHandler={true}
          style={{ width: "100%" }}
          data={data}
          layout={layout}
        />
      </Card.Body>
    </Card>
  );
};
