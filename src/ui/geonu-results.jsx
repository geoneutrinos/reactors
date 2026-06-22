import React, {useContext, memo} from 'react';

import { Card } from "react-bootstrap";
import { MathJax } from "better-react-mathjax";
import Plot from "react-plotly.js";

export const GeoneutrinoResults = memo(() => {
  const data= [
    {
      name: `JUNO`,
      type: "scatter",
      mode: "markers",
      x: [6.8],
      y: [73],
      marker: {
        symbol: ["circle"],
        color: "black",
        size: 6
      },
      error_y: {
        type: "data",
        array: [11.0],
        visible: true,
        color: "black"
      },
      error_x: {
        type: "data",
        array: [0.1],
        visible: true,
        color: "black"
     },
    },
    {
      name: `SNO+`,
      type: "scatter",
      mode: "markers",
      x: [0.877],
      y: [49],
      marker: {
        symbol: ["circle"],
        color: "red",
        size: 6
      },
      error_y: {
        type: "data",
        symmetric: false,
        array: [13.0],
        arrayminus: [12.0],
        visible: true,
        color: "red"
      },
      error_x: {
        type: "data",
        array: [0.1],
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
    title: `Geo-neutrino Results 2026`,
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
      <Card.Header>Geo-neutrino Results 2026</Card.Header>
      <Card.Body>
        <p>
          Plot shows the results of geo-neutrino observations as of 2026. Black marks the measurement by <a href="https://sites.uci.edu/neutrino2026/">JUNO</a> at Jiangmen, China. Red marks the measurement by <a href="https://arxiv.org/pdf/2604.05746">SNO+</a> at SNOLAB. 
          (The plotted exposures for JUNO and SNO+ are estimated from the reported livetimes, 207.2 and 685 days, respectively, assuming 20 kT and 780 tonnes of LS with 6x10<sup>28</sup> free-protons per tonne, repsectively,
          and assigning an arbitrary uncertainty of 0.1 TNU<sup>-1</sup>).
          Green marks the measurement by <a href="https://doi.org/10.1103/PhysRevD.101.012009">Borexino</a> at Gran Sasso (LNGS), 
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
