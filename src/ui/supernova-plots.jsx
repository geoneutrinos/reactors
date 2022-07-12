import { Card } from "react-bootstrap";
import Plot from "react-plotly.js";

import { energyValues, fluxSpectrum } from "../supernova";

export const SupernovaFluxPlots = () => {
  const data = [
    {
      y: fluxSpectrum,
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
  ];
    var layout = {
    title: "Core Collapse SN Neutrino Flux Spectra",
    yaxis: {
      title: { text: `Flux (/cm<sup>2</sup>/MeV)` },
      type: "log",
      range: [1, 10],
    },
    xaxis: {
      title: { text: `Neutrino Energy (MeV)` },
      range: [0.05, 100.05],
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
