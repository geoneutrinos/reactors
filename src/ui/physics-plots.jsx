import React, {useContext} from 'react';

import { Card } from "react-bootstrap";
import { Node } from "@nteract/mathjax";
import Plot from "react-plotly.js";

import { XSAbrev, XSNames, XSNamesNormal } from '../physics/neutrino-cross-section';
import { PhysicsContext } from "../state"

import { differentialCrossSectionElasticScattering, NeutrinoType, TEMax, differentialCrossSectionElasticScatteringAngular } from '../physics/neutrino-cross-section'
import bins from "../physics/bins"

// TODO: bin assumption also why is it one larger?
const cosTbins = (new Float64Array(1001)).map((v, i) => i/1000)

const cumulativeFunc = (bins, func, eV, neutrinoType) => {
  return bins.map(function(Te){
    this.acc += func(eV, Te, neutrinoType)
    return this.acc
  }, {acc:0}).map((Te, idx, arr) => Te/arr[arr.length -1])
}

export const DifferentialCrossSectionPlotsNeutrinos = () => {
  const data = [
    {
      y: bins.filter(Te => Te < TEMax(10)).map((Te) => differentialCrossSectionElasticScattering(10, Te, NeutrinoType.electronNeutrino)),
      x: bins.filter(Te => Te < TEMax(10)),
      name: "ν<sub>e</sub> 10 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
    },
    {
      y: bins.filter(Te => Te < TEMax(7)).map((Te) => differentialCrossSectionElasticScattering(7, Te, NeutrinoType.electronNeutrino)),
      x: bins.filter(Te => Te < TEMax(7)),
      name: "ν<sub>e</sub> 7 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: bins.filter(Te => Te < TEMax(4)).map((Te) => differentialCrossSectionElasticScattering(4, Te, NeutrinoType.electronNeutrino)),
      x: bins.filter(Te => Te < TEMax(4)),
      name: "ν<sub>e</sub> 4 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: bins.filter(Te => Te < TEMax(1)).map((Te) => differentialCrossSectionElasticScattering(1, Te, NeutrinoType.electronNeutrino)),
      x: bins.filter(Te => Te < TEMax(1)),
      name: "ν<sub>e</sub> 1 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
    },
    {
      y: bins.filter(Te => Te < TEMax(10)).map((Te) => differentialCrossSectionElasticScattering(10, Te, NeutrinoType.muTauNeutrino)),
      x: bins.filter(Te => Te < TEMax(10)),
      name: "ν<sub>x</sub> 10 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
      line: {dash: 'dash',},
    },
    {
      y: bins.filter(Te => Te < TEMax(7)).map((Te) => differentialCrossSectionElasticScattering(7, Te, NeutrinoType.muTauNeutrino)),
      x: bins.filter(Te => Te < TEMax(7)),
      name: "ν<sub>x</sub> 7 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
      line: {dash: 'dash',},
    },
    {
      y: bins.filter(Te => Te < TEMax(4)).map((Te) => differentialCrossSectionElasticScattering(4, Te, NeutrinoType.muTauNeutrino)),
      x: bins.filter(Te => Te < TEMax(4)),
      name: "ν<sub>x</sub> 4 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
      line: {dash: 'dash',},
    },
    {
      y: bins.filter(Te => Te < TEMax(1)).map((Te) => differentialCrossSectionElasticScattering(1, Te, NeutrinoType.muTauNeutrino)),
      x: bins.filter(Te => Te < TEMax(1)),
      name: "ν<sub>x</sub> 1 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
      line: {dash: 'dash',},
    },
  ]
  const layout = {
    title: "eES Differential Cross Section- T<sub>e</sub>",
    yaxis: {
      title: { text: `d𝛔/dT<sub>e</sub> (cm<sup>2</sup>/MeV)` },
      type: 'log',
      autorange: true
    },
    xaxis: {
      title: { text: `T<sub>e</sub> (MeV)` },
    },
    autosize: true,
    legend: {
      x: 1,
      xanchor: "left",
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
      filename: 'ES-neutrinos-dsigma/dTe'
    }
  };
  return (
    <Card>
      <Card.Header>eES Differential Cross Section- T<sub>e</sub></Card.Header>
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
}

export const AngularDifferentialCrossSectionPlotsNeutrinos = () => {
  const data = [
    {
      y: cosTbins.map((cosT) => differentialCrossSectionElasticScatteringAngular(10, cosT, NeutrinoType.electronNeutrino)),
      x: cosTbins,
      name: "ν<sub>e</sub> 10 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
    },
    {
      y: cosTbins.map((cosT) => differentialCrossSectionElasticScatteringAngular(7, cosT, NeutrinoType.electronNeutrino)),
      x: cosTbins,
      name: "ν<sub>e</sub> 7 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: cosTbins.map((cosT) => differentialCrossSectionElasticScatteringAngular(4, cosT, NeutrinoType.electronNeutrino)),
      x: cosTbins,
      name: "ν<sub>e</sub> 4 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: cosTbins.map((cosT) => differentialCrossSectionElasticScatteringAngular(1, cosT, NeutrinoType.electronNeutrino)),
      x: cosTbins,
      name: "ν<sub>e</sub> 1 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
    },
    {
      y: cosTbins.map((cosT) => differentialCrossSectionElasticScatteringAngular(10, cosT, NeutrinoType.muTauNeutrino)),
      x: cosTbins,
      name: "ν<sub>x</sub> 10 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
      line: {dash: 'dash',},
    },
    {
      y: cosTbins.map((cosT) => differentialCrossSectionElasticScatteringAngular(7, cosT, NeutrinoType.muTauNeutrino)),
      x: cosTbins,
      name: "ν<sub>x</sub> 7 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
      line: {dash: 'dash',},
    },
    {
      y: cosTbins.map((cosT) => differentialCrossSectionElasticScatteringAngular(4, cosT, NeutrinoType.muTauNeutrino)),
      x: cosTbins,
      name: "ν<sub>x</sub> 4 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
      line: {dash: 'dash',},
    },
    {
      y: cosTbins.map((cosT) => differentialCrossSectionElasticScatteringAngular(1, cosT, NeutrinoType.muTauNeutrino)),
      x: cosTbins,
      name: "ν<sub>x</sub> 1 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
      line: {dash: 'dash',},
    },
  ]
  const layout = {
    title: "eES Differential Cross Section- cosθ",
    yaxis: {
      title: { text: `d𝛔/dcosθ (cm<sup>2</sup>)` },
      type: 'log',
      autorange: true
    },
    xaxis: {
      title: { text: `cosθ` },
    },
    autosize: true,
    legend: {
      x: 1,
      xanchor: "left",
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
      filename: 'ES-neutrinos-dsigma/dcos(theta)'
    }
  };
  return (
    <Card>
      <Card.Header>eES Differential Cross Section- cosθ</Card.Header>
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
}

export const AngularDifferentialCrossSectionPlots = () => {
  const data = [
    {
      y: cosTbins.map((cosT) => differentialCrossSectionElasticScatteringAngular(10, cosT, NeutrinoType.muTauAntineutrino)),
      x: cosTbins,
      name: "ν̅<sub>x</sub> 10 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
      line: {dash: 'dash',},
    },
    {
      y: cosTbins.map((cosT) => differentialCrossSectionElasticScatteringAngular(7, cosT, NeutrinoType.muTauAntineutrino)),
      x: cosTbins,
      name: "ν̅<sub>x</sub> 7 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
      line: {dash: 'dash',},
    },
    {
      y: cosTbins.map((cosT) => differentialCrossSectionElasticScatteringAngular(4, cosT, NeutrinoType.muTauAntineutrino)),
      x: cosTbins,
      name: "ν̅<sub>x</sub> 4 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
      line: {dash: 'dash',},
    },
    {
      y: cosTbins.map((cosT) => differentialCrossSectionElasticScatteringAngular(1, cosT, NeutrinoType.muTauAntineutrino)),
      x: cosTbins,
      name: "ν̅<sub>x</sub> 1 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
      line: {dash: 'dash',},
    },
    {
      y: cosTbins.map((cosT) => differentialCrossSectionElasticScatteringAngular(10, cosT, NeutrinoType.electronAntineutrino)),
      x: cosTbins,
      name: "ν̅<sub>e</sub> 10 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
    },
    {
      y: cosTbins.map((cosT) => differentialCrossSectionElasticScatteringAngular(7, cosT, NeutrinoType.electronAntineutrino)),
      x: cosTbins,
      name: "ν̅<sub>e</sub> 7 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: cosTbins.map((cosT) => differentialCrossSectionElasticScatteringAngular(4, cosT, NeutrinoType.electronAntineutrino)),
      x: cosTbins,
      name: "ν̅<sub>e</sub> 4 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: cosTbins.map((cosT) => differentialCrossSectionElasticScatteringAngular(1, cosT, NeutrinoType.electronAntineutrino)),
      x: cosTbins,
      name: "ν̅<sub>e</sub> 1 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
    },
  ]
  const layout = {
    title: "eES Differential Cross Section- cosθ",
    yaxis: {
      title: { text: `d𝛔/dcosθ (cm<sup>2</sup>)` },
      type: 'log',
      autorange: true
    },
    xaxis: {
      title: { text: `cosθ` },
    },
    autosize: true,
    legend: {
      x: 1,
      xanchor: "left",
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
      filename: 'ES-antinus-dsigma/dcos(theta)'
    }
  };
  return (
    <Card>
      <Card.Header>eES Differential Cross Section- cosθ</Card.Header>
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
}

export const CDFAngularDifferentialCrossSectionPlotsNeutrinos = () => {
  const data = [
    {
      y: cumulativeFunc(cosTbins, differentialCrossSectionElasticScatteringAngular, 10,NeutrinoType.muTauNeutrino),
      x: cosTbins,
      name: "ν<sub>x</sub> 10 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
      line: {dash: 'dash',},
    },
    {
      y: cumulativeFunc(cosTbins, differentialCrossSectionElasticScatteringAngular,7,NeutrinoType.muTauNeutrino),
      x: cosTbins,
      name: "ν<sub>x</sub> 7 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
      line: {dash: 'dash',},
    },
    {
      y: cumulativeFunc(cosTbins,differentialCrossSectionElasticScatteringAngular, 4, NeutrinoType.muTauNeutrino),
      x: cosTbins,
      name: "ν<sub>x</sub> 4 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
      line: {dash: 'dash',},
    },
    {
      y: cumulativeFunc(cosTbins, differentialCrossSectionElasticScatteringAngular, 1, NeutrinoType.muTauNeutrino),
      x: cosTbins,
      name: "ν<sub>x</sub> 1 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
      line: {dash: 'dash',},
    },
    {
      y: cumulativeFunc(cosTbins, differentialCrossSectionElasticScatteringAngular, 10, NeutrinoType.electronNeutrino),
      x: cosTbins,
      name: "ν<sub>e</sub> 10 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
    },
    {
      y: cumulativeFunc(cosTbins, differentialCrossSectionElasticScatteringAngular, 7, NeutrinoType.electronNeutrino),
      x: cosTbins,
      name: "ν<sub>e</sub> 7 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: cumulativeFunc(cosTbins, differentialCrossSectionElasticScatteringAngular, 4, NeutrinoType.electronNeutrino),
      x: cosTbins,
      name: "ν<sub>e</sub> 4 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: cumulativeFunc(cosTbins, differentialCrossSectionElasticScatteringAngular, 1, NeutrinoType.electronNeutrino),
      x: cosTbins,
      name: "ν<sub>e</sub> 1 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
    },
  ]
  const layout = {
    title: "eES Cumulative Differential Cross Section- cosθ",
    yaxis: {
      title: { text: `P(cosθ≤cosϑ)` },
      autorange: true
    },
    xaxis: {
      title: { text: `cosθ` },
    },
    autosize: true,
    legend: {
      x: 1,
      xanchor: "left",
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
      filename: 'CDF-ES-neutrinos-dsigma/dcos(theta)'
    }
  };
  return (
    <Card>
      <Card.Header>eES Cumulative Differential Cross Section- cosθ</Card.Header>
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
}

export const CDFAngularDifferentialCrossSectionPlots = () => {
  const data = [
    {
      y: cumulativeFunc(cosTbins, differentialCrossSectionElasticScatteringAngular, 10,NeutrinoType.muTauAntineutrino),
      x: cosTbins,
      name: "ν̅<sub>x</sub> 10 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
      line: {dash: 'dash',},
    },
    {
      y: cumulativeFunc(cosTbins, differentialCrossSectionElasticScatteringAngular,7,NeutrinoType.muTauAntineutrino),
      x: cosTbins,
      name: "ν̅<sub>x</sub> 7 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
      line: {dash: 'dash',},
    },
    {
      y: cumulativeFunc(cosTbins,differentialCrossSectionElasticScatteringAngular, 4, NeutrinoType.muTauAntineutrino),
      x: cosTbins,
      name: "ν̅<sub>x</sub> 4 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
      line: {dash: 'dash',},
    },
    {
      y: cumulativeFunc(cosTbins, differentialCrossSectionElasticScatteringAngular, 1, NeutrinoType.muTauAntineutrino),
      x: cosTbins,
      name: "ν̅<sub>x</sub> 1 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
      line: {dash: 'dash',},
    },
    {
      y: cumulativeFunc(cosTbins, differentialCrossSectionElasticScatteringAngular, 10, NeutrinoType.electronAntineutrino),
      x: cosTbins,
      name: "ν̅<sub>e</sub> 10 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
    },
    {
      y: cumulativeFunc(cosTbins, differentialCrossSectionElasticScatteringAngular, 7, NeutrinoType.electronAntineutrino),
      x: cosTbins,
      name: "ν̅<sub>e</sub> 7 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: cumulativeFunc(cosTbins, differentialCrossSectionElasticScatteringAngular, 4, NeutrinoType.electronAntineutrino),
      x: cosTbins,
      name: "ν̅<sub>e</sub> 4 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: cumulativeFunc(cosTbins, differentialCrossSectionElasticScatteringAngular, 1, NeutrinoType.electronAntineutrino),
      x: cosTbins,
      name: "ν̅<sub>e</sub> 1 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
    },
  ]
  const layout = {
    title: "eES Cumulative Differential Cross Section- cosθ",
    yaxis: {
      title: { text: `P(cosθ≤cosϑ)` },
      autorange: true
    },
    xaxis: {
      title: { text: `cosθ` },
    },
    autosize: true,
    legend: {
      x: 1,
      xanchor: "left",
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
      filename: 'CDF-ES-antinus-dsigma/dcos(theta)'
    }
  };
  return (
    <Card>
      <Card.Header>eES Cumulative Differential Cross Section- cosθ</Card.Header>
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
}

export const DifferentialCrossSectionPlots = () => {
  const data = [
    {
      y: bins.filter(Te => Te < TEMax(10)).map((Te) => differentialCrossSectionElasticScattering(10, Te, NeutrinoType.muTauAntineutrino)),
      x: bins.filter(Te => Te < TEMax(10)),
      name: "ν̅<sub>x</sub> 10 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
      line: {dash: 'dash',},
    },
    {
      y: bins.filter(Te => Te < TEMax(7)).map((Te) => differentialCrossSectionElasticScattering(7, Te, NeutrinoType.muTauAntineutrino)),
      x: bins.filter(Te => Te < TEMax(7)),
      name: "ν̅<sub>x</sub> 7 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
      line: {dash: 'dash',},
    },
    {
      y: bins.filter(Te => Te < TEMax(4)).map((Te) => differentialCrossSectionElasticScattering(4, Te, NeutrinoType.muTauAntineutrino)),
      x: bins.filter(Te => Te < TEMax(4)),
      name: "ν̅<sub>x</sub> 4 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
      line: {dash: 'dash',},
    },
    {
      y: bins.filter(Te => Te < TEMax(1)).map((Te) => differentialCrossSectionElasticScattering(1, Te, NeutrinoType.muTauAntineutrino)),
      x: bins.filter(Te => Te < TEMax(1)),
      name: "ν̅<sub>x</sub> 1 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
      line: {dash: 'dash',},
    },
    {
      y: bins.filter(Te => Te < TEMax(10)).map((Te) => differentialCrossSectionElasticScattering(10, Te, NeutrinoType.electronAntineutrino)),
      x: bins.filter(Te => Te < TEMax(10)),
      name: "ν̅<sub>e</sub> 10 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
    },
    {
      y: bins.filter(Te => Te < TEMax(7)).map((Te) => differentialCrossSectionElasticScattering(7, Te, NeutrinoType.electronAntineutrino)),
      x: bins.filter(Te => Te < TEMax(7)),
      name: "ν̅<sub>e</sub> 7 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: bins.filter(Te => Te < TEMax(4)).map((Te) => differentialCrossSectionElasticScattering(4, Te, NeutrinoType.electronAntineutrino)),
      x: bins.filter(Te => Te < TEMax(4)),
      name: "ν̅<sub>e</sub> 4 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: bins.filter(Te => Te < TEMax(1)).map((Te) => differentialCrossSectionElasticScattering(1, Te, NeutrinoType.electronAntineutrino)),
      x: bins.filter(Te => Te < TEMax(1)),
      name: "ν̅<sub>e</sub> 1 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
    },
  ]
  const layout = {
    title: "eES Differential Cross Section- T<sub>e</sub>",
    yaxis: {
      title: { text: `d𝛔/dT<sub>e</sub> (cm<sup>2</sup>/MeV)` },
      type: 'log',
      autorange: true
    },
    xaxis: {
      title: { text: `T<sub>e</sub> (MeV)` },
    },
    autosize: true,
    legend: {
      x: 1,
      xanchor: "left",
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
      filename: 'ES-antinus-dsigma/dTe'
    }
  };
  return (
    <Card>
      <Card.Header>eES Differential Cross Section- T<sub>e</sub></Card.Header>
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

}

export const CDFdifferentialCrossSectionPlots = () => {
  const data = [
    {
      y: cumulativeFunc(bins.filter(Te => Te < TEMax(10)),differentialCrossSectionElasticScattering, 10,NeutrinoType.muTauAntineutrino),
      x: bins.filter(Te => Te < TEMax(10)),
      name: "ν̅<sub>x</sub> 10 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
      line: {dash: 'dash',},
    },
    {
      y: cumulativeFunc(bins.filter(Te => Te < TEMax(7)),differentialCrossSectionElasticScattering,7,NeutrinoType.muTauAntineutrino),
      x: bins.filter(Te => Te < TEMax(7)),
      name: "ν̅<sub>x</sub> 7 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
      line: {dash: 'dash',},
    },
    {
      y: cumulativeFunc(bins.filter(Te => Te < TEMax(4)), differentialCrossSectionElasticScattering,4, NeutrinoType.muTauAntineutrino),
      x: bins.filter(Te => Te < TEMax(4)),
      name: "ν̅<sub>x</sub> 4 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
      line: {dash: 'dash',},
    },
    {
      y: cumulativeFunc(bins.filter(Te => Te < TEMax(1)), differentialCrossSectionElasticScattering,1, NeutrinoType.muTauAntineutrino),
      x: bins.filter(Te => Te < TEMax(1)),
      name: "ν̅<sub>x</sub> 1 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
      line: {dash: 'dash',},
    },
    {
      y: cumulativeFunc(bins.filter(Te => Te < TEMax(10)), differentialCrossSectionElasticScattering, 10, NeutrinoType.electronAntineutrino),
      x: bins.filter(Te => Te < TEMax(10)),
      name: "ν̅<sub>e</sub> 10 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
    },
    {
      y: cumulativeFunc(bins.filter(Te => Te < TEMax(7)), differentialCrossSectionElasticScattering, 7, NeutrinoType.electronAntineutrino),
      x: bins.filter(Te => Te < TEMax(7)),
      name: "ν̅<sub>e</sub> 7 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: cumulativeFunc(bins.filter(Te => Te < TEMax(4)), differentialCrossSectionElasticScattering, 4, NeutrinoType.electronAntineutrino),
      x: bins.filter(Te => Te < TEMax(4)),
      name: "ν̅<sub>e</sub> 4 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: cumulativeFunc(bins.filter(Te => Te < TEMax(1)), differentialCrossSectionElasticScattering, 1, NeutrinoType.electronAntineutrino),
      x: bins.filter(Te => Te < TEMax(1)),
      name: "ν̅<sub>e</sub> 1 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
    },
  ]
  const layout = {
    title: "eES Cumulative Differential Cross Section- T<sub>e</sub>",
    yaxis: {
      title: { text: `P(T<sub>e</sub>≤t)` },
      autorange: true
    },
    xaxis: {
      title: { text: `T<sub>e</sub> (MeV)` },
    },
    autosize: true,
    legend: {
      x: 1,
      xanchor: "left",
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
      filename: 'CDF-ES-antinus-dsigma/dTe'
    }
  };
  return (
    <Card>
      <Card.Header>eES Cumulative Differential Cross Section- T<sub>e</sub></Card.Header>
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

}

export const CDFdifferentialCrossSectionPlotsNeutrinos = () => {
  const data = [
    {
      y: cumulativeFunc(bins.filter(Te => Te < TEMax(10)),differentialCrossSectionElasticScattering, 10,NeutrinoType.muTauNeutrino),
      x: bins.filter(Te => Te < TEMax(10)),
      name: "ν<sub>x</sub> 10 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
      line: {dash: 'dash',},
    },
    {
      y: cumulativeFunc(bins.filter(Te => Te < TEMax(7)),differentialCrossSectionElasticScattering,7,NeutrinoType.muTauNeutrino),
      x: bins.filter(Te => Te < TEMax(7)),
      name: "ν<sub>x</sub> 7 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
      line: {dash: 'dash',},
    },
    {
      y: cumulativeFunc(bins.filter(Te => Te < TEMax(4)), differentialCrossSectionElasticScattering,4, NeutrinoType.muTauNeutrino),
      x: bins.filter(Te => Te < TEMax(4)),
      name: "ν<sub>x</sub> 4 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
      line: {dash: 'dash',},
    },
    {
      y: cumulativeFunc(bins.filter(Te => Te < TEMax(1)), differentialCrossSectionElasticScattering,1, NeutrinoType.muTauNeutrino),
      x: bins.filter(Te => Te < TEMax(1)),
      name: "ν<sub>x</sub> 1 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
      line: {dash: 'dash',},
    },
    {
      y: cumulativeFunc(bins.filter(Te => Te < TEMax(10)), differentialCrossSectionElasticScattering, 10, NeutrinoType.electronNeutrino),
      x: bins.filter(Te => Te < TEMax(10)),
      name: "ν<sub>e</sub> 10 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
    },
    {
      y: cumulativeFunc(bins.filter(Te => Te < TEMax(7)), differentialCrossSectionElasticScattering, 7, NeutrinoType.electronNeutrino),
      x: bins.filter(Te => Te < TEMax(7)),
      name: "ν<sub>e</sub> 7 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: cumulativeFunc(bins.filter(Te => Te < TEMax(4)), differentialCrossSectionElasticScattering, 4, NeutrinoType.electronNeutrino),
      x: bins.filter(Te => Te < TEMax(4)),
      name: "ν<sub>e</sub> 4 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: cumulativeFunc(bins.filter(Te => Te < TEMax(1)), differentialCrossSectionElasticScattering, 1, NeutrinoType.electronNeutrino),
      x: bins.filter(Te => Te < TEMax(1)),
      name: "ν<sub>e</sub> 1 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
    },
  ]
  const layout = {
    title: "eES Cumulative Differential Cross Section- T<sub>e</sub>",
    yaxis: {
      title: { text: `P(T<sub>e</sub>≤t)` },
      autorange: true
    },
    xaxis: {
      title: { text: `T<sub>e</sub> (MeV)` },
    },
    autosize: true,
    legend: {
      x: 1,
      xanchor: "left",
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
      filename: 'CDF-ES-antinus-dsigma/dTe'
    }
  };
  return (
    <Card>
      <Card.Header>eES Cumulative Differential Cross Section- T<sub>e</sub></Card.Header>
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

}

export const CrossSectionPlots = () => {
  const {crossSection} = useContext(PhysicsContext)
  const data = [
    {
      y: bins.map(crossSection[XSNames.IBDVB1999]),
      x: bins,
      name: XSAbrev[XSNames.IBDVB1999],
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: bins.map(crossSection[XSNames.IBDSV2003]),
      x: bins,
      name: XSAbrev[XSNames.IBDSV2003],
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "black" },
    },
    {
      y: bins.map(crossSection[XSNames.ESANTI]),
      x: bins,
      name: XSAbrev[XSNames.ESANTI],
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "magenta" },
    },
    {
      y: bins.map(crossSection[XSNames.ESMUTAU]),
      x: bins,
      name: XSAbrev[XSNames.ESMUTAU],
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "chartreuse" },
    },
  ]
  var layout = {
    title: `Total Cross Sections- Antineutrinos<br /><sub>${"(eES " + crossSection.elasticScatteringTMin.toFixed(1) + " < T < " + crossSection.elasticScatteringTMax.toFixed(1) + " MeV)"}</sub>`,
    yaxis: {
      title: { text: `Total Cross Section (cm<sup>2</sup>)` },
      type: 'log',
      autorange: true
    },
    xaxis: {
      title: { text: `Antineutrino Energy (MeV)` },
    },
    autosize: true,
    legend: {
      x: 1,
      xanchor: "right",
      y: 0,
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
      filename: `Total-Cross-Sections-antinus_Tmin${crossSection.elasticScatteringTMin.toFixed(1)}_to_Tmax${crossSection.elasticScatteringTMax.toFixed(1)}`
    }
  };
  return (
    <Card>
      <Card.Header>Total Cross Sections- Antineutrinos</Card.Header>
      <Card.Body>
        <p>
          Two versions of the cross section for free proton inverse beta decay (pIBD- {" "}
          <Node inline>{String.raw`\overline{\nu}_\mathrm{e} + \mathrm{p} \rightarrow \mathrm{n} + \mathrm{e}^+`}</Node> {" "}) are available for selection. 
          Both versions are functions of the scattered positron energy and momentum,{" "}
          <Node
            inline
          >{String.raw`E_\mathrm{e}`}</Node>{" "} 
          and{" "}
          <Node inline>{String.raw`p_\mathrm{e}= \sqrt{E^2_\mathrm{e}-m^2_\mathrm{e}}`}</Node>,{" "}
          respectively, where{" "}
          <Node inline>{String.raw`m_\mathrm{e}`}</Node>{" "}
          is the electron (positron) rest mass.
          Assuming the antineutrino is massless, then the energy of the incident electron antineutrino{" "} 
          <Node inline>{String.raw`E_{\overline{\nu}_\mathrm{e}} = E_\mathrm{e}+E_\mathrm{thr}-m_\mathrm{e},`}</Node>{" "}
          where{" "}
          <Node inline>{String.raw`E_\mathrm{thr}`}</Node>{" "} 
          is the threshold energy.{" "}
        </p>
        <p>
          The default version of the pIBD cross section is from 
          A. Strumia and F. Vissani (2003), <i>Precise quasielastic neutrino/nucleon cross-section</i>, Phys. Lett. B 564, 42.
          The implemented parameterized equation, estimating the precise cross section, is
        <Node>{String.raw`
            \sigma^\mathrm{pIBD}(E_\mathrm{e}) = (10.0 \times10^{-44} \mathrm{cm}^2 \mathrm{MeV}^{-2} )p_\mathrm{e} E_\mathrm{e} E_{\overline{\nu}_\mathrm{e}}^{\alpha\mathstrut},`}</Node>{" "}
            with the exponent{" "}
            <Node inline>{String.raw`\alpha = -0.07056+0.02018\,\mathrm{ln}E_{\overline{\nu}_\mathrm{e}}-0.001953\,\mathrm{ln}^3E_{\overline{\nu}_\mathrm{e}}.`}</Node> 
        </p>
        <p>
          The optional version of the pIBD cross section is from 
          P. Vogel and J. F. Beacom (1999), <i>Angular distribution of inverse neutron decay, ν̅<sub>𝑒</sub> + 𝑝 ⭢ 𝑒<sup>+</sup> + 𝑛</i>, Phys. Rev. D 60, 053003.
          This version, which tends to over-predict the cross section at high energy, is
        <Node>{String.raw`
            \sigma^\mathrm{pIBD}(E_\mathrm{e}) = (9.52 \times10^{-44} \mathrm{cm}^2 \mathrm{MeV}^{-2} )p_\mathrm{e} E_\mathrm{e}.`}</Node>{" "}
        </p>
        <p>
          The neutrino-electon elastic scattering (eES) cross section is from
          M. Fukugita and T. Yanagida, <i>Physics of Neutrinos</i> (Springer-Verlag, Berlin Heidelberg, 2003). {" "}
        <Node>{String.raw`
          \begin{split}
          \sigma_{T_\mathrm{min} \le T \le T_\mathrm{max}}^\mathrm{eES}(E_{\nu}) = \frac{G_F^2m_\mathrm{e}E_\nu}{2\pi} \\
          \bigg[\Big(c_\mathrm{L}^2 y_{\mathrm{max}} + c_\mathrm{R}^2\frac{1}{3}\big(1-(1- y_{\mathrm{max}})^3\big) - c_\mathrm{L}c_\mathrm{R}\frac{m_\mathrm{e}}{2E_\nu}y_{\mathrm{max}}^2\Big) - \\
          \Big(c_\mathrm{L}^2 y_{\mathrm{min}} + c_\mathrm{R}^2\frac{1}{3}\big(1-(1- y_{\mathrm{min}})^3\big) - c_\mathrm{L}c_\mathrm{R}\frac{m_\mathrm{e}}{2E_\nu}y_{\mathrm{min}}^2\Big)\bigg],
          \end{split}
        `}</Node>{" "}
          where{" "}
          <Node inline>{String.raw`y_{\mathrm{max}}=T_\mathrm{max}/E_\nu,`}</Node>{" "} 
          <Node inline>{String.raw`y_\mathrm{min} = T_\mathrm{min}/E_\nu,`}</Node>{" "}
          and the coefficients{" "}
          <Node inline>{String.raw`c_\mathrm{L},`}</Node>{" "}
          <Node inline>{String.raw`c_\mathrm{R},`}</Node>{" "}
          are functions of the vector and axial vector coupling factors{" "}
          <Node inline>{String.raw`c_V`}</Node>{" "} 
          and{" "}
          <Node inline>{String.raw`c_A,`}</Node>{" "}
          respectively. Specifically,{" "}
          <Node inline>{String.raw`c_\mathrm{L} = c_V + c_A`}</Node>{" "}
          and{" "}
          <Node inline>{String.raw`c_\mathrm{R} = c_V - c_A.`}</Node>{" "}
        </p>
        <p>
          The eES cross section equation given above applies to any two-body elastic scattering process. 
          For neutrino-proton elastic scattering pES simply replace the electron rest mass{" "}
          <Node inline>{String.raw`m_\mathrm{e}`}</Node>{" "} 
          with the proton rest mass{" "}
          <Node inline>{String.raw`m_\mathrm{p}`}</Node>{" "} 
          to account for the heavier target and use the vector and axial vector coupling factors given for pES in the table below. 
          The pES reaction is an important detection channel for supernova burst neutrinos (see the SnNu tab).
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

export const SV03PercentDifference = () => {
  const data = [
    {
      x: [2.01, 2.25, 2.51, 2.80, 3.12, 3.48, 3.89, 4.33, 4.84, 5.40, 6.02, 6.72, 7.49, 8.36, 8.83, 9.85, 11.0, 12.3],
      y: [2.14, -.219, -.378, .030, .700, .786, .085, .781, .362, .167, .251, .148, .080, -.024, -.110, -.142, -.491, -1.43],
      name: ``,
      type: "scatter",
      mode: "markers",
      marker: { color: "black", size: 1},
    },
  ];
  var layout = {
    title: `Percent Difference SV03`,
    yaxis: {
      title: { text: `% diff` },
      autorange: true,
    },
    xaxis: {
      title: { text: `Antineutrino Energy (MeV)` },
      autorange: true,
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
      filename: 'SV03-pct-diff'
    }
  };
  return (
    <Card>
      <Card.Header>Percent Difference SV03</Card.Header>
      <Card.Body>
        <p>
          Plot shows the percent differences between the more precise formulation- see Table 3 in Strumia and Vissani (2003)- and its 
          parameterized estimate at selected antineutrino energies. This comparison reveals small spectral distortions in the energy 
          region relevant to reactor antineutrinos and geo-neutrinos.
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

export const CrossSectionPlotsNormal = () => {
  const {crossSection} = useContext(PhysicsContext)
  const data = [
    {
      y: bins.map(crossSection[XSNamesNormal.ESNORMAL]),
      x: bins,
      name: XSAbrev[XSNamesNormal.ESNORMAL],
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: bins.map(crossSection[XSNamesNormal.ESMUTAUNORM]),
      x: bins,
      name: XSAbrev[XSNamesNormal.ESMUTAUNORM],
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "black" },
    },
  ]
  var layout = {
    title: `Total Cross Sections- Neutrinos<br /><sub>${"(eES " + crossSection.elasticScatteringTMin.toFixed(1) + " < T < " + crossSection.elasticScatteringTMax.toFixed(1) + " MeV)"}</sub>`,
    yaxis: {
      title: { text: `Total Cross Section (cm<sup>2</sup>)` },
      type: 'log',
      autorange: true
    },
    xaxis: {
      title: { text: `Neutrino Energy (MeV)` },
    },
    autosize: true,
    legend: {
      x: 1,
      xanchor: "right",
      y: 0,
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
      filename: `Total-Cross-Sections-nus_Tmin${crossSection.elasticScatteringTMin.toFixed(1)}_to_Tmax${crossSection.elasticScatteringTMax.toFixed(1)}`
    }
  };
  return (
    <Card>
      <Card.Header>Total Cross Sections- Neutrinos</Card.Header>
      <Card.Body>
        <p>
          Neutrino-electron elastic scattering (eES) cross sections are from:
        <br />
          M. Fukugita and T. Yanagida, <i>Physics of Neutrinos</i> (Springer-Verlag, Berlin Heidelberg, 2003).
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
