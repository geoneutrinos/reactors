import React, { useState } from "react";
import { Card, Form, InputGroup } from "react-bootstrap";
import { groupBy } from "lodash";

import { presets } from "../detectors";

const presetGroups = groupBy(presets, (detector) => detector.region);
const presetOptions = Object.keys(presetGroups).map((key) => {
  const group = presetGroups[key];
  const options = group.map((detector) => (
    <option key={detector.name} value={detector.name}>
      {detector.name} ({detector.overburden} mwe)
    </option>
  ));
  return (
    <optgroup key={key} label={key}>
      {options}
    </optgroup>
  );
});

export const DetectorLocationPane = ({
  detector,
  setDetector,
}) => {
  const [internalDetector, setinternalDetector] = useState({
    lat: detector.lat,
    lon: detector.lon,
    elevation: detector.elevation,
  });

  const [prevDetector, setPrevDetector] = useState(null);
  if (prevDetector !== detector) {
    setPrevDetector(detector);
    setinternalDetector({
      lat: detector.lat,
      lon: detector.lon,
      elevation: detector.elevation,
    });
  }

  const checkAndSet = (key, value) => {
    setinternalDetector({ ...internalDetector, [key]: value });

    const parsed = parseFloat(value);

    if (key === "lat" && (parsed < -90 || parsed > 90)) {
      return;
    }
    if (key === "lon" && (parsed < -180 || parsed > 180)) {
      return;
    }
    if (key === "elevation" && (parsed < -12000 || parsed > 12000)) {
      return;
    }

    if (!isNaN(parsed) && parsed !== detector[key]) {
      setDetector({ ...detector, current:"custom", [key]: parsed });
    }
  };

  const setDetectorMode = (event) => {
    const value = event.currentTarget.value;
    let newDetector = { current: value };
    if (value !== 'custom' && value !== 'follow') {
      let preset = presets.find(detector => detector.name === value);
      newDetector.lat = preset.lat;
      newDetector.lon = preset.lon;
      newDetector.elevation = preset.elevation;
    }
    setDetector({ ...detector, ...newDetector })
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Detector Location</Card.Title>
        <Form.Group controlId="presetMode">
          <Form.Label>Detector Presets/Modes</Form.Label>
          <Form.Control
            as="select"
            onChange={setDetectorMode}
            value={detector.current}
          >
            <option value="follow">Follow Cursor on Map</option>
            <option value="custom">Custom Detector Location</option>
            {presetOptions}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="detectorLat">
          <Form.Label>Latitude</Form.Label>
          <InputGroup>
            <Form.Control
              value={internalDetector.lat}
              onChange={(event) => checkAndSet("lat", event.target.value)}
              type="number"
              placeholder="0"
              step="0.1"
            />
            <InputGroup.Append>
              <InputGroup.Text>deg N</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="detectorLon">
          <Form.Label>Longitude</Form.Label>
          <InputGroup>
            <Form.Control
              value={internalDetector.lon}
              onChange={(event) => checkAndSet("lon", event.target.value)}
              type="number"
              placeholder="0"
              step="0.1"
            />
            <InputGroup.Append>
              <InputGroup.Text>deg E</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="detectorElevation">
          <Form.Label>Elevation</Form.Label>
          <InputGroup>
            <Form.Control
              value={internalDetector.elevation}
              onChange={(event) => checkAndSet("elevation", event.target.value)}
              type="number"
              placeholder="0"
              step="1"
            />
            <InputGroup.Append>
              <InputGroup.Text>meters</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};
