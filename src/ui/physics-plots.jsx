import React from 'react';

import { Card} from "react-bootstrap";
import Plot from "react-plotly.js";

import { XSFuncs, XSAbrev, XSNames } from '../physics/neutrino-cross-section';

// temp
import { crossSectionElectionNeutrinoES } from '../physics/neutrino-cross-section'
import { differentialCrossSectionElasticScattering, NeutrinoType, TEMax } from '../physics/neutrino-cross-section'

const bins = (new Float64Array(1000)).map((v, i) => 0.005 + i/100)

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
    title: "Differential Cross Sections",
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
  };
  return (
    <Card>
      <Card.Header>Differential Cross Sections</Card.Header>
      <Card.Body>
        <Plot
          useResizeHandler={true}
          style={{ width: "100%" }}
          data={data} layout={layout}
        />
      </Card.Body>
    </Card>
  );

}

export const CrossSectionPlots = () => {
  const data = [
    {
      y: bins.map(XSFuncs[XSNames.IBDVB1999]),
      x: bins,
      name: XSAbrev[XSNames.IBDVB1999],
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: bins.map(XSFuncs[XSNames.IBDSV2003]),
      x: bins,
      name: XSAbrev[XSNames.IBDSV2003],
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "black" },
    },
    {
      y: bins.map(crossSectionElectionNeutrinoES),
      x: bins,
      name: "ESnue",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: bins.map(XSFuncs[XSNames.ESANTI]),
      x: bins,
      name: XSAbrev[XSNames.ESANTI],
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "magenta" },
    },
    {
      y: bins.map(XSFuncs[XSNames.ESMUTAU]),
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
  };
  return (
    <Card>
      <Card.Header>Total Cross Sections</Card.Header>
      <Card.Body>
        <p>
          Calculated inverse beta decay (IBD) cross sections are from:
        <br />
          P. Vogel and J. F. Beacom, "Angular distribution of inverse neutron decay, <i>ν̅<sub>𝑒</sub></i> + <i>𝑝</i> ⭢ <i>𝑒</i><sup>+</sup> + <i>𝑛</i>," Phys. Rev. D 60, 053003 (1999).
        <br />
          A. Strumia and F. Vissani, "Precise quasielastic neutrino/nucleon cross-section," Phys. Lett. B 564, 42 (2003).
        </p>
        <p>
          Calculated elastic scattering (ES) cross sections are from:
        <br />
          M. Fukugita and T. Yanagida, <i>Physics of Neutrinos</i> (Springer-Verlag, Berlin Heidelberg, 2003).
        </p>
        <Plot
          useResizeHandler={true}
          style={{ width: "100%" }}
          data={data} layout={layout}
        />
      </Card.Body>
    </Card>
  );
};
