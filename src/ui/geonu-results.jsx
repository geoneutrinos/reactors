import React, {useContext, memo} from 'react';

import { Card } from "react-bootstrap";
import { MathJax } from "better-react-mathjax";
import Plot from "react-plotly.js";

export const GeoneutrinoResults = memo(() => {
  const data = [
    {
      x: [0.2, 1.29, 6.39],
      y: [73, 47.0, 28.6],
      name: ``,
      type: "scatter",
      mode: "markers",
      marker: { 
        color: "red", 
        size: 6,
        line: {
          color: "black",
          width: 2,
          }
      },
    },
  ];
  var layout = {
    title: `Geo-neutrino Results 2025`,
    yaxis: {
      title: { text: `Rate (TNU)` },
      autorange: true,
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
