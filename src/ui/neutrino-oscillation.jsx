import React, { useContext } from "react";
import { Card, Form } from "react-bootstrap";

import { Node, Provider } from "@nteract/mathjax";

import { MassOrdering } from "../physics/neutrino-oscillation";
import { PhysicsContext } from "../state";

export const NeutrinoOscillationPane = () => {
  const {oscillation, oscillationDispatch} = useContext(PhysicsContext)

    const MassOrderingInput = (
    <Form.Group controlId="neutrinoMassOrder">
      <Form.Label>Neutrino Mass Ordering- Normal or Inverted (NO or IO)</Form.Label>
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
      <Card.Header>Neutrino Oscillations</Card.Header>
      <Card.Body>
        <Provider>
          {MassOrderingInput}
          <div>
            <p> Neutrino oscillations... blah blah blah.
              <Node>{String.raw`N_{\sigma} = \frac{ s * \xi }{\sqrt{(s + b) * \xi + (\delta b * \xi )^2}},`}</Node>{" "}
            </p>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};
