import React, { useContext } from "react";
import { Card, Form } from "react-bootstrap";

import {XSNames} from "../physics/neutrino-cross-section"
import { PhysicsContext } from "../state";

export const DetectorPhysicsPane = () => {
  const {crossSection, crossSectionDispatch} = useContext(PhysicsContext)


  const TMinRange = (
    <Form.Group controlId="tminsrange">
      <Form.Label>
        Scattered Charged Lepton T<sub>min</sub>:{" "}
        {crossSection.elasticScatteringTMin.toFixed(1)} MeV <small>(not yet active on pIBD)</small>
      </Form.Label>
      <Form.Control
        type="range"
        min={0}
        max={7}
        step={0.1}
        value={crossSection.elasticScatteringTMin}
        onChange={(event) =>{
          crossSectionDispatch({
            arg: "elasticScatteringTMin",
            value: parseFloat(event.target.value),
          });
        }}
      ></Form.Control>
    </Form.Group>
  );

  const TMaxRange = (
    <Form.Group controlId="tmaxsrange">
      <Form.Label>
        Scattered Charged Lepton T<sub>max</sub>:{" "}
        {crossSection.elasticScatteringTMax.toFixed(1)} MeV <small>(not yet active on pIBD)</small>
      </Form.Label>
      <Form.Control
        type="range"
        min={0}
        max={15.3}
        step={0.1}
        value={crossSection.elasticScatteringTMax}
        onChange={(event) =>{
          crossSectionDispatch({
            arg: "elasticScatteringTMax",
            value: parseFloat(event.target.value),
          });
        }}
      ></Form.Control>
    </Form.Group>
  );

  const CrossSectionInput = (
    <Form.Group controlId="neutrinoCrossSection">
      <Form.Label>Neutrino Cross Section</Form.Label>
      <Form.Control
        as="select"
        onChange={(event) => crossSectionDispatch({arg:"crossSection", value:event.target.value})}
        value={crossSection.crossSection}
      >
        {Object.values(XSNames).map((name) => {
          return (
            <option key={name} value={name}>
              {name}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );

  return (
    <Card>
      <Card.Body>
        {CrossSectionInput}
        {TMinRange}
        {TMaxRange}
      </Card.Body>
    </Card>
  );
};
