import { Card } from "react-bootstrap";
import Plot from "react-plotly.js";

import {crossSectionSV2003, NeutrinoType} from "../physics/neutrino-cross-section"
import { MassOrdering } from "../physics/neutrino-oscillation";

import { energyValues} from "../supernova";

export const SupernovaPlotsIBDnue16O = ({
  E16OIBDUnoscillated,
  E16OIBDOscillatedNormal,
  E16OIBDOscillatedInverted,
  E16OIBDUnoscillatedG1,
  E16OIBDOscillatedNormalG1,
  E16OIBDOscillatedInvertedG1,
  E16OIBDUnoscillatedG2,
  E16OIBDOscillatedNormalG2,
  E16OIBDOscillatedInvertedG2,
  E16OIBDUnoscillatedG3,
  E16OIBDOscillatedNormalG3,
  E16OIBDOscillatedInvertedG3,
  E16OIBDUnoscillatedG4,
  E16OIBDOscillatedNormalG4,
  E16OIBDOscillatedInvertedG4,
  nueAvgEnrg, 
  anuAvgEnrg, 
  nuxAvgEnrg, 
  nueTotEnrg, 
  anuTotEnrg, 
  nuxTotEnrg,
  nueSpectrumShapeParam,
  anuSpectrumShapeParam,
  nuxSpectrumShapeParam,
}) => {
  const data = [
    {
      y: E16OIBDUnoscillated.eventSpectrum,
      x: energyValues,
      name: `ν<sub>e</sub>+<sup>16</sup>O w/o osc`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "black" },
    },
    {
      y: E16OIBDOscillatedNormal.eventSpectrum,
      x: energyValues,
      name: `ν<sub>e</sub>+<sup>16</sup>O NO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dot"
      },
      fill: "none",
      marker: { color: "black" },
    },
    {
      y: E16OIBDOscillatedInverted.eventSpectrum,
      x: energyValues,
      name: `ν<sub>e</sub>+<sup>16</sup>O IO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dashdot",
      },
      fill: "none",
      marker: { color: "black" },
    },
    {
      y: E16OIBDUnoscillatedG1.eventSpectrum,
      x: energyValues,
      name: `ν<sub>e</sub>+<sup>16</sup>O w/o osc- G1`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        color: "orchid",
      },
      fill: "none",
    },
    {
      y: E16OIBDOscillatedNormalG1.eventSpectrum,
      x: energyValues,
      name: `ν<sub>e</sub>+<sup>16</sup>O NO- G1`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dot",
      },
      fill: "none",
      marker: { color: "orchid" },
    },
    {
      y: E16OIBDOscillatedInvertedG1.eventSpectrum,
      x: energyValues,
      name: `ν<sub>e</sub>+<sup>16</sup>O IO- G1`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dashdot",
      },
      fill: "none",
      marker: { color: "orchid" },
    },
    {
      y: E16OIBDUnoscillatedG2.eventSpectrum,
      x: energyValues,
      name: `ν<sub>e</sub>+<sup>16</sup>O w/o osc- G2`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "mediumblue" },
    },
    {
      y: E16OIBDOscillatedNormalG2.eventSpectrum,
      x: energyValues,
      name: `ν<sub>e</sub>+<sup>16</sup>O NO- G2`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dot",
      },
      fill: "none",
      marker: { color: "mediumblue" },
    },
    {
      y: E16OIBDOscillatedInvertedG2.eventSpectrum,
      x: energyValues,
      name: `ν<sub>e</sub>+<sup>16</sup>O IO- G2`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dashdot",
      },
      fill: "none",
      marker: { color: "mediumblue" },
    },
    {
      y: E16OIBDUnoscillatedG3.eventSpectrum,
      x: energyValues,
      name: `ν<sub>e</sub>+<sup>16</sup>O w/o osc- G3`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "olive" },
    },
    {
      y: E16OIBDOscillatedNormalG3.eventSpectrum,
      x: energyValues,
      name: `ν<sub>e</sub>+<sup>16</sup>O NO- G3`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dot",
      },
      fill: "none",
      marker: { color: "olive" },
    },
    {
      y: E16OIBDOscillatedInvertedG3.eventSpectrum,
      x: energyValues,
      name: `ν<sub>e</sub>+<sup>16</sup>O IO- G3`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dashdot",
      },
      fill: "none",
      marker: { color: "olive" },
    },
    {
      y: E16OIBDUnoscillatedG4.eventSpectrum,
      x: energyValues,
      name: `ν<sub>e</sub>+<sup>16</sup>O w/o osc- G4`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "tomato" },
    },
    {
      y: E16OIBDOscillatedNormalG4.eventSpectrum,
      x: energyValues,
      name: `ν<sub>e</sub>+<sup>16</sup>O NO- G4`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dot",
      },
      fill: "none",
      marker: { color: "tomato" },
    },
    {
      y: E16OIBDOscillatedInvertedG4.eventSpectrum,
      x: energyValues,
      name: `ν<sub>e</sub>+<sup>16</sup>O IO- G4`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dashdot",
      },
      fill: "none",
      marker: { color: "tomato" },
    },
  ];
  var layout = {
    title: `CCSN (10 kpc): ν<sub>e</sub>+<sup>16</sup>O IBD Spectra
    <br /><sub>ν<sub>e</sub> , ν̅<sub>e</sub> , ν<sub>x</sub> : E<sub>tot</sub> (10<sup>52</sup> erg) / E<sub>avg</sub> (MeV) / β = ${nueTotEnrg.toFixed(1)} / ${nueAvgEnrg.toFixed(1)} / ${nueSpectrumShapeParam.toFixed(0)}, ${anuTotEnrg.toFixed(1)} / ${anuAvgEnrg.toFixed(1)} / ${anuSpectrumShapeParam.toFixed(0)}, ${nuxTotEnrg.toFixed(1)} / ${nuxAvgEnrg.toFixed(1)} / ${nuxSpectrumShapeParam.toFixed(0)}</sub>`,
    yaxis: {
      title: { text: `Events dN/dE (/10<sup>32</sup> targets/MeV)` },
      type: "log",
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
      filename: "Supernova-IBD-nue-16O-Spectra",
    },
  };
  return (
    <Card>
      <Card.Header>CCSN (10 kpc): ν<sub>e</sub>+<sup>16</sup>O IBD Spectra</Card.Header>
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

export const SupernovaPlotsIBDnuebar16O = ({
  AntiE16OIBDUnoscillated,
  AntiE16OIBDOscillatedNormal,
  AntiE16OIBDOscillatedInverted,
  AntiE16OIBDUnoscillatedG1,
  AntiE16OIBDOscillatedNormalG1,
  AntiE16OIBDOscillatedInvertedG1,
  AntiE16OIBDUnoscillatedG2,
  AntiE16OIBDOscillatedNormalG2,
  AntiE16OIBDOscillatedInvertedG2,
  AntiE16OIBDUnoscillatedG3,
  AntiE16OIBDOscillatedNormalG3,
  AntiE16OIBDOscillatedInvertedG3,
  AntiE16OIBDUnoscillatedG4,
  AntiE16OIBDOscillatedNormalG4,
  AntiE16OIBDOscillatedInvertedG4,
  nueAvgEnrg, 
  anuAvgEnrg, 
  nuxAvgEnrg, 
  nueTotEnrg, 
  anuTotEnrg, 
  nuxTotEnrg,
  nueSpectrumShapeParam,
  anuSpectrumShapeParam,
  nuxSpectrumShapeParam,
}) => {
  const data = [
    {
      y: AntiE16OIBDUnoscillated.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+<sup>16</sup>O w/o osc`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "black" },
    },
    {
      y: AntiE16OIBDOscillatedNormal.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+<sup>16</sup>O NO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dot",
      },
      fill: "none",
      marker: { color: "black" },
    },
    {
      y: AntiE16OIBDOscillatedInverted.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+<sup>16</sup>O IO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dashdot",
      },
      fill: "none",
      marker: { color: "black" },
    },
    {
      y: AntiE16OIBDUnoscillatedG1.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+<sup>16</sup>O w/o osc- G1`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "orchid" },
    },
    {
      y: AntiE16OIBDOscillatedNormalG1.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+<sup>16</sup>O NO- G1`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dot",
      },
      fill: "none",
      marker: { color: "orchid" },
    },
    {
      y: AntiE16OIBDOscillatedInvertedG1.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+<sup>16</sup>O IO- G1`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dashdot",
      },
      fill: "none",
      marker: { color: "orchid" },
    },
    {
      y: AntiE16OIBDUnoscillatedG2.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+<sup>16</sup>O w/o osc- G2`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "mediumblue" },
    },
    {
      y: AntiE16OIBDOscillatedNormalG2.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+<sup>16</sup>O NO- G2`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dot",
      },
      fill: "none",
      marker: { color: "mediumblue" },
    },
    {
      y: AntiE16OIBDOscillatedInvertedG2.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+<sup>16</sup>O IO- G2`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dot",
      },
      fill: "none",
      marker: { color: "mediumblue" },
    },
    {
      y: AntiE16OIBDUnoscillatedG3.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+<sup>16</sup>O w/o osc- G3`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "olive" },
    },
    {
      y: AntiE16OIBDOscillatedNormalG3.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+<sup>16</sup>O NO- G3`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dot",
      },
      fill: "none",
      marker: { color: "olive" },
    },
    {
      y: AntiE16OIBDOscillatedInvertedG3.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+<sup>16</sup>O IO- G3`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dashdot",
      },
      fill: "none",
      marker: { color: "olive" },
    },
    {
      y: AntiE16OIBDUnoscillatedG4.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+<sup>16</sup>O w/o osc- G4`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "tomato" },
    },
    {
      y: AntiE16OIBDOscillatedNormalG4.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+<sup>16</sup>O NO- G4`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dot",
      },
      fill: "none",
      marker: { color: "tomato" },
    },
    {
      y: AntiE16OIBDOscillatedInvertedG4.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+<sup>16</sup>O IO- G4`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dashdot",
      },
      fill: "none",
      marker: { color: "tomato" },
    },
  ];
  var layout = {
    title: `CCSN (10 kpc): ν̅<sub>e</sub>+<sup>16</sup>O IBD Spectra
    <br /><sub>ν<sub>e</sub> , ν̅<sub>e</sub> , ν<sub>x</sub> : E<sub>tot</sub> (10<sup>52</sup> erg) / E<sub>avg</sub> (MeV) / β = ${nueTotEnrg.toFixed(1)} / ${nueAvgEnrg.toFixed(1)} / ${nueSpectrumShapeParam.toFixed(0)}, ${anuTotEnrg.toFixed(1)} / ${anuAvgEnrg.toFixed(1)} / ${anuSpectrumShapeParam.toFixed(0)}, ${nuxTotEnrg.toFixed(1)} / ${nuxAvgEnrg.toFixed(1)} / ${nuxSpectrumShapeParam.toFixed(0)}</sub>`,
    yaxis: {
      title: { text: `Events dN/dE (/10<sup>32</sup> targets/MeV)` },
      type: "log",
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
      filename: "Supernova-IBD-nuebar-16O-Spectra",
    },
  };
  return (
    <Card>
      <Card.Header>CCSN (10 kpc): ν̅<sub>e</sub>+<sup>16</sup>O IBD Spectra</Card.Header>
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

export const SupernovaPlotsIBD = ({
  pIBDUnoscillated, 
  pIBDOscillatedNormal, 
  pIBDOscillatedInverted, 
  AntiE12CIBDUnoscillated,
  AntiE12CIBDOscillatedNormal,
  AntiE12CIBDOscillatedInverted,
  E12CIBDUnoscillated,
  E12CIBDOscillatedNormal,
  E12CIBDOscillatedInverted,
  nueAvgEnrg, 
  anuAvgEnrg, 
  nuxAvgEnrg, 
  nueTotEnrg, 
  anuTotEnrg, 
  nuxTotEnrg,
  nueSpectrumShapeParam,
  anuSpectrumShapeParam,
  nuxSpectrumShapeParam,
}) => {
  const data = [
    {
      y: pIBDUnoscillated.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+p w/o osc`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "goldenrod" },
    },
    {
      y: pIBDOscillatedNormal.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+p NO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dot",
      },
      fill: "none",
      marker: { color: "goldenrod" },
    },
    {
      y: pIBDOscillatedInverted.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+p IO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dashdot",
      },
      fill: "none",
      marker: { color: "goldenrod" },
    },
    {
      y: AntiE12CIBDUnoscillated.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+<sup>12</sup>C w/o osc`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "darkred" },
    },
    {
      y: AntiE12CIBDOscillatedNormal.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+<sup>12</sup>C NO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dot",
      },
      fill: "none",
      marker: { color: "darkred" },
    },
    {
      y: AntiE12CIBDOscillatedInverted.eventSpectrum,
      x: energyValues,
      name: `ν̅<sub>e</sub>+<sup>12</sup>C IO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dashdot",
      },
      fill: "none",
      marker: { color: "darkred" },
    },
    {
      y: E12CIBDUnoscillated.eventSpectrum,
      x: energyValues,
      name: `ν<sub>e</sub>+<sup>12</sup>C w/o osc`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "olive" },
    },
    {
      y: E12CIBDOscillatedNormal.eventSpectrum,
      x: energyValues,
      name: `ν<sub>e</sub>+<sup>12</sup>C NO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dot",
      },
      fill: "none",
      marker: { color: "olive" },
    },
    {
      y: E12CIBDOscillatedInverted.eventSpectrum,
      x: energyValues,
      name: `ν<sub>e</sub>+<sup>12</sup>C IO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dashdot",
      },
      fill: "none",
      marker: { color: "olive" },
    },
  ];
  var layout = {
    title: `CCSN (10 kpc): ν<sub>e</sub> , ν̅<sub>e</sub> IBD Spectra
    <br /><sub>ν<sub>e</sub> , ν̅<sub>e</sub> , ν<sub>x</sub> : E<sub>tot</sub> (10<sup>52</sup> erg) / E<sub>avg</sub> (MeV) / β = ${nueTotEnrg.toFixed(1)} / ${nueAvgEnrg.toFixed(1)} / ${nueSpectrumShapeParam.toFixed(0)}, ${anuTotEnrg.toFixed(1)} / ${anuAvgEnrg.toFixed(1)} / ${anuSpectrumShapeParam.toFixed(0)}, ${nuxTotEnrg.toFixed(1)} / ${nuxAvgEnrg.toFixed(1)} / ${nuxSpectrumShapeParam.toFixed(0)}</sub>`,
    yaxis: {
      title: { text: `Events dN/dE (/10<sup>32</sup> targets/MeV)` },
      type: "log",
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
      <Card.Header>CCSN (10 kpc): ν<sub>e</sub> , ν̅<sub>e</sub> IBD Spectra</Card.Header>
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
export const SupernovaFluxPlots = ({
  fluxSpectrums,
  nueAvgEnrg, 
  anuAvgEnrg, 
  nuxAvgEnrg, 
  nueTotEnrg, 
  anuTotEnrg, 
  nuxTotEnrg,
  nueSpectrumShapeParam,
  anuSpectrumShapeParam,
  nuxSpectrumShapeParam,
}) => {
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
    title: `CCSN (10 kpc): Neutrino Fluence Spectra w/o Oscillations
    <br /><sub>ν<sub>e</sub> , ν̅<sub>e</sub> , ν<sub>x</sub> : E<sub>tot</sub> (10<sup>52</sup> erg) / E<sub>avg</sub> (MeV) / β = ${nueTotEnrg.toFixed(1)} / ${nueAvgEnrg.toFixed(1)} / ${nueSpectrumShapeParam.toFixed(0)}, ${anuTotEnrg.toFixed(1)} / ${anuAvgEnrg.toFixed(1)} / ${anuSpectrumShapeParam.toFixed(0)}, ${nuxTotEnrg.toFixed(1)} / ${nuxAvgEnrg.toFixed(1)} / ${nuxSpectrumShapeParam.toFixed(0)}</sub>`,
    yaxis: {
      title: { text: `Fluence (/cm<sup>2</sup>/MeV)` },
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
        CCSN (10 kpc): Neutrino Fluence Spectra w/o Oscillations
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
export const SupernovaOscillatedFluxPlots = ({
  oscillatedFluxSpectrums,
  nueAvgEnrg, 
  anuAvgEnrg, 
  nuxAvgEnrg, 
  nueTotEnrg, 
  anuTotEnrg, 
  nuxTotEnrg,
  nueSpectrumShapeParam,
  anuSpectrumShapeParam,
  nuxSpectrumShapeParam,
}) => {
  const data = [
    {
      y: oscillatedFluxSpectrums[MassOrdering.Normal][NeutrinoType.electronNeutrino],
      x: energyValues,
      name: `ν<sub>e</sub> NO`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
        dash: "dot",
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
        dash: "dot",
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
        dash: "dot",
      },
      fill: "none",
      marker: { color: "green" },
    },
  ];
  var layout = {
    title: `CCSN (10 kpc): Neutrino Fluence Spectra NO Oscillations
    <br /><sub>ν<sub>e</sub> , ν̅<sub>e</sub> , ν<sub>x</sub> : E<sub>tot</sub> (10<sup>52</sup> erg) / E<sub>avg</sub> (MeV) / β = ${nueTotEnrg.toFixed(1)} / ${nueAvgEnrg.toFixed(1)} / ${nueSpectrumShapeParam.toFixed(0)}, ${anuTotEnrg.toFixed(1)} / ${anuAvgEnrg.toFixed(1)} / ${anuSpectrumShapeParam.toFixed(0)}, ${nuxTotEnrg.toFixed(1)} / ${nuxAvgEnrg.toFixed(1)} / ${nuxSpectrumShapeParam.toFixed(0)}</sub>`,
    yaxis: {
      title: { text: `Fluence (/cm<sup>2</sup>/MeV)` },
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
        CCSN (10 kpc): Neutrino Fluence Spectra NO Oscillations
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
export const SupernovaOscillatedInvertedFluxPlots = ({
  oscillatedFluxSpectrums,
  nueAvgEnrg, 
  anuAvgEnrg, 
  nuxAvgEnrg, 
  nueTotEnrg, 
  anuTotEnrg, 
  nuxTotEnrg,
  nueSpectrumShapeParam,
  anuSpectrumShapeParam,
  nuxSpectrumShapeParam,
}) => {
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
    title: `CCSN (10 kpc): Neutrino Fluence Spectra IO Oscillations
    <br /><sub>ν<sub>e</sub> , ν̅<sub>e</sub> , ν<sub>x</sub> : E<sub>tot</sub> (10<sup>52</sup> erg) / E<sub>avg</sub> (MeV) / β = ${nueTotEnrg.toFixed(1)} / ${nueAvgEnrg.toFixed(1)} / ${nueSpectrumShapeParam.toFixed(0)}, ${anuTotEnrg.toFixed(1)} / ${anuAvgEnrg.toFixed(1)} / ${anuSpectrumShapeParam.toFixed(0)}, ${nuxTotEnrg.toFixed(1)} / ${nuxAvgEnrg.toFixed(1)} / ${nuxSpectrumShapeParam.toFixed(0)}</sub>`,
    yaxis: {
      title: { text: `Fluence (/cm<sup>2</sup>/MeV)` },
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
        CCSN (10 kpc): Neutrino Fluence Spectra IO Oscillations
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

export const SupernovaNeutrinoCrossSections = ({
  ESpNue,
  ESpAnu,
  ESEforNO,
  AntiESEforNO,
  NuxESEforNO,
  AnxESEforNO,
  AntiE12CIBDUnoscillated,
  E12CIBDUnoscillated,
  AntiE16OIBDUnoscillated,
  E16OIBDUnoscillated,
}) => {
  const xsectionIBD = energyValues.map(crossSectionSV2003)

  const data = [
    {
      y: xsectionIBD,
      x: energyValues,
      name: `ν̅<sub>e</sub>+p`,
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
      name: `ν+p`,
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
      name: `ν̅+p`,
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "black" },
      line: { dash: "dot" },
    },
    {
      y: ESEforNO.crossSection,
      x: energyValues,
      name: `ν<sub>e</sub>+e<sup>-</sup>`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "navy" },
    },
    {
      y: AntiESEforNO.crossSection,
      x: energyValues,
      name: `ν̅<sub>e</sub>+e<sup>-</sup>`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "darkred" },
    },
    {
      y: NuxESEforNO.crossSection,
      x: energyValues,
      name: `ν<sub>x</sub>+e<sup>-</sup>`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "yellowgreen" },
    },
    {
      y: AnxESEforNO.crossSection,
      x: energyValues,
      name: `ν̅<sub>x</sub>+e<sup>-</sup>`,
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "indigo" },
      line: { dash: "dot" },
    },
    {
      y: AntiE12CIBDUnoscillated.crossSection,
      x: energyValues,
      name: `ν̅<sub>e</sub>+<sup>12</sup>C`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "black" },
    },
    {
      y: E12CIBDUnoscillated.crossSection,
      x: energyValues,
      name: `ν<sub>e</sub>+<sup>12</sup>C`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "grey" },
    },
    {
      y: AntiE16OIBDUnoscillated.crossSection,
      x: energyValues,
      name: `ν̅<sub>e</sub>+<sup>16</sup>O`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "blueviolet" },
    },
    {
      y: E16OIBDUnoscillated.crossSection,
      x: energyValues,
      name: `ν<sub>e</sub>+<sup>16</sup>O`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "fuchsia" },
    },
  ];
  var layout = {
    title: "Neutrino Cross Sections",
    yaxis: {
      title: { text: `Cross Section (cm<sup>2</sup>)` },
      type: "log",
      range: [-46.,-38.6],
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
        Neutrino Cross Sections
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
