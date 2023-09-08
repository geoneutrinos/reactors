import { useState } from "react";
import { Card, Form, InputGroup,Table } from "react-bootstrap";

import Plot from "react-plotly.js";
import { Provider } from "@nteract/mathjax";

import { 
  depthValues,
//  muonSlantIntensity,
  muonFlatIntensity,
  neutronFlatIntensity,
  neutronInducedFlux,
  flatOverburdenMuonIntensity,
} from "../muons";

import {
  Num
} from "."

const MuonFluxCalculator = () => {
  const [overburden, setOverburden] = useState("1.5") // km.w.e.

  const overburdenValue = parseFloat(overburden)
  const invalid = (overburdenValue > 8) || (overburdenValue < 1.5)
  return (
    <Card>
      <Card.Header>Muon Flux Calculator</Card.Header>
      <Card.Body>
        <Form.Group controlId="muon_overburden">
          <InputGroup hasValidation>
            <InputGroup.Prepend>
              <InputGroup.Text>
              Overburden
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              onChange={(e) => setOverburden(e.target.value)}
              type="number"
              step="0.1"
              min="1.5"
              max="8.0"
              value={overburden}
              isInvalid={invalid}
            />
            <InputGroup.Append>
              <InputGroup.Text>km w.e.</InputGroup.Text>
            </InputGroup.Append>
          <Form.Control.Feedback type="invalid">
            Function only defined between 1.5 and 8 km w.e.
          </Form.Control.Feedback>
          </InputGroup>
          {}
          <Table>
            <thead>
              <tr>
                <th>Muon Flux</th>
                <th>Neutron Flux</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Num
                    v={flatOverburdenMuonIntensity(overburdenValue)}
                    p={5}
                    formatFunc="toPrecision"
                  />
                </td>
                <td>
                  <Num
                    v={neutronInducedFlux(overburdenValue)}
                    p={5}
                    formatFunc="toPrecision"
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </Form.Group>
      </Card.Body>
    </Card>
  );
}

const MuonsPane = () => {
  return (
    <Card>
      <Card.Header>Muon-Induced Backgrounds</Card.Header>
      <Card.Body>
        <Provider>
          <div>
            <p>
              Parameterized depth spectra of the underground cosmic-ray muon flux and the associated neutron flux 
              are presented following equations given in D.-M. Mei and A. Hime (2006),  
              <i> Muon-induced background study for underground laboratories</i>, Phys. Rev. D 73, 053004. 
              The plot below shows the total muon intensity 
              (Eq. 4) and the neutron flux emerging from the rock into the underground cavern (Eq. 13), both as 
              a function of the depth corresponding to a flat overburden. 
            </p>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};

const BackgroundFluxes = () => {
  const data = [
    {
      y: muonFlatIntensity,
      x: depthValues,
      name: "μ flux",
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
      name: "n flux",
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
      title: { text: `Flux (cm<sup>-2</sup>s<sup>-1</sup>)` },
      type: "log",
      autorange: true,
    },
    xaxis: {
      title: { text: `Equivalent Vertical Depth (km.w.e.)` },
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
      filename: 'Flat-overburden-fluxes',
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
      <MuonFluxCalculator />
      <MuonDepthIntensity />
      <BackgroundFluxes />
    </div>
  );
}
