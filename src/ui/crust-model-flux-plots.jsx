import React, {useContext, memo} from 'react';

import { Card } from "react-bootstrap";
import { MathJax } from "better-react-mathjax";
import Plot from "react-plotly.js";

export const CrustModelFluxes = memo(() => {
  const data= [
    {
      name: `SNO+`,
      type: "scatter",
      mode: "markers",
      x: [0.2],
      y: [73],
      marker: {
        symbol: ["circle"],
        color: "red",
        size: 6
      },
      error_y: {
        type: "data",
        symmetric: false,
        array: [47.0],
        arrayminus: [43.0],
        visible: true,
        color: "red"
      },
      error_x: {
        type: "data",
        array: [0.2],
        visible: true,
        color: "red"
     },
    },
    {
      name: `Borexino`,
      type: "scatter",
      mode: "markers",
      x: [1.29],
      y: [47.0],
      marker: {
        symbol: ["circle"],
        color: "green",
        size: 6
      },
      error_y: {
        type: "data",
        symmetric: false,
        array: [8.6],
        arrayminus: [8.1],
        visible: true,
        color: "green"
      },
      error_x: {
        type: "data",
        array: [0.05],
        visible: true,
        color: "green"
     },
    },
    {
      name: `KamLAND`,
      type: "scatter",
      mode: "markers",
      x: [6.39],
      y: [28.6],
      marker: {
        symbol: ["circle"],
        color: "blue",
        size: 6
      },
      error_y: {
        type: "data",
        symmetric: false,
        array: [5.1],
        arrayminus: [4.8],
        visible: true,
        color: "blue"
      },
      error_x: {
        type: "data",
        array: [0.14],
        visible: true,
        color: "blue"
     },
    },
  ];
  
  var layout = {
    title: `Crust Model Fluxes`,
    yaxis: {
      title: { text: `Latitude` },
      rangemode: "tozero",
    },
    xaxis: {
      title: { text: `Longitude` },
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
      filename: 'Crust-model-fluxes'
    }
  };
  return (
    <Card>
      <Card.Header>Crust Model Fluxes</Card.Header>
      <Card.Body>
        <p>
          Plot shows the model fluxes of unoscillated geo-neutrinos from the crust according to <a href="https://doi.org/10.1002/ggge.20129">Huang et al. (2013)</a>.
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
});
