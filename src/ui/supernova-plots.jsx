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
  xsectionESeNue,
  xsectionESeAnu,
  xsectionESeNux,
  xsectionESeAnx,
  eventSpectrumIBDnoOsc,
  eventSpectrumIBDforNO,
  eventSpectrumIBDforIO,
} from "../supernova";

export const SupernovaPlotsIBD = () => {
  const data = [
    {
      y: eventSpectrumIBDnoOsc,
      x: energyValues,
      name: `IBD w/o osc`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2
      },
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: eventSpectrumIBDforNO,
      x: energyValues,
      name: `IBD for NO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2
      },
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: eventSpectrumIBDforIO,
      x: energyValues,
      name: `IBD for IO`,
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
    title: "Core Collapse SN Neutrino IBD Spectra",
    yaxis: {
      title: { text: `Events dN/dE (/10<sup>32</sup> p/MeV)` },
      autorange: true,
    },
    xaxis: {
      title: { text: `Neutrino Energy (MeV)` },
      range: [0.05, 80.05],
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
      filename: 'Supernova-IBD-Spectra'
    }
  };
  return (
    <Card>
      <Card.Header>Core Collapse SN Neutrino IBD Spectra</Card.Header>
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
  ];
    var layout = {
    title: "Core Collapse SN Neutrino Flux Spectra w/ NO Oscillations",
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
      <Card.Header>Core Collapse SN Neutrino Flux Spectra w/ NO Oscillations</Card.Header>
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
export const SupernovaOscillatedInvertedFluxPlots = () => {
  const data = [
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
      line: {dash: 'dashdot',},
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
      line: {dash: 'dashdot',},
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
      line: {dash: 'dashdot',},
    },
  ];
    var layout = {
    title: "Core Collapse SN Neutrino Flux Spectra w/ IO Oscillations",
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
      filename: 'Supernova-Oscillated-Inverted-Flux-Spectra'
    }
  };
  return (
    <Card>
      <Card.Header>Core Collapse SN Neutrino Flux Spectra w/ IO Oscillations</Card.Header>
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
export const NeutrinoElectronElasticScatteringCrossSection = () => {
  const data = [
    {
      y: xsectionESeNue,
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
      y: xsectionESeAnu,
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
      y: xsectionESeNux,
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
    {
      y: xsectionESeAnx,
      x: energyValues,
      name: `ν̅<sub>x</sub>`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2
      },
      fill: "none",
      marker: { color: "purple" },
    },
  ];
    var layout = {
    title: "Neutrino Electron Elastic Scattering Cross Section",
    yaxis: {
      title: { text: `Cross Section (cm<sup>2</sup>)` },
      type: 'log',
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
      filename: 'Elastic-Scattering-Cross-Section'
    }
  };
  return (
    <Card>
      <Card.Header>Neutrino Electron Elastic Scattering Cross Section</Card.Header>
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
