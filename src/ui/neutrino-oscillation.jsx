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
            <p> The probability that an electron neutrino or an electron antineutrino, assuming CPT invariance, of energy {" "} 
              <Node inline>{String.raw`E_{{\nu}_\mathrm{e}}`}</Node> in MeV changes flavor after traveling a distance {" "}
              <Node inline>{String.raw`L`}</Node> in meters is
              <Node>{String.raw`P_{\mathrm{e}x}(L,E_{{\nu}_\mathrm{e}})=\cos^4\theta_{13}\sin^22\theta_{12}\sin^2(1.27\delta m^2_{21}L/E_{{\nu}_\mathrm{e}})`}</Node>{" "}
            </p>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};
