import React from 'react';

import { Card} from "react-bootstrap";
import Plot from "react-plotly.js";

import { XSFuncs, XSAbrev, XSNames } from '../physics/neutrino-cross-section';

// temp
import { crossSectionElectionNeutrinoES } from '../physics/neutrino-cross-section'


export const CrossSectionPlots = () => {
  const bins = (new Float64Array(1000)).map((v, i) => 0.005 + i/100)
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
    title: "Placeholder Plot Title",
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
      <Card.Header>Placeholder Card Header</Card.Header>
      <Card.Body>
        <p>Description text goes here</p>
          <Plot 
          useResizeHandler={true}
            style={{ width: "100%" }}
          data={data} layout={layout}/>
      </Card.Body>
    </Card>
  );
};