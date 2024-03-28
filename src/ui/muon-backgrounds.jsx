import { useState } from "react";
import { Card, Form, InputGroup,Table } from "react-bootstrap";

import Plot from "react-plotly.js";

import { 
  depthValues,
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
      <Card.Header>Muon and Neutron Flux Calculator</Card.Header>
      <Card.Body>
        <Form.Group controlId="muon_overburden">
          <InputGroup hasValidation>
            <InputGroup.Prepend>
              <InputGroup.Text>
              Equivalent Flat Overburden
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
              <InputGroup.Text>km.w.e.</InputGroup.Text>
            </InputGroup.Append>
          <Form.Control.Feedback type="invalid">
            Functions valid between 1.5 and 8 km.w.e.
          </Form.Control.Feedback>
          </InputGroup>
          {}
          <Table>
            <thead>
              <tr>
                <th>Muon Flux (m<sup>-2</sup>s<sup>-1</sup>)</th>
                <th>Neutron Flux (m<sup>-2</sup>s<sup>-1</sup>)</th>
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
      <Card.Header>Cosmic Ray Muons</Card.Header>
      <Card.Body>
          <div>
            <p>
              Parameterized depth spectra of the total cosmic-ray muon flux and the associated
              neutron flux are presented following equations given in D.-M. Mei and A. Hime (2006),  
              <i> Muon-induced background study for underground laboratories</i>, Phys. Rev. D 73, 
              053004. The calculator and the plot below give the total muon flux (Eq. 4) and 
              the neutron flux emerging from the rock into the underground cavern (Eq. 13) as 
              a function of the equivalent flat overburden. 
            </p>
          </div>
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
    title: "Muon and Neutron Fluxes",
    yaxis: {
      title: { text: `Flux (m<sup>-2</sup>s<sup>-1</sup>)` },
      type: "log",
      autorange: true,
    },
    xaxis: {
      title: { text: `Equivalent Flat Overburden (km.w.e.)` },
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
      <Card.Header>Muon and Neutron Fluxes</Card.Header>
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
      <BackgroundFluxes />
    </div>
  );
}
