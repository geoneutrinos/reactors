import { Card } from "react-bootstrap";
import Plot from "react-plotly.js";

import {crossSectionSV2003, NeutrinoType} from "../physics/neutrino-cross-section"
import { MassOrdering } from "../physics/neutrino-oscillation";

import { energyValues} from "../supernova";

export const SupernovaPlotsIBD = ({IBDUnoscilated, IBDOscilatedNormal, IBDOscilatedInverted}) => {
  const data = [
    {
      y: IBDUnoscilated.eventSpectrum,
      x: energyValues,
      name: `IBD w/o osc`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: IBDOscilatedNormal.eventSpectrum,
      x: energyValues,
      name: `IBD for NO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: IBDOscilatedInverted.eventSpectrum,
      x: energyValues,
      name: `IBD for IO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
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
      filename: "Supernova-IBD-Spectra",
    },
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
export const SupernovaFluxPlots = ({fluxSpectrums}) => {
  const data = [
    {
      y: fluxSpectrums[NeutrinoType.electronNeutrino],
      x: energyValues,
      name: `ν<sub>e</sub>`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: fluxSpectrums[NeutrinoType.electronAntineutrino],
      x: energyValues,
      name: `ν̅<sub>e</sub>`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: fluxSpectrums[NeutrinoType.muTauNeutrino],
      x: energyValues,
      name: `ν<sub>x</sub>`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
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
      filename: "Supernova-Flux-Spectra",
    },
  };
  return (
    <Card>
      <Card.Header>
        Core Collapse SN Neutrino Flux Spectra w/o Oscillations
      </Card.Header>
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
export const SupernovaOscillatedFluxPlots = ({oscillatedFluxSpectrums}) => {
  const data = [
    {
      y: oscillatedFluxSpectrums[MassOrdering.Normal][NeutrinoType.electronNeutrino],
      x: energyValues,
      name: `ν<sub>e</sub> NO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: oscillatedFluxSpectrums[MassOrdering.Normal][NeutrinoType.electronAntineutrino],
      x: energyValues,
      name: `ν̅<sub>e</sub> NO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: oscillatedFluxSpectrums[MassOrdering.Normal][NeutrinoType.muTauNeutrino],
      x: energyValues,
      name: `ν<sub>x</sub> NO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
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
      filename: "Supernova-Oscillated-Flux-Spectra",
    },
  };
  return (
    <Card>
      <Card.Header>
        Core Collapse SN Neutrino Flux Spectra w/ NO Oscillations
      </Card.Header>
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
export const SupernovaOscillatedInvertedFluxPlots = ({oscillatedFluxSpectrums}) => {
  const data = [
    {
      y: oscillatedFluxSpectrums[MassOrdering.Inverted][NeutrinoType.electronNeutrino],
      x: energyValues,
      name: `ν<sub>e</sub> IO`,
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
      line: { dash: "dashdot" },
    },
    {
      y: oscillatedFluxSpectrums[MassOrdering.Inverted][NeutrinoType.electronAntineutrino],
      x: energyValues,
      name: `ν̅<sub>e</sub> IO`,
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
      line: { dash: "dashdot" },
    },
    {
      y: oscillatedFluxSpectrums[MassOrdering.Inverted][NeutrinoType.muTauNeutrino],
      x: energyValues,
      name: `ν<sub>x</sub> IO`,
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
      line: { dash: "dashdot" },
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
      filename: "Supernova-Oscillated-Inverted-Flux-Spectra",
    },
  };
  return (
    <Card>
      <Card.Header>
        Core Collapse SN Neutrino Flux Spectra w/ IO Oscillations
      </Card.Header>
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
export const NeutrinoElectronElasticScatteringCrossSection = ({
  ESpNue,
  ESpAnu,
  ESEforNO,
  AntiESEforNO,
  NuxESEforNO,
  AnxESEforNO,
}) => {
  const xsectionIBD = energyValues.map(crossSectionSV2003)

  const data = [
    {
      y: xsectionIBD,
      x: energyValues,
      name: `ν̅<sub>e</sub>p`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "darkgoldenrod" },
    },
    {
      y: ESpNue.crossSection,
      x: energyValues,
      name: `νp`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "aqua" },
    },
    {
      y: ESpAnu.crossSection,
      x: energyValues,
      name: `ν̅p`,
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "black" },
      line: { dash: "dot" },
    },
    {
      y: ESEforNO.crossSection,
      x: energyValues,
      name: `ν<sub>e</sub>e`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: AntiESEforNO.crossSection,
      x: energyValues,
      name: `ν̅<sub>e</sub>e`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: NuxESEforNO.crossSection,
      x: energyValues,
      name: `ν<sub>x</sub>e`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "green" },
    },
    {
      y: AnxESEforNO.crossSection,
      x: energyValues,
      name: `ν̅<sub>x</sub>e`,
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "purple" },
      line: { dash: "dot" },
    },
  ];
  var layout = {
    title: "Core-Collapse Supernova Neutrino Cross Sections",
    yaxis: {
      title: { text: `Cross Section (cm<sup>2</sup>)` },
      type: "log",
      autorange: true,
    },
    xaxis: {
      title: { text: `Neutrino Energy (MeV)` },
      range: [0.055, 100.005],
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
      filename: "CCSN-Cross-Sections",
    },
  };
  return (
    <Card>
      <Card.Header>
        Core-Collapse Supernova Neutrino Cross Sections
      </Card.Header>
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
