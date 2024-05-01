import { Form, Card } from "react-bootstrap";

export const CelestialBodySwitcher = ({celestialBody, setCelestialBody}) => {
    const options = ["earth", "moon"];
    return (
    <Card>
      <Card.Body>
    <Form.Group controlId="celestialBodySwitcher">
      <Form.Label>Celestial Body</Form.Label>
      <Form.Control
        as="select"
        onChange={(event) => setCelestialBody(event.target.value)}
        value={celestialBody}
      >
        {options.map((name) => {
          return (
            <option key={name} value={name}>
              {name}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
    </Card.Body>
    </Card>
  )}