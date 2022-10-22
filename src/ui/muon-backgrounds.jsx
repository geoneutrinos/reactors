import React from "react";
import { Card } from "react-bootstrap";

import Plot from "react-plotly.js";
import { Provider } from "@nteract/mathjax";

import { 
  depthValues,
  muonSlantIntensity,
  muonFlatIntensity,
  neutronFlatIntensity,
} from "../muons";

const MuonsPane = () => {
  return (
    <Card>
      <Card.Header>Muon-Induced Backgrounds</Card.Header>
      <Card.Body>
        <Provider>
          <div>
            <p>
              This page is under development. It displays parameterized fits of the muon-induced backgrounds that depend on the overburden of 
              the detector site, following equations given in D.-M. Mei and A. Hime (2006), <i>Muon-induced background study for underground 
              laboratories</i>, Phys. Rev. D 73, 053004. The plot below has three curves, showing the differential muon intensity corresonding 
              to slant depth (Eq. 1), the differential muon intensity corresponding to a falt overburden (Eq. 4), and the neutron flux emerging 
              from the rock into the underground cavern as a function of the depth relative to a flat overburden (Eq. 13). 
            </p>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};

const MuonBackgroundPlot = () => {
  const data = [
    {
      y: muonSlantIntensity,
      x: depthValues,
      name: "μ slant (cm<sup>-2</sup>s<sup>-1</sup>sr<sup>-1</sup>)",
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "black" },
    },
    {
      y: muonFlatIntensity,
      x: depthValues,
      name: "μ flat (cm<sup>-2</sup>s<sup>-1</sup>)",
      type: "scatter",
      mode: "lines",
      line: {
        width: 2,
      },
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: neutronFlatIntensity,
      x: depthValues,
      name: "n flat (cm<sup>-2</sup>s<sup>-1</sup>)",
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
    title: "Background Fluxes",
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
      filename: 'Muon-induced-fluxes',
    },
  };
  return (
    <Card>
      <Card.Header>Background Fluxes</Card.Header>
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

export const Muons = () => {
  return (
    <div>
      <MuonsPane />
      <MuonBackgroundPlot />
    </div>
  );
}
