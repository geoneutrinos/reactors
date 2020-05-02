import React, { useState } from "react";
import {
  Card,
  Form,
  ListGroup,
  Button,
  ButtonGroup,
  Dropdown,
  Row,
  Col,
} from "react-bootstrap";
import { ReactorCore } from "../reactor-cores";

const CoreType = ({ core }) => {
  const coreDef = {
    LEU: "low enriched uranium reactor",
    PWR: "pressurized water reactor",
    BWR: "boiling water reactor",
    LWGR: "light water graphite reactor (RBMK)",
    HWLWR: "heavy water light water reactor",
    PHWR: "pressurized heavy-water reactor",
    GCR: "gas-cooled reactor",
    HEU: "highly enriched uranium reactor",
    FBR: "fast breeder reactor",
  };
  if (core.mox) {
    return (
      <span>
        <span title={coreDef[core.type]}>{core.type}</span> with{" "}
        <span title="Mixed oxide fuel">MOX</span>
      </span>
    );
  }
  return <span title={coreDef[core.type]}>{core.type}</span>;
};

const CoreListItem = ({
  core,
  reactorLFStart,
  reactorLFEnd,
  incrimentCoresVersions,
}) => {
  const lf = core.loadFactor(reactorLFStart, reactorLFEnd);
  const fullPower = () => {
    core.setCustomLoad(1);
    incrimentCoresVersions();
  };
  const iaeaPower = () => {
    core.clearCustomLoad();
    incrimentCoresVersions();
  };
  const noPower = () => {
    core.setCustomLoad(0);
    incrimentCoresVersions();
  };
  let dist = core.detectorDistance.toFixed(0);
  if (core.detectorDistance < 10) {
    dist = core.detectorDistance.toFixed(2);
  } else if (core.detectorDistance < 100) {
    dist = core.detectorDistance.toFixed(1);
  }
  return (
    <ListGroup.Item>
      <h6>{core.name}</h6>
      <Row>
        <Col xl="auto">
          <ButtonGroup size="sm">
            <Button onClick={fullPower} variant="secondary">
              Set to 100% Load
            </Button>
            <Button onClick={iaeaPower} variant="secondary">
              Use IAEA LF Data
            </Button>
            <Button onClick={noPower} variant="secondary">
              Turn Core Off
            </Button>
          </ButtonGroup>
          <br />
          Type: <CoreType core={core} />
          <br />
          <span title="The Reference thermal power of the plant expressed in MW(th). The reactor thermal power is the net heat transferred from the fuel to the coolant.">
            Thermal Capacity:
          </span>{" "}
          {core.power} MW
          <br />
          Load Factor: {(lf * 100).toFixed(1)}%<br />
          Operating Power: {(lf * core.power).toFixed(0)} MW
          <br />
          Signal: {core.detectorNIU.toFixed(3)} NIU
        </Col>
        <Col xl>
          Lat: {core.lat.toFixed(4)} N<br />
          Lon: {core.lon.toFixed(4)} E<br />
          Elevation: {core.elevation} meters
          <br />
          Distance: {dist} km
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

export const CoreList = ({
  cores,
  reactorLFStart,
  reactorLFEnd,
  incrimentCoresVersions,
}) => {
  const [filter, setFilter] = useState("");
  const [sortMethod, setSortMethod] = useState("name");

  const coreObjs = Object.values(cores);

  const testCore = (core, filter) => {
    if (filter === "") {
      return true;
    }
    const reg = new RegExp(filter, "i");
    return reg.test(core.name);
  };

  const fullPowerAll = () => {
    Object.values(cores).map((core) => core.setCustomLoad(1));
    incrimentCoresVersions();
  };
  const noPowerAll = () => {
    Object.values(cores).map((core) => core.setCustomLoad(0));
    incrimentCoresVersions();
  };
  const iaeaPowerAll = () => {
    Object.values(cores).map((core) => core.clearCustomLoad());
    incrimentCoresVersions();
  };

  const sortFunctions = {
    name: ReactorCore.sortCompare,
    distance: (a, b) => a.detectorDistance - b.detectorDistance,
    signal: (a, b) => b.detectorNIU - a.detectorNIU,
  };

  return (
    <Card>
      <Card.Header>
        <Form inline>
          <h5 className="mr-auto">Core List</h5>
          <Form.Control
            onChange={(event) => setSortMethod(event.target.value)}
            as="select"
          >
            <option value="name">Sort By: Name</option>
            <option value="distance">Sort By: Distance</option>
            <option value="signal">Sort By: Signal</option>
          </Form.Control>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Control all Cores
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={fullPowerAll}>
                Use 100% load for all cores
              </Dropdown.Item>
              <Dropdown.Item onClick={iaeaPowerAll}>
                Use IAEA LF data for all cores
              </Dropdown.Item>
              <Dropdown.Item onClick={noPowerAll}>
                Turn off all cores
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Form.Control
            value={filter}
            onChange={({ target: { value } }) => setFilter(value)}
            type="search"
            placeholder="Filter Core List"
            className="mr-sm-2"
          />
        </Form>
      </Card.Header>
      <ListGroup variant="flush">
        {coreObjs
          .filter((core) => testCore(core, filter))
          .sort(sortFunctions[sortMethod])
          .map((core) => (
            <CoreListItem
              key={core.name}
              core={core}
              reactorLFStart={reactorLFStart}
              reactorLFEnd={reactorLFEnd}
              incrimentCoresVersions={incrimentCoresVersions}
            />
          ))}
      </ListGroup>
    </Card>
  );
};
