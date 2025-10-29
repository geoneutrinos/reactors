import React, {memo} from "react";

import { Card } from "react-bootstrap";
import Plot from "react-plotly.js";

import { Isotopes } from "../physics/constants";
import { neutrinoEnergyFor as neutrinoEnergyForHM } from "../physics/reactor-antineutrinos/huber-muller";
import { neutrinoEnergyFor as neutrinoEnergyForES } from "../physics/reactor-antineutrinos/estienne";
import { neutrinoEnergyFor as neutrinoEnergyForKO } from "../physics/reactor-antineutrinos/kopeikin";
import bins from "../physics/bins";

export const FissionIsotopeSpectraPlotsHK = memo(() => {
  const data = [
    {
      y: bins.map(neutrinoEnergyForKO(Isotopes.U235)).slice(200,801),
      x: bins.slice(200,801),
      name: `<sup>235</sup>U`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 1
      },
      fill: "none",
      marker: { color: "blue" },
      legendgroup: "U235",
    },
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.U235)).slice(0,201),
      x: bins.slice(0,201),
      name: `<sup>235</sup>U`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "blue" },
      legendgroup: "U235",
      showlegend: false,
    },
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.U235)).slice(800),
      x: bins.slice(800),
      name: `<sup>235</sup>U`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "blue" },
      legendgroup: "U235",
      showlegend: false,
    },
    // ----
    {
      y: bins.map(neutrinoEnergyForKO(Isotopes.U238)).slice(200,801),
      x: bins.slice(200,801),
      name: `<sup>238</sup>U`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 1
      },
      fill: "none",
      marker: { color: "green" },
      legendgroup: "U238",
    },
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.U238)).slice(0,201),
      x: bins.slice(0,201),
      name: `<sup>238</sup>U`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "green" },
      legendgroup: "U238",
      showlegend: false,
    },
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.U238)).slice(800),
      x: bins.slice(800),
      name: `<sup>238</sup>U`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "green" },
      legendgroup: "U238",
      showlegend: false,
    },
    // ---
    {
      y: bins.map(neutrinoEnergyForKO(Isotopes.PU239)).slice(200,801),
      x: bins.slice(200,801),
      name: `<sup>239</sup>Pu`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 1
      },
      fill: "none",
      marker: { color: "red" },
      legendgroup: "PU239",
    },
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.PU239)).slice(0,201),
      x: bins.slice(0,201),
      name: `<sup>239</sup>Pu`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "red" },
      legendgroup: "PU239",
      showlegend: false,
    },
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.PU239)).slice(800),
      x: bins.slice(800),
      name: `<sup>239</sup>Pu`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "red" },
      legendgroup: "PU239",
      showlegend: false,
    },
    // ---
    {
      y: bins.map(neutrinoEnergyForKO(Isotopes.PU241)).slice(199,801),
      x: bins.slice(199,801),
      name: `<sup>241</sup>Pu`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 1
      },
      fill: "none",
      marker: { color: "magenta" },
      legendgroup: "PU241",
    },
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.PU241)).slice(0,200),
      x: bins.slice(0,200),
      name: `<sup>241</sup>Pu`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "magenta" },
      legendgroup: "PU241",
      showlegend: false,
    },
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.PU241)).slice(800),
      x: bins.slice(800),
      name: `<sup>241</sup>Pu`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "magenta" },
      legendgroup: "PU241",
      showlegend: false,
    },
  ];
  var layout = {
    title: "Huber-Kopeikin: Fission Isotope Emission Spectra",
    yaxis: {
      title: { text: `Emission (/fission/MeV)` },
      type: "log",
      range: [-5, 1],
    },
    xaxis: {
      title: { text: `Antineutrino Energy (MeV)` },
      range: [0.05, 10.05],
    },
    autosize: true,
    legend: {
      x: 1,
      xanchor: "right",
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
      filename: 'HK-Fission-Isotope-Spectra'
    }
  };
  return (
    <Card>
      <Card.Header>Huber-Kopeikin: Fission Isotope Emission Spectra</Card.Header>
      <Card.Body>
        <p>
          <sup>239</sup>Pu, <sup>241</sup>Pu conversion spectra (solid 2-8 MeV):
          <br />
          P. Huber (2011), <i>Determination of antineutrino spectra from nuclear
          reactors</i>, Phys. Rev. C 84, 024617.
        </p>
        <p>
          <sup>235</sup>U, <sup>238</sup>U conversion spectra (solid 2-8 MeV):
          <br />
          V. Kopeikin, M. Skorokhvatov, O. Titov (2021), <i>Reevaluating reactor antineutrino spectra with new measurements of the ratio
          between <sup>235</sup>U and <sup>239</sup>Pu β spectra</i>, Phys. Rev. D 104, L071301.
        </p>
        <p>
          <sup>235</sup>U, <sup>238</sup>U, <sup>239</sup>Pu, <sup>241</sup>Pu summation spectra (dot-dash 0-2, 8-10 MeV):
          <br />
          M. Estienne <i>et al.</i> (2019), <a href="https://doi.org/10.1103/PhysRevLett.123.022502"><i>Updated Summation Model: An Improved Agreement with the Daya Bay Antineutrino Fluxes</i>, </a>
          Phys. Rev. Lett. 123, 022502.
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
});

export const FissionIsotopeSpectraPlotsHM = memo(() => {
  const data = [
    {
      y: bins.map(neutrinoEnergyForHM(Isotopes.U235)).slice(199,801),
      x: bins.slice(199,801),
      name: `<sup>235</sup>U`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 1
      },
      fill: "none",
      marker: { color: "blue" },
      legendgroup: "U235",
    },
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.U235)).slice(0,200),
      x: bins.slice(0,200),
      name: `<sup>235</sup>U`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "blue" },
      legendgroup: "U235",
      showlegend: false,
    },
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.U235)).slice(800),
      x: bins.slice(800),
      name: `<sup>235</sup>U`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "blue" },
      legendgroup: "U235",
      showlegend: false,
    },
    // ---
    {
      y: bins.map(neutrinoEnergyForHM(Isotopes.U238)).slice(199,801),
      x: bins.slice(199,801),
      name: `<sup>238</sup>U`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 1
      },
      fill: "none",
      marker: { color: "green" },
      legendgroup: "U238",
    },
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.U238)).slice(0,200),
      x: bins.slice(0,200),
      name: `<sup>238</sup>U`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "green" },
      legendgroup: "U238",
      showlegend: false,
    },
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.U238)).slice(800),
      x: bins.slice(800),
      name: `<sup>238</sup>U`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "green" },
      legendgroup: "U238",
      showlegend: false,
    },
    // ---
    {
      y: bins.map(neutrinoEnergyForHM(Isotopes.PU239)).slice(199,801),
      x: bins.slice(199,801),
      name: `<sup>239</sup>Pu`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 1
      },
      fill: "none",
      marker: { color: "red" },
      legendgroup: "PU239",
    },
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.PU239)).slice(0,200),
      x: bins.slice(0,200),
      name: `<sup>239</sup>Pu`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "red" },
      legendgroup: "PU239",
      showlegend: false,
    },
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.PU239)).slice(800),
      x: bins.slice(800),
      name: `<sup>239</sup>Pu`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "red" },
      legendgroup: "PU239",
      showlegend: false,
    },
    // ---
    {
      y: bins.map(neutrinoEnergyForHM(Isotopes.PU241)).slice(199,801),
      x: bins.slice(199,801),
      name: `<sup>241</sup>Pu`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 1
      },
      fill: "none",
      marker: { color: "magenta" },
      legendgroup: "PU241",
    },
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.PU241)).slice(0,200),
      x: bins.slice(0,200),
      name: `<sup>241</sup>Pu`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "magenta" },
      legendgroup: "PU241",
      showlegend: false,
    },
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.PU241)).slice(800),
      x: bins.slice(800),
      name: `<sup>241</sup>Pu`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "magenta" },
      legendgroup: "PU241",
      showlegend: false,
    },
  ];
  var layout = {
    title: "Huber-Mueller: Fission Isotope Emission Spectra",
    yaxis: {
      title: { text: `Emission (/fission/MeV)` },
      type: "log",
      range: [-5, 1],
    },
    xaxis: {
      title: { text: `Antineutrino Energy (MeV)` },
      range: [0.05, 10.05],
    },
    autosize: true,
    legend: {
      x: 1,
      xanchor: "right",
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
      filename: 'HM-Fission-Isotope-Spectra'
    }
  };
  return (
    <Card>
      <Card.Header>Huber-Mueller: Fission Isotope Emission Spectra</Card.Header>
      <Card.Body>
        <p>
          <sup>235</sup>U, <sup>239</sup>Pu, <sup>241</sup>Pu conversion spectra (solid 2-8 MeV):
          <br />
          P. Huber (2011), <i>Determination of antineutrino spectra from nuclear
          reactors</i>, Phys. Rev. C 84, 024617.
        </p>
        <p>
          <sup>238</sup>U <i>ab initio</i> spectrum (solid 2-8 MeV):
          <br />
          Th. A. Mueller <i>et al.</i> (2011), <i>Improved predictions of reactor antineutrino
          spectra</i>, Phys. Rev. C 83, 054615.
        </p>
        <p>
          <sup>235</sup>U, <sup>238</sup>U, <sup>239</sup>Pu, <sup>241</sup>Pu summation spectra (dot-dash 0-2, 8-10 MeV):
          <br />
          M. Estienne <i>et al.</i> (2019), <a href="https://doi.org/10.1103/PhysRevLett.123.022502"><i>Updated Summation Model: An Improved Agreement with the Daya Bay Antineutrino Fluxes</i>, </a>
          Phys. Rev. Lett. 123, 022502.
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
});

export const FissionIsotopeSpectraPlotsES = memo(() => {
  const data = [
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.U235)),
      x: bins,
      name: `<sup>235</sup>U`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 1
      },
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.U238)),
      x: bins,
      name: `<sup>238</sup>U`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 1
      },
      fill: "none",
      marker: { color: "green" },
    },
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.PU239)),
      x: bins,
      name: `<sup>239</sup>Pu`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 1
      },
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.PU241)),
      x: bins,
      name: `<sup>241</sup>Pu`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 1
      },
      fill: "none",
      marker: { color: "magenta" },
    },
  ];
  var layout = {
    title: "Estienne et al.: Fission Isotope Emission Spectra",
    yaxis: {
      title: { text: `Emission (/fission/MeV)` },
      type: "log",
      range: [-5, 1],
    },
    xaxis: {
      title: { text: `Antineutrino Energy (MeV)` },
      range: [0.05, 10.05],
    },
    autosize: true,
    legend: {
      x: 1,
      xanchor: "right",
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
      filename: 'ES-Fission-Isotope-Spectra'
    }
  };
  return (
    <Card>
      <Card.Header>Estienne et al.: Fission Isotope Emission Spectra</Card.Header>
      <Card.Body>
        <p>
          <sup>235</sup>U, <sup>238</sup>U, <sup>239</sup>Pu, <sup>241</sup>Pu summation spectra (solid 0-10 MeV):
          <br />
          M. Estienne <i>et al.</i> (2019), <a href="https://doi.org/10.1103/PhysRevLett.123.022502"><i>Updated Summation Model: An Improved Agreement with the Daya Bay Antineutrino Fluxes</i>, </a>
          Phys. Rev. Lett. 123, 022502.
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
});

export const CoreDirectionSignalPlots = ({ cores, detector, reactorLF }) => {
  const sortedCores = Object.values(cores)
    .filter(core => core.shutdown > new Date())
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
