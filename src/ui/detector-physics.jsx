import React from "react";
import { Card, Form } from "react-bootstrap";

import { MassOrdering } from '../physics/neutrino-oscillation'

export const DetectorPhysicsPane = ({
  massOrdering,
  crossSection,
  setMassOrdering,
  setCrossSection,
  XSNames,
}) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Physics</Card.Title>
        <Form.Group controlId="neutrinoMassOrder">
          <Form.Label>Neutrino Mass Ordering</Form.Label>
          <Form.Control
            as="select"
            onChange={(event) => setMassOrdering(event.target.value)}
            value={massOrdering}
          >
            {Object.values(MassOrdering).map( order => <option key={order} value={order}>{order}</option>)}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="neutrinoCrossSection">
          <Form.Label>Neutrino Cross Section</Form.Label>
          <Form.Control
            as="select"
            onChange={(event) => setCrossSection(event.target.value)}
            value={crossSection}
          >
            {Object.values(XSNames).map( name => {
            return <option key={name} value={name}>{name}</option>
            })}
          </Form.Control>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};
