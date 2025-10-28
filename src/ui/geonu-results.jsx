import React, {useContext, memo} from 'react';

import { Card } from "react-bootstrap";
import { MathJax } from "better-react-mathjax";
import Plot from "react-plotly.js";

export const GeoneutrinoResults = memo(() => {
  const data = [
    {
      name: ``,
      type: "scatter",
      mode: "markers",
      x: [0.2, 1.29, 6.39],
      y: [73, 47.0, 28.6],
      marker: {
        symbol: ["square", "cross", "circle"],
        color: ["red", "green", "blue"],
        size: 6
      },
      error_y: {
        type: "data",
        symmetric: false,
        array: [45.0, 8.6, 5.1],
        arrayminus: [45.0, 8.1, 4.8],
        color: ["red", "green", "blue"]
      },
      error_x: {
        type: "data",
        array: [0.2, 0.05, 0.14],
        color: ["red", "green", "blue"]
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
          Plot shows the results of geo-neutrino observations as of 2025.
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
