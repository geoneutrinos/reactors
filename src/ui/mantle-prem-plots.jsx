import {rho} from "../mantle/PREM";
import { Card } from "react-bootstrap";
import Plot from "react-plotly.js";

export const binWidth = 6371 / 1000;
const offset = binWidth * 0.5
const bins = new Float64Array(1000).map((_, i) => 0 + offset + binWidth * i)
console.log(bins)

export const MantleDensityPlot = () => {
    const data = [
      {
        y: bins.map(bin => rho(bin)),
        x: bins,
        name: "Density",
        type: "scatter",
        mode: "lines",
        fill: "none",
        marker: { color: "orange" },
      },
    ]
    const layout = {
      title: "Mantle Density",
      yaxis: {
        title: { text: `Density (g/cm^2)` },
        autorange: true
      },
      xaxis: {
        title: { text: `Depth` },
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
        filename: 'mantle_desity'
      }
    };
    return (
      <Card>
        <Card.Header>Mantle Density</Card.Header>
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