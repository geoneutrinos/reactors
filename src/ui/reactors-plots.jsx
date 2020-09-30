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
      range: [2, 10],
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
          235U, 239Pu, 241Pu spectra from:
          <br />
          P. Huber, "Determination of antineutrino spectra from nuclear
          reactors," Phys. Rev. C 84, 024617 (2011).
        </p>
        <p>
          238U spectrum from:
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
