import React, {useContext, memo} from 'react';

import { Card } from "react-bootstrap";
import { MathJax } from "better-react-mathjax";
import Plot from "react-plotly.js";

export const GeoneutrinoResults = memo(() => {
  const data= [
    {
      name: `SNO+`,
      type: "scatter",
      mode: "markers",
      x: [0.2],
      y: [73],
      marker: {
        symbol: ["x"],
        color: "red",
        size: 6
      },
      error_y: {
        type: "data",
        symmetric: false,
        array: [45.0],
        arrayminus: [45.0],
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
        symbol: ["x"],
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
        symbol: ["x"],
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
    title: `Geo-neutrino Results 2025`,
    yaxis: {
      title: { text: `Rate (TNU)` },
      rangemode: "tozero",
    },
    xaxis: {
      title: { text: `Exposure (1/TNU)` },
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
      filename: 'Geonu-results'
    }
  };
  return (
    <Card>
      <Card.Header>Geo-neutrino Results 2025</Card.Header>
      <Card.Body>
        <p>
          Plot shows the results of geo-neutrino observations as of 2025. Red marks the measurement by <a href="https://indico.global/event/14476/">SNO+</a> at SNOLAB, 
          green marks the measurement by <a href="https://doi.org/10.1103/PhysRevD.101.012009">Borexino</a> at Gran Sasso (LNGS), 
          and blue marks the measurement by <a href="https://doi.org/10.1029/2022GL099566">KamLAND</a> at Kamioka.
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
