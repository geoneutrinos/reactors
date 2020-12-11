import React, { useContext } from "react";
import { Card, Form } from "react-bootstrap";

import { MassOrdering } from "../physics/neutrino-oscillation";
import {XSNames} from "../physics/neutrino-cross-section"
import { PhysicsContext } from "../state";

export const DetectorPhysicsPane = () => {
  const {oscillation, oscillationDispatch, crossSection, crossSectionDispatch} = useContext(PhysicsContext)


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

  const MassOrderingInput = (
    <Form.Group controlId="neutrinoMassOrder">
      <Form.Label>Neutrino Mass Ordering</Form.Label>
      <Form.Control
        as="select"
        onChange={(event) => oscillationDispatch({arg:"massOrdering", value:event.target.value})}
        value={oscillation.massOrdering}
      >
        {Object.values(MassOrdering).map((order) => (
          <option key={order} value={order}>
            {order}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );

  return (
    <Card>
      <Card.Body>
        {CrossSectionInput}
        {MassOrderingInput}
      </Card.Body>
    </Card>
  );
};
