import {rho} from "../mantle/PREM";
import { Card } from "react-bootstrap";
import Plot from "react-plotly.js";

const layers = 63710;
const maxRadius = 6371;
export const binWidth = maxRadius / layers;
const offset = binWidth * 0.5
const bins = new Float64Array(layers).map((_, i) => 0 + offset + binWidth * i)
const volumes = new Float64Array(layers).map((_, i) => 4/3 * math.pi * i)

export const GeoDensityPlot = () => {
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
      title: "PREM Density",
      yaxis: {
        title: { text: `Density (g/cm<sup>3</sup>)` },
        autorange: true
      },
      xaxis: {
        title: { text: `Radius (km)` },
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
        filename: 'PREM_density'
      }
    };
    return (
      <Card>
        <Card.Header>PREM Density</Card.Header>
        <Card.Body>
          <Plot
            useResizeHandler={true}
            style={{ width: "100%" }}
            data={data} 
            layout={layout}
            config={config}
          />
          <p>This is work in progress with the goal of calculating both the mass and geophysical response of each PREM layer.</p>
        </Card.Body>
      </Card>
    );
  }

export const GeoMassPlot = () => {
    const data = [
      {
        y: volumes,
        x: bins,
        name: "Mass",
        type: "scatter",
        mode: "lines",
        fill: "none",
        marker: { color: "orange" },
      },
    ]
    const layout = {
      title: "PREM Mass",
      yaxis: {
        title: { text: `Mass (g)` },
        autorange: true
      },
      xaxis: {
        title: { text: `Radius (km)` },
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
        filename: 'PREM_mass'
      }
    };
    return (
      <Card>
        <Card.Header>PREM Mass</Card.Header>
        <Card.Body>
          <Plot
            useResizeHandler={true}
            style={{ width: "100%" }}
            data={data} 
            layout={layout}
            config={config}
          />
          <p>This is work in progress with the goal of calculating both the mass and geophysical response of each PREM layer.</p>
        </Card.Body>
      </Card>
    );
  }
