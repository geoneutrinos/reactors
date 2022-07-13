import { Card } from "react-bootstrap";
import Plot from "react-plotly.js";

import { 
  energyValues, 
  fluxSpectrumNue, 
  fluxSpectrumAnu, 
  fluxSpectrumNux, 
  fluxNOSpectrumNue, 
  fluxNOSpectrumAnu, 
  fluxNOSpectrumNux, 
  fluxIOSpectrumNue, 
  fluxIOSpectrumAnu, 
  fluxIOSpectrumNux, 
} from "../supernova";

export const SupernovaFluxPlots = () => {
  const data = [
    {
      y: fluxSpectrumNue,
      x: energyValues,
      name: `ν<sub>e</sub>`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2
      },
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: fluxSpectrumAnu,
      x: energyValues,
      name: `ν̅<sub>e</sub>`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2
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
        width: 2
      },
      fill: "none",
      marker: { color: "green" },
    },
  ];
    var layout = {
    title: "Core Collapse SN Neutrino Flux Spectra w/o Oscillations",
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
      <Card.Header>Core Collapse SN Neutrino Flux Spectra w/o Oscillations</Card.Header>
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
export const SupernovaOscillatedFluxPlots = () => {
  const data = [
    {
      y: fluxNOSpectrumNue,
      x: energyValues,
      name: `ν<sub>e</sub> NO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2
      },
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: fluxNOSpectrumAnu,
      x: energyValues,
      name: `ν̅<sub>e</sub> NO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2
      },
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: fluxNOSpectrumNux,
      x: energyValues,
      name: `ν<sub>x</sub> NO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2
      },
      fill: "none",
      marker: { color: "green" },
    },
    {
      y: fluxIOSpectrumNue,
      x: energyValues,
      name: `ν<sub>e</sub> IO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2
      },
      fill: "none",
      marker: { color: "blue" },
      line: {dash: 'dotdash',},
   },
    {
      y: fluxIOSpectrumAnu,
      x: energyValues,
      name: `ν̅<sub>e</sub> IO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2
      },
      fill: "none",
      marker: { color: "red" },
      line: {dash: 'dotdash',},
    },
    {
      y: fluxIOSpectrumNux,
      x: energyValues,
      name: `ν<sub>x</sub> IO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2
      },
      fill: "none",
      marker: { color: "green" },
      line: {dash: 'dotdash',},
    },
  ];
    var layout = {
    title: "Core Collapse SN Neutrino Flux Spectra w/ Oscillations",
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
      filename: 'Supernova-Oscillated-Flux-Spectra'
    }
  };
  return (
    <Card>
      <Card.Header>Core Collapse SN Neutrino Flux Spectra w/ Oscillations</Card.Header>
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
