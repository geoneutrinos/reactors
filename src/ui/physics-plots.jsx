import React from 'react';

import { Card} from "react-bootstrap";
import Plot from "react-plotly.js";

import { XSFuncs, XSAbrev, XSNames } from '../physics/neutrino-cross-section';

// temp
import { crossSectionElectionNeutrinoES } from '../physics/neutrino-cross-section'
import { differentialCrossSectionElasticScattering, NeutrinoType } from '../physics/neutrino-cross-section'

const bins = (new Float64Array(1000)).map((v, i) => 0.005 + i/100)

export const DifferentialCrossSectionPlots = () => {
  const data = [
    {
      y: bins.map((Te) => differentialCrossSectionElasticScattering(10, Te, NeutrinoType.muTauAntineutrino)),
      x: bins,
      name: "NuXBar_10",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
      line: {dash: 'dash',},
    },
    {
      y: bins.filter(Te => Te < 7).map((Te) => differentialCrossSectionElasticScattering(7, Te, NeutrinoType.muTauAntineutrino)),
      x: bins.filter(Te => Te < 7),
      name: "NuXBar_7",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
      line: {dash: 'dash',},
    },
    {
      y: bins.filter(Te => Te < 4).map((Te) => differentialCrossSectionElasticScattering(4, Te, NeutrinoType.muTauAntineutrino)),
      x: bins.filter(Te => Te < 4),
      name: "NuXBar_4",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
      line: {dash: 'dash',},
    },
    {
      y: bins.filter(Te => Te < 1).map((Te) => differentialCrossSectionElasticScattering(1, Te, NeutrinoType.muTauAntineutrino)),
      x: bins.filter(Te => Te < 1),
      name: "NuXBar_1",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
      line: {dash: 'dash',},
    },
    {
      y: bins.map((Te) => differentialCrossSectionElasticScattering(10, Te, NeutrinoType.electronAntineutino)),
      x: bins,
      name: "NueBar_10",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "orange" },
    },
    {
      y: bins.filter(Te => Te < 7).map((Te) => differentialCrossSectionElasticScattering(7, Te, NeutrinoType.electronAntineutino)),
      x: bins.filter(Te => Te < 7),
      name: "NueBar_7",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: bins.filter(Te => Te < 4).map((Te) => differentialCrossSectionElasticScattering(4, Te, NeutrinoType.electronAntineutino)),
      x: bins.filter(Te => Te < 4),
      name: "NueBar_4",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: bins.filter(Te => Te < 1).map((Te) => differentialCrossSectionElasticScattering(1, Te, NeutrinoType.electronAntineutino)),
      x: bins.filter(Te => Te < 1),
      name: "NueBar_1",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "green" },
    },
  ]
  const layout = {
    title: "Differential Cross Sections",
    yaxis: {
      title: { text: `Differential Cross Section` },
      type: 'log',
      autorange: true
    },
    xaxis: {
      title: { text: `Te (MeV)` },
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
