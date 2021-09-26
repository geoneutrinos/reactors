import React, {useContext} from 'react';

import { Card} from "react-bootstrap";
import Plot from "react-plotly.js";

import { XSAbrev, XSNames } from '../physics/neutrino-cross-section';
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
    title: "ES Differential Cross Section- T<sub>e</sub>",
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
      filename: 'ES-dsigma-Neutrinos/dTe'
    }
  };
  return (
    <Card>
      <Card.Header>ES Differential Cross Section- T<sub>e</sub></Card.Header>
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
      y: cosTbins.map((cosT) => differentialCrossSectionElasticScatteringAngular(10, cosT, NeutrinoType.electronAntineutino)),
      x: cosTbins,
      name: "ν̅<sub>e</sub> 10 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
    },
    {
      y: cosTbins.map((cosT) => differentialCrossSectionElasticScatteringAngular(7, cosT, NeutrinoType.electronAntineutino)),
      x: cosTbins,
      name: "ν̅<sub>e</sub> 7 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: cosTbins.map((cosT) => differentialCrossSectionElasticScatteringAngular(4, cosT, NeutrinoType.electronAntineutino)),
      x: cosTbins,
      name: "ν̅<sub>e</sub> 4 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: cosTbins.map((cosT) => differentialCrossSectionElasticScatteringAngular(1, cosT, NeutrinoType.electronAntineutino)),
      x: cosTbins,
      name: "ν̅<sub>e</sub> 1 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
    },
  ]
  const layout = {
    title: "ES Differential Cross Section- cosθ",
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
      filename: 'ES-dsigma/dcos(theta)'
    }
  };
  return (
    <Card>
      <Card.Header>ES Differential Cross Section- cosθ</Card.Header>
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
      y: cumulativeFunc(cosTbins, differentialCrossSectionElasticScatteringAngular, 10, NeutrinoType.electronAntineutino),
      x: cosTbins,
      name: "ν̅<sub>e</sub> 10 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
    },
    {
      y: cumulativeFunc(cosTbins, differentialCrossSectionElasticScatteringAngular, 7, NeutrinoType.electronAntineutino),
      x: cosTbins,
      name: "ν̅<sub>e</sub> 7 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: cumulativeFunc(cosTbins, differentialCrossSectionElasticScatteringAngular, 4, NeutrinoType.electronAntineutino),
      x: cosTbins,
      name: "ν̅<sub>e</sub> 4 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: cumulativeFunc(cosTbins, differentialCrossSectionElasticScatteringAngular, 1, NeutrinoType.electronAntineutino),
      x: cosTbins,
      name: "ν̅<sub>e</sub> 1 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
    },
  ]
  const layout = {
    title: "ES Cumulative Differential Cross Section- cosθ",
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
      filename: 'CDF-ES-dsigma/dcos(theta)'
    }
  };
  return (
    <Card>
      <Card.Header>ES Cumulative Differential Cross Section- cosθ</Card.Header>
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
      y: bins.filter(Te => Te < TEMax(10)).map((Te) => differentialCrossSectionElasticScattering(10, Te, NeutrinoType.electronAntineutino)),
      x: bins.filter(Te => Te < TEMax(10)),
      name: "ν̅<sub>e</sub> 10 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
    },
    {
      y: bins.filter(Te => Te < TEMax(7)).map((Te) => differentialCrossSectionElasticScattering(7, Te, NeutrinoType.electronAntineutino)),
      x: bins.filter(Te => Te < TEMax(7)),
      name: "ν̅<sub>e</sub> 7 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: bins.filter(Te => Te < TEMax(4)).map((Te) => differentialCrossSectionElasticScattering(4, Te, NeutrinoType.electronAntineutino)),
      x: bins.filter(Te => Te < TEMax(4)),
      name: "ν̅<sub>e</sub> 4 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: bins.filter(Te => Te < TEMax(1)).map((Te) => differentialCrossSectionElasticScattering(1, Te, NeutrinoType.electronAntineutino)),
      x: bins.filter(Te => Te < TEMax(1)),
      name: "ν̅<sub>e</sub> 1 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
    },
  ]
  const layout = {
    title: "ES Differential Cross Section- T<sub>e</sub>",
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
      filename: 'ES-dsigma/dTe'
    }
  };
  return (
    <Card>
      <Card.Header>ES Differential Cross Section- T<sub>e</sub></Card.Header>
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
      y: cumulativeFunc(bins.filter(Te => Te < TEMax(10)), differentialCrossSectionElasticScattering, 10, NeutrinoType.electronAntineutino),
      x: bins.filter(Te => Te < TEMax(10)),
      name: "ν̅<sub>e</sub> 10 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
    },
    {
      y: cumulativeFunc(bins.filter(Te => Te < TEMax(7)), differentialCrossSectionElasticScattering, 7, NeutrinoType.electronAntineutino),
      x: bins.filter(Te => Te < TEMax(7)),
      name: "ν̅<sub>e</sub> 7 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: cumulativeFunc(bins.filter(Te => Te < TEMax(4)), differentialCrossSectionElasticScattering, 4, NeutrinoType.electronAntineutino),
      x: bins.filter(Te => Te < TEMax(4)),
      name: "ν̅<sub>e</sub> 4 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: cumulativeFunc(bins.filter(Te => Te < TEMax(1)), differentialCrossSectionElasticScattering, 1, NeutrinoType.electronAntineutino),
      x: bins.filter(Te => Te < TEMax(1)),
      name: "ν̅<sub>e</sub> 1 MeV",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
    },
  ]
  const layout = {
    title: "ES Cumulative Differential Cross Section- T<sub>e</sub>",
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
      filename: 'CDF-ES-dsigma/dTe'
    }
  };
  return (
    <Card>
      <Card.Header>ES Cumulative Differential Cross Section- T<sub>e</sub></Card.Header>
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
      y: bins.map(crossSection[XSNames.ESTOTAL]),
      x: bins,
      name: "ESnue",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
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
    title: "Total Cross Sections",
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
      filename: 'Total-Cross-Sections'
    }
  };
  return (
    <Card>
      <Card.Header>Total Cross Sections</Card.Header>
      <Card.Body>
        <p>
          Inverse beta decay (IBD) cross sections are from:
        <br />
          P. Vogel and J. F. Beacom, "Angular distribution of inverse neutron decay, <i>ν̅<sub>𝑒</sub></i> + <i>𝑝</i> ⭢ <i>𝑒</i><sup>+</sup> + <i>𝑛</i>," Phys. Rev. D 60, 053003 (1999).
        <br />
          A. Strumia and F. Vissani, "Precise quasielastic neutrino/nucleon cross-section," Phys. Lett. B 564, 42 (2003).
        </p>
        <p>
          Elastic scattering (ES) cross sections are from:
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
