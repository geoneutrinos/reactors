import React, {useContext} from "react";
import { Form, Card } from "react-bootstrap";

import { PhysicsContext } from "../state";

import { RANames } from "../physics/reactor-antineutrinos";

export const RASwitcher = () => {
  const {reactorAntineutrinoModel, reactorAntineutrinoModelDispatch} = useContext(PhysicsContext)

  const RASelector = (
    <Form.Group controlId="reactorCrossSectionSwitcher">
      <Form.Label>Reactor Antineutrino Model</Form.Label>
      <Form.Control
        as="select"
        onChange={(event) => reactorAntineutrinoModelDispatch({arg:"model", value:event.target.value})}
        value={reactorAntineutrinoModel.modelName}
      >
        {Object.values(RANames).map((name) => {
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
        {RASelector}
      </Card.Body>
    </Card>
  );
};