import { Card } from "react-bootstrap";
import Plot from "react-plotly.js";

import { energyValues, fluxSpectrumNue, fluxSpectrumAnu, fluxSpectrumNux } from "../supernova";

export const SupernovaFluxPlots = () => {
  const data = [
    {
      y: fluxSpectrumNue,
      x: energyValues,
      name: `ν<sub>e</sub>`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 1
      },
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: fluxSpectrumAnu,
      x: energyValues,
      name: `ν<sub>e</sub>`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 1
      },
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: fluxSpectrumNux,
      x: energyValues,
      name: `ν<sub>x</sub>`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 1
      },
      fill: "none",
      marker: { color: "green" },
    },
  ];
    var layout = {
    title: "Core Collapse SN Neutrino Flux Spectra",
    yaxis: {
      title: { text: `Flux (/cm<sup>2</sup>/MeV)` },
      autorange: true,
    },
    xaxis: {
      title: { text: `Neutrino Energy (MeV)` },
      range: [0.05, 60.05],
    },
    autosize: true,
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
      filename: 'Supernova-Flux-Spectra'
    }
  };
  return (
    <Card>
      <Card.Header>Core Collapse SN Neutrino Flux Spectra</Card.Header>
      <Card.Body>
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
