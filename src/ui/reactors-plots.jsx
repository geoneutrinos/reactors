import React from "react";

import { Card } from "react-bootstrap";
import Plot from "react-plotly.js";

import { Isotopes } from "../physics/constants";
import { neutrinoEnergyFor as neutrinoEnergyForHM } from "../physics/reactor-antineutrinos/huber-muller";
import { neutrinoEnergyFor as neutrinoEnergyForES } from "../physics/reactor-antineutrinos/estienne";
import { neutrinoEnergyFor as neutrinoEnergyForKO } from "../physics/reactor-antineutrinos/kopeikin";
import bins from "../physics/bins";

export const FissionIsotopeSpectraPlotsHK = () => {
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
    {
      y: bins.map(neutrinoEnergyForKO(Isotopes.U235)),
      x: bins,
      name: `<sup>235</sup>U`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: bins.map(neutrinoEnergyForKO(Isotopes.U238)),
      x: bins,
      name: `<sup>238</sup>U`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "green" },
    },
    {
      y: bins.map(neutrinoEnergyForKO(Isotopes.PU239)),
      x: bins,
      name: `<sup>239</sup>Pu`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: bins.map(neutrinoEnergyForKO(Isotopes.PU241)),
      x: bins,
      name: `<sup>241</sup>Pu`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "magenta" },
    },
  ];
  var layout = {
    title: "Fission Isotope Emission Spectra",
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
      filename: 'Fission-Isotope-Spectra'
    }
  };
  return (
    <Card>
      <Card.Header>HK- Fission Isotope Emission Spectra</Card.Header>
      <Card.Body>
        <p>
          <sup>235</sup>U, <sup>238</sup>U, <sup>239</sup>Pu, <sup>241</sup>Pu summation spectra (solid):
          <br />
          M. Estienne <i>et al.</i> (2019), <i>Updated Summation Model: An Improved Agreement with the Daya Bay Antineutrino Fluxes</i>,
          Phys. Rev. Lett. 123, 022502.
        </p>
        <p>
          <sup>239</sup>Pu, <sup>241</sup>Pu conversion spectra (dot-dash):
          <br />
          P. Huber (2011), <i>Determination of antineutrino spectra from nuclear
          reactors</i>, Phys. Rev. C 84, 024617.
        </p>
        <p>
          <sup>235</sup>U, <sup>238</sup>U conversion spectra (dot-dash):
          <br />
          V. Kopeikin, M. Skorokhvatov, O. Titov (2021), <i>Reevaluating reactor antineutrino spectra with new measurements of the ratio
          between <sup>235</sup>U and <sup>239</sup>Pu β spectra</i>, Phys. Rev. D 104, L071301.
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

export const FissionIsotopeSpectraPlotsHM = () => {
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
    {
      y: bins.map(neutrinoEnergyForHM(Isotopes.U235)),
      x: bins,
      name: `<sup>235</sup>U`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: bins.map(neutrinoEnergyForHM(Isotopes.U238)),
      x: bins,
      name: `<sup>238</sup>U`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "green" },
    },
    {
      y: bins.map(neutrinoEnergyForHM(Isotopes.PU239)),
      x: bins,
      name: `<sup>239</sup>Pu`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: bins.map(neutrinoEnergyForHM(Isotopes.PU241)),
      x: bins,
      name: `<sup>241</sup>Pu`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "magenta" },
    },
  ];
  var layout = {
    title: "HM- Fission Isotope Emission Spectra",
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
      filename: 'Fission-Isotope-Spectra'
    }
  };
  return (
    <Card>
      <Card.Header>HM- Fission Isotope Emission Spectra</Card.Header>
      <Card.Body>
        <p>
          <sup>235</sup>U, <sup>238</sup>U, <sup>239</sup>Pu, <sup>241</sup>Pu summation spectra (solid):
          <br />
          M. Estienne <i>et al.</i> (2019), <i>Updated Summation Model: An Improved Agreement with the Daya Bay Antineutrino Fluxes</i>,
          Phys. Rev. Lett. 123, 022502.
        </p>
        <p>
          <sup>235</sup>U, <sup>239</sup>Pu, <sup>241</sup>Pu conversion spectra (dot-dash):
          <br />
          P. Huber (2011), <i>Determination of antineutrino spectra from nuclear
          reactors</i>, Phys. Rev. C 84, 024617.
        </p>
        <p>
          <sup>238</sup>U <i>ab initio</i> spectrum (dot-dash):
          <br />
          Mueller, Th. A. <i>et al.</i> (2011), <i>Improved predictions of reactor antineutrino
          spectra</i>, Phys. Rev. C 83, 054615.
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

const U235IsotopeSpectraPlots = () => {
  const data = [
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.U235)),
      x: bins,
      name: `Estienne et al. (2019)`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: bins.map(neutrinoEnergyForHM(Isotopes.U235)),
      x: bins,
      name: `Huber (2011)`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 1
      },
      fill: "none",
      marker: { color: "blue" },
    },
    {
      x: [2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.5, 3.75, 4.0, 4.25, 4.5, 4.75, 5.0, 5.25, 5.5, 5.75, 6.0, 6.25, 6.5, 6.75, 7.0, 7.25, 7.5, 7.75, 8.0],
      y: [1.25, 1.06, .868, .731, .618, .525, .431, .345, .279, .218, .170, .131, .104, .0820, .0613, .0484, .0369, .0272, .0206, .0153, .0108, .00680, .00440, .00282, .00154],
      error_y: {
        type: "data",
        array: [.0125, .0106, .00868, .00731, .00618, .00525, .00431, .00380, .00335, .00305, .00289, .00236, .00198, .00164, .00135, .00116, .000996, .000816, .000618, .000505, .000389, .000279, .000194, .000141, .000108],
        thickness: 0.5,
        width: 2,
        color: "black"
      },
      name: `Kopeikin et al. (2021)`,
      type: "scatter",
      mode: "markers",
      marker: { color: "black", size: 1},
    },
  ];
  var layout = {
    title: `<sup>235</sup>U Emission Spectrum`,
    yaxis: {
      title: { text: `Emission (/fission/MeV)` },
      type: "log",
      range: [-3, Math.log10(4)],
    },
    xaxis: {
      title: { text: `Antineutrino Energy (MeV)` },
      range: [1.875, 8.125],
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
      filename: 'Fission-U235-Spectrum'
    }
  };
  return (
    <Card>
      <Card.Header><sup>235</sup>U Emission Spectrum</Card.Header>
      <Card.Body>
        <p>
          <sup>235</sup>U conversion spectrum parameterization:
          <br />
          P. Huber (2011), <i>Determination of antineutrino spectra from nuclear
          reactors</i>, Phys. Rev. C 84, 024617.
        </p>
        <p>
          <sup>235</sup>U conversion spectrum data points:
          <br />
          V. Kopeikin, M. Skorokhvatov, O. Titov (2021), <i>Reevaluating reactor antineutrino spectra with new measurements of the ratio
          between <sup>235</sup>U and <sup>239</sup>Pu β spectra</i>, Phys. Rev. D 104, L071301.
        </p>
        <p>
          <sup>235</sup>U summation spectrum:
          <br />
          M. Estienne <i>et al.</i> (2019), <i>Updated Summation Model: An Improved Agreement with the Daya Bay Antineutrino Fluxes</i>,
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
};

const U238IsotopeSpectraPlots = () => {
  const data = [
    {
      y: bins.map(neutrinoEnergyForES(Isotopes.U238)),
      x: bins,
      name: `Estienne et al. (2019)`,
      type: "scatter",
      mode: "lines",
      line: {
        dash: "dashdot",
        width: 1
      },
      fill: "none",
      marker: { color: "green" },
    },
    {
      y: bins.map(neutrinoEnergyForHM(Isotopes.U238)),
      x: bins,
      name: `Mueller et al. (2011)`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 1
      },
      fill: "none",
      marker: { color: "green" },
    },
    {
      x: [2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.5, 3.75, 4.0, 4.25, 4.5, 4.75, 5.0, 5.25, 5.5, 5.75, 6.0, 6.25, 6.5, 6.75, 7.0, 7.25, 7.5, 7.75, 8.0],
      y: [1.54, 1.35, 1.18, 1.04, .910, .755, .627, .513, .421, .332, .264, .206, .161, .127, .0979, .0734, .0533, .0377, .0289, .0266, .0199, .0108, .00677, .00470, .0030],
      error_y: {
        type: "data",
        array: [.0693, .0608, .0531, .0468, .0409, .0317, .0245, .0200, .0164, .0133, .0108, .00906, .00757, .00635, .00568, .00484, .00432, .00415, .00376, .00319, .00279, .00238, .00203, .00141, .0009],
        thickness: 0.5,
        width: 2,
        color: "black"
      },
      name: `Kopeikin et al. (2021)`,
      type: "scatter",
      mode: "markers",
      marker: { color: "black", size: 1},
    },
  ];
  var layout = {
    title: `<sup>238</sup>U Emission Spectrum`,
    yaxis: {
      title: { text: `Emission (/fission/MeV)` },
      type: "log",
      range: [-3, Math.log10(4)],
    },
    xaxis: {
      title: { text: `Antineutrino Energy (MeV)` },
      range: [1.875, 8.125],
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
      filename: 'Fission-U238-Spectrum'
    }
  };
  return (
    <Card>
      <Card.Header><sup>238</sup>U Emission Spectrum</Card.Header>
      <Card.Body>
        <p>
          <sup>238</sup>U summation spectrum parameterization:
          <br />
          Mueller, Th. A. <i>et al.</i> (2011), <i>Improved predictions of reactor antineutrino
          spectra</i>, Phys. Rev. C 83, 054615.
        </p>
        <p>
          <sup>238</sup>U conversion spectrum data points:
          <br />
          V. Kopeikin, M. Skorokhvatov, O. Titov (2021), <i>Reevaluating reactor antineutrino spectra with new measurements of the ratio
          between <sup>235</sup>U and <sup>239</sup>Pu β spectra</i>, Phys. Rev. D 104, L071301.
        </p>
        <p>
          <sup>238</sup>U summation spectrum:
          <br />
          M. Estienne <i>et al.</i> (2019), <i>Updated Summation Model: An Improved Agreement with the Daya Bay Antineutrino Fluxes</i>,
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
};

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
