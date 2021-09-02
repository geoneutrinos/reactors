import React, { useState, useEffect } from "react";

import {
  Modal,
  Button,
  Table,
  Form,
  Col,
  Row,
  InputGroup,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { ReactorCore, FISSION_FRACTIONS } from "../reactor-cores";
import { Isotopes } from "../physics/constants";

export const AddCustomCoreModal = ({
  lat,
  lon,
  show,
  customCores,
  setCustomCores,
  close,
}) => {
  let defaultName;
  let c = 1;
  do {
    defaultName = defaultName = `Custom Core ${c}`;
    c += 1;
  } while (defaultName in customCores);

  const suggestions = [
    { name: "ATR", lat: 43.586, lon: -112.965, power: 250, elevation: 1520 },
    { name: "HFIR", lat: 35.918, lon: -84.304, power: 85, elevation: 267 },
    { name: "IR-40", lat: 34.373, lon: 49.241, power: 40, elevation: 1750 },
    { name: "Yongbyon", lat: 39.800, lon: 125.754, power: 15, elevation: 140 },
    { name: "Geo Reactor", lat: 0, lon: 0, power: 1e6, elevation: -6378137 },
  ];

  const [name, setName] = useState(defaultName);

  const [power, setPower] = useState(1000);
  const [elevation, setElevation] = useState(0);

  const [coreLat, setCoreLat] = useState(lat);
  const [coreLon, setCoreLon] = useState(lon);

  const [fissionFractions, setFissionFractions] = useState({
    [Isotopes.U235]: 1,
    [Isotopes.U238]: 0,
    [Isotopes.PU239]: 0,
    [Isotopes.PU241]: 0,
  });

  useEffect(() => setCoreLat(lat === undefined ? 0 : lat), [lat]);
  useEffect(() => setCoreLon(lon === undefined ? 0 : lon), [lon]);
  useEffect(() => setName(defaultName), [defaultName]);

  const isValid = [power, elevation, coreLat, coreLon].every(
    (value) => !isNaN(parseFloat(value))
  );

  const save = () => {
    const newCore = ReactorCore({
      name: name,
      lat: parseFloat(coreLat),
      lon: parseFloat(coreLon),
      power: parseFloat(power),
      elevation: parseFloat(elevation),
      custom: true,
      powerFractions: {
        U235: fissionFractions[Isotopes.U235],
        U238: fissionFractions[Isotopes.U238],
        PU239: fissionFractions[Isotopes.PU239],
        PU241: fissionFractions[Isotopes.PU241],
      },
    });
    setCustomCores({ ...customCores, [newCore.name]: newCore });
    setName(defaultName);
    close();
  };

  const selectPreset = (preset) => {
    setName(preset.name);
    setCoreLon(preset.lon);
    setCoreLat(preset.lat);
    setPower(preset.power);
    setElevation(preset.elevation);
  };
  const SuggestItems = suggestions.map((suggestion) => (
    <Dropdown.Item
      key={suggestion.name}
      onClick={() => selectPreset(suggestion)}
    >
      {suggestion.name}
    </Dropdown.Item>
  ));

  const fissionFractionsInputs = Object.keys(Isotopes).map((isotope) => {
    return (
      <Form.Group key={isotope} controlId={isotope}>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>{isotope}</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            isInvalid={isNaN(parseFloat(power))}
            type="number"
            onChange={(e) =>
              setFissionFractions({
                ...fissionFractions,
                [Isotopes[isotope]]: e.target.value,
              })
            }
            value={fissionFractions[Isotopes[isotope]]}
            step={0.01}
            min={0}
            max={1}
          />
          <Form.Control.Feedback type="invalid">
            Must be a number
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
    );
  });

  const selectFissionFraction = (coreType) => {
    const fissionFraction = FISSION_FRACTIONS[coreType];
    setFissionFractions(fissionFraction);
  };
  const fissionSuggestItems = Object.keys(FISSION_FRACTIONS).map((coreType) => (
    <Dropdown.Item
      key={coreType}
      onClick={() => selectFissionFraction(coreType)}
    >
      {coreType}
    </Dropdown.Item>
  ));

  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Add Custom Core</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group as={Row} controlId="presets">
          <Form.Label column sm="3"></Form.Label>
          <Col sm="9">
            <DropdownButton
              id="customCorePreset"
              title="Core Location Suggestions"
            >
              {SuggestItems}
            </DropdownButton>
          </Col>
        </Form.Group>
        <Form>
          <Form.Group as={Row} controlId="customCoreName">
            <Form.Label column sm="3">
              Core Name
            </Form.Label>
            <Col sm="9">
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="customCoreLat">
            <Form.Label column sm="3">
              Latitude
            </Form.Label>
            <Col sm="9">
              <InputGroup>
                <Form.Control
                  isInvalid={isNaN(parseFloat(coreLat))}
                  onChange={(e) => setCoreLat(e.target.value)}
                  type="number"
                  value={coreLat}
                />
                <InputGroup.Append>
                  <InputGroup.Text>deg N</InputGroup.Text>
                </InputGroup.Append>
                <Form.Control.Feedback type="invalid">
                  Must be a number
                </Form.Control.Feedback>
              </InputGroup>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="customCoreLon">
            <Form.Label column sm="3">
              Longitude
            </Form.Label>
            <Col sm="9">
              <InputGroup>
                <Form.Control
                  isInvalid={isNaN(parseFloat(coreLon))}
                  onChange={(e) => setCoreLon(e.target.value)}
                  type="number"
                  value={coreLon}
                />
                <InputGroup.Append>
                  <InputGroup.Text>deg E</InputGroup.Text>
                </InputGroup.Append>
                <Form.Control.Feedback type="invalid">
                  Must be a number
                </Form.Control.Feedback>
              </InputGroup>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="customCoreElevation">
            <Form.Label column sm="3">
              Elevation
            </Form.Label>
            <Col sm="9">
              <InputGroup>
                <Form.Control
                  isInvalid={isNaN(parseFloat(elevation))}
                  onChange={(e) => setElevation(e.target.value)}
                  type="number"
                  value={elevation}
                />
                <InputGroup.Append>
                  <InputGroup.Text>meters</InputGroup.Text>
                </InputGroup.Append>
                <Form.Control.Feedback type="invalid">
                  Must be a number
                </Form.Control.Feedback>
              </InputGroup>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="customCorePower">
            <Form.Label column sm="3">
              Core Power
            </Form.Label>
            <Col sm="9">
              <InputGroup>
                <Form.Control
                  isInvalid={isNaN(parseFloat(power))}
                  type="number"
                  onChange={(e) => setPower(e.target.value)}
                  value={power}
                />
                <InputGroup.Append>
                  <InputGroup.Text>MW</InputGroup.Text>
                </InputGroup.Append>
                <Form.Control.Feedback type="invalid">
                  Must be a number
                </Form.Control.Feedback>
              </InputGroup>
            </Col>
          </Form.Group>
          <hr />
          <h6>Fission Fractions</h6>These should all sum to 1 (currently{" "}
          {Object.values(fissionFractions)
            .map((v) => parseFloat(v))
            .reduce((a, b) => a + b, 0)}
          )
          <Form.Group as={Row} controlId="fissionPresets">
            <Col sm="9">
              <DropdownButton
                id="fissionPresets"
                title="Fission Fraction Suggestions"
              >
                {fissionSuggestItems}
              </DropdownButton>
            </Col>
          </Form.Group>
          {fissionFractionsInputs}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
        <Button disabled={!isValid} variant="primary" onClick={save}>
          Add Core
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ManageCustomCoreItem = ({ core, delCore }) => {
  return (
    <tr>
      <td>
        <Button variant="danger" onClick={delCore}>
          Delete Core
        </Button>
      </td>
      <td>{core.name}</td>
      <td>{core.lat.toFixed(4)}</td>
      <td>{core.lon.toFixed(4)}</td>
      <td>{core.elevation}</td>
      <td>{core.power}</td>
    </tr>
  );
};

export const ManageCustomCoreModal = ({
  show,
  customCores,
  setCustomCores,
  close,
}) => {
  const coreNmaes = Object.keys(customCores);

  const CoreList = coreNmaes.map((core) => (
    <ManageCustomCoreItem
      key={core}
      core={customCores[core]}
      delCore={() => {
        let nc = { ...customCores };
        delete nc[core];
        setCustomCores(nc);
      }}
    />
  ));
  return (
    <Modal size="lg" show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Custom Cores</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table responsive>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Lat (deg N)</th>
              <th>Lon (deg E)</th>
              <th>Elevation (m)</th>
              <th>Power (MW)</th>
            </tr>
          </thead>
          <tbody>{coreNmaes.length > 0 && CoreList}</tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
