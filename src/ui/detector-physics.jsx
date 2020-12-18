import React, { useContext, useState } from "react";
import { Card, Form } from "react-bootstrap";

import { MassOrdering } from "../physics/neutrino-oscillation";
import {XSNames} from "../physics/neutrino-cross-section"
import { PhysicsContext } from "../state";

export const DetectorPhysicsPane = () => {
  const {oscillation, oscillationDispatch, crossSection, crossSectionDispatch} = useContext(PhysicsContext)

  const [tMin, setTmin] = useState(crossSection.elasticScatteringTMin)
  const [tMinValid, setTminValid] = useState(true)
  const [lastTmin, setLastTmin] = useState(crossSection.elasticScatteringTMin)
  if (crossSection.elasticScatteringTMin !== lastTmin){
    setTmin(crossSection.elasticScatteringTMin)
    setLastTmin(crossSection.elasticScatteringTMin)
  }

  const tMinHandler = (event) => {
    setTmin(event.target.value);
    const value = parseFloat(event.target.value);
    if (value === undefined) {
      setTminValid(false)
      return;
    }
    if (isNaN(value)) {
      setTminValid(false)
      return;
    }
    if (value < 0) {
      setTminValid(false)
      return;
    }
    if (value > 10) {
      setTminValid(false)
      return;
    }
    setLastTmin(value);
    crossSectionDispatch({
      arg: "elasticScatteringTMin",
      value: value,
    });
  };

  const TMinRage = (
    <Form.Group controlId="tminsrange">
      <Form.Label>
        Elastic Scattering T<sub>min</sub>:{" "}
        {crossSection.elasticScatteringTMin.toFixed(3)} MeV
      </Form.Label>
      <Form.Control
        type="number"
        min={0}
        max={10}
        step={0.001}
        isValid={tMinValid}
        value={tMin}
        onChange={tMinHandler}
        onBlur={() => {
          if (tMinValid) {
            return
          } else {
            setTmin(lastTmin)
          }
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
        {TMinRage}
      </Card.Body>
    </Card>
  );
};
