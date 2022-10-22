import { Card } from "react-bootstrap";
import Plot from "react-plotly.js";

import { depthValues, calcFluxesAtDepth } from "../muons";

export const MuonBackgroundPlots = ({
  calcFluxesAtDepth
}) => {
  const data = [
    {
      y: calcFluxesAtDepth.muonSlantIntensity,
      x: depthValues,
      name: `μ slant (cm<sup>-2</sup>s<sup>-1</sup>sr<sup>-1</sup>)`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "black" },
    },
    {
      y: calcFluxesAtDepth.muonFlatIntensity,
      x: depthValues,
      name: `μ flat (cm<sup>-2</sup>s<sup>-1</sup>)`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: calcFluxesAtDepth.neutronFlatIntensity,
      x: depthValues,
      name: `n flat (cm<sup>-2</sup>s<sup>-1</sup>)`,
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "red" },
    },
  ];
  var layout = {
    title: `Background Fluxes',
    yaxis: {
      title: { text: `Flux` },
      type: "log",
      autorange: true,
    },
    xaxis: {
      title: { text: `Overburden depth (km.w.e.)` },
      range: [0.05, 10.05],
    },
    autosize: true,
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
      filename: "Muon-induced-fluxes",
    },
  };
  return (
    <Card>
      <Card.Header>Muon-induced-fluxes</Card.Header>
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
};
