import React from "react";

import { Card, Form, InputGroup } from "react-bootstrap";

export const CrustFlux = ({ geoneutrino, updateSpectrum }) => {
    const changeHandler = (event) => {
        updateSpectrum({geoneutrino: {...geoneutrino, crustSignal: event.target.checked}})
    }
  return (
    <Card>
      <Card.Header>Crust Flux</Card.Header>
      <Card.Body>
        <Form.Check
          checked={geoneutrino.crustSignal}
          id="crustSignalSlider"
          type="switch"
          label="Include Crust Signal"
          onChange={changeHandler}
        />
        <small>We use a pre-computed model of the crust flux provided by W.F. McDonough and described in Y. Huang et al., 
        "A reference Earth model for the heat producing elements and associated geoneutrino flux," Geochem., Geophys., Geosyst. 14, 2003 (2013).</small>
      </Card.Body>
    </Card>
  );
}

export const MantleFlux = ({ geoneutrino }) => {
  return (
    <Card>
        <Card.Header>Mantle Flux Inputs</Card.Header>
      <Card.Body>
        <Form.Group controlId="u238flux">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text><sup>238</sup>U Mantle Flux</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              value={geoneutrino.U238flux}
              type="number"
              placeholder="0"
              step="0.1"
            />
            <InputGroup.Append>
              <InputGroup.Text>
                cm<sup>-2</sup>s<sup>-1</sup>
              </InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="thuratio">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Th/U Ratio</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              value={geoneutrino.ThURatio}
              type="number"
              placeholder="0"
              step="0.1"
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="kuratio">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>K/U Ratio</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              value={geoneutrino.KURatio}
              type="number"
              placeholder="0"
              step="0.1"
            />
          </InputGroup>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};
