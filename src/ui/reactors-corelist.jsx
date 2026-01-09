import React, { useState, useRef, useEffect,useContext } from "react";
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

import { coreNameSortCompare } from "../reactor-cores";
import {DownloadButton} from "./output-download"
import { XSAbrev } from '../physics/neutrino-cross-section'

import {Num} from '.'

import {PhysicsContext} from "../state"
import bins from "../physics/bins";

const ENUtoNEU = (v) => {
  const v1 = -(v * (Math.PI / 180)) + Math.PI / 2
  const v2 = v1 < 0 ? v1 + 2 * Math.PI : v1
  return (v2 * 180) / Math.PI
}

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
  reactorLF,
  coreMods,
  setCoreMods,
  detector,
}) => {
  const {crossSection} = useContext(PhysicsContext)

  const lf = core.loadFactor(reactorLF.start, reactorLF.end);
  const fullPower = () => {
    const newMods = {...coreMods, [core.name]: {...coreMods[core.name], loadOverride: 1}};
    setCoreMods(newMods)
  };
  const iaeaPower = () => {
    const newMods = {...coreMods, [core.name]: {...coreMods[core.name], loadOverride: undefined}};
    setCoreMods(newMods)
  };
  const noPower = () => {
    const newMods = {...coreMods, [core.name]: {...coreMods[core.name], loadOverride: 0}};
    setCoreMods(newMods)
  };
  const outputSignalToggle = (e) => {
    const newMods = {...coreMods, [core.name]: {...coreMods[core.name], outputSignal: e.target.checked}};
    setCoreMods(newMods)
  };
  let dist = core.detectorDistance.toFixed(0);
  if (core.detectorDistance < 10) {
    dist = core.detectorDistance.toFixed(3);
  } else if (core.detectorDistance < 200) {
    dist = core.detectorDistance.toFixed(2);
  }

  const downloadFilename = `Antinu_spec10keV_${core.name}_${detector.current}_${XSAbrev[crossSection.crossSection]}_Tmin${crossSection.elasticScatteringTMin.toFixed(1)}MeV.csv`.replace(/\s/g, "_").replace(/\(|\)/g, '')
  const downloadData = {
    "bin center (MeV)": bins,
    NIU: core.detectorSignal,
    uncertainty: core.detectorUncertainty
  }
  const downloadFormatters = {
    "bin center (MeV)": v => v.toFixed(3),
  }

  const isShutdown = core.shutdown < new Date();

  return (
    <ListGroup.Item>
      <h6>{core.name}
      {isShutdown &&
        <span> (Permanently Shutdown in {core.shutdown.toISOString().slice(0,7)})
        </span>
}
</h6>
      <Row>
        <Col xl="auto">
          <ButtonGroup size="sm">
            <Button onClick={fullPower} variant="secondary">
              Set to 100% LF
            </Button>
            {core.type !== "custom" &&
            <Button onClick={iaeaPower} variant="secondary">
              Use IAEA LF Data
            </Button>}
            <Button onClick={noPower} variant="secondary">
              Turn Core Off
            </Button>
          </ButtonGroup>
        </Col>
        <Col xl>
          <DownloadButton buttonTitle="Download Core Spectrum" data={downloadData} formatters={downloadFormatters} filename={downloadFilename}/>
        </Col>
      </Row>
      <Row><Col>
        <Form.Check onChange={outputSignalToggle} checked={core.outputSignal} type="checkbox" label="Use as Signal in Output Calculator" />
        </Col>
        </Row>
      <Row>
        <Col xl="auto">
          Type: <CoreType core={core} />
          <br />
          <span title="The Reference thermal power of the plant expressed in MW<sub>Th</sub>. The reactor thermal power is the net heat transferred from the fuel to the coolant.">
            Thermal Capacity:
          </span>{" "}
          {core.power} MW<sub>Th</sub>
          <br />
          Load Factor: <Num v={lf} p={1} func={(v) => v * 100} />%<br />
          Operating Power: {(lf * core.power).toFixed(0)} MW<sub>Th</sub>
          <br />
          Signal: <Num v={core.detectorNIU} u={core.detectorNIUUncertainty} p={3}/> NIU
        </Col>
        <Col xl>
          Lat: {core.lat.toFixed(4)} N<br />
          Lon: {core.lon.toFixed(4)} E<br />
          Elevation: {core.elevation} m
          <br />
          Distance: {dist} km< br/>
          Azim: {ENUtoNEU(core.direction.phi).toFixed(1)}&deg; Alt: {core.direction.elev.toFixed(1)}&deg;
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

export const CoreList = ({
  cores,
  reactorLF,
  coreMods,
  setCoreMods,
  addCustomModal,
  manCustomModal,
  detector,
}) => {
  const {crossSection} = useContext(PhysicsContext)
  const [filter, setFilter] = useState("");
  const [displayLength, setDisplayLength] = useState(10);
  const [sortMethod, setSortMethod] = useState("distance");
  const [visible, setVisible] = useState(false);

  const cardRef = useRef(this)

  useEffect(()=>{
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 0
    }

    let observer = new IntersectionObserver((entries, observer) => {setVisible(entries[0].isIntersecting)}, options);
    observer.observe(cardRef.current)
  }, [])

  const coreObjs = Object.values(cores);

  const coreTypes = new Set(coreObjs.map(core => core.type))
  const spectrumTypes = new Set(coreObjs.map(core => core.spectrumType))

  const testCore = (core, filter) => {
    if (filter === "") {
      return true;
    }
    // if the filter matches a core type "exactly"
    if (coreTypes.has(filter.toUpperCase())){
      return core.type === filter.toUpperCase()
    }
    if (spectrumTypes.has(filter.toUpperCase())){
      return core.spectrumType === filter.toUpperCase()
    }
    const reg = new RegExp(filter, "i");
    return reg.test(core.name);
  };

  const fullPowerAll = () => {
    const newCoreMods = Object.fromEntries(Object.entries(cores).map(([name, core]) => [name, {...coreMods[core.name], loadOverride: core.shutdown < (new Date())? undefined: 1}]));
    setCoreMods(newCoreMods)
  };
  const noPowerAll = () => {
    const newCoreMods = Object.fromEntries(Object.entries(cores).map(([name, core]) => [name, {...coreMods[core.name], loadOverride: 0}]));
    setCoreMods(newCoreMods)
  };
  const iaeaPowerAll = () => {
    const newCoreMods = Object.fromEntries(Object.entries(cores).map(([name, core]) => [name, {...coreMods[core.name], loadOverride: undefined}]));
    setCoreMods(newCoreMods)
  };

  const sortFunctions = {
    name: coreNameSortCompare,
    distance: (a, b) => a.detectorDistance - b.detectorDistance,
    signal: (a, b) => b.detectorNIU - a.detectorNIU,
    type: (a, b) => a.type.localeCompare(b.type),
    capacity: (a, b) => b.power - a.power,
  };

  const filteredCores = visible ? coreObjs
  .filter((core) => testCore(core, filter))
  .sort(sortFunctions[sortMethod]) : []

  const coresForRender = filteredCores
    .slice(0, displayLength)

  const selectAllFiltered = () => {
    const newCoreMods = Object.fromEntries(filteredCores.map((core) => [core.name, {...coreMods[core.name], outputSignal: true}]));
    setCoreMods({...coreMods, ...newCoreMods})
  };
  const deSelectAllFiltered = () => {
    const newCoreMods = Object.fromEntries(filteredCores.map((core) => [core.name, {...coreMods[core.name], outputSignal: false}]));
    setCoreMods({...coreMods, ...newCoreMods})
  };
  const deSelectAll = () => {
    const newCoreMods = Object.fromEntries(Object.entries(cores).map(([name, core]) => [name, {...coreMods[core.name], outputSignal: false}]));
    setCoreMods(newCoreMods)
  };

  return (
    <Card ref={cardRef}>
      <Card.Header>
        <Form inline onSubmit={e => { e.preventDefault(); }}>
          <h5 className="mr-auto">Core List</h5>
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-custom-roes">
              Custom Cores
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={addCustomModal}>
                Add Custom Core
              </Dropdown.Item>
              <Dropdown.Item onClick={manCustomModal}>
                Delete Custom Cores
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-all-cores">
              Control all Cores
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={fullPowerAll}>
                Use 100% LF for all active cores
              </Dropdown.Item>
              <Dropdown.Item onClick={iaeaPowerAll}>
                Use IAEA LF data for all cores
              </Dropdown.Item>
              <Dropdown.Item onClick={noPowerAll}>
                Turn off all cores
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-selected">
               Signal Selection
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={selectAllFiltered}>
                Select all ({filteredCores.length}) Filtered Cores
              </Dropdown.Item>
              <Dropdown.Item onClick={deSelectAllFiltered}>
                Unselect all ({filteredCores.length}) Filtered Cores
              </Dropdown.Item>
              <Dropdown.Item onClick={deSelectAll}>
                Clear all Selected Cores
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
      <Card.Body>
        <p> Filter Cores by Name or Type (PWR, BWR, PHWR, GCR, LWGR, FBR, LEU_MOX) </p>
        <DownloadButton data={Object.values(cores)} cols={["name", "detectorDistance", "detectorNIU"]} buttonTitle="Download Data" filename="cores.csv"/>
      </Card.Body>
      <ListGroup variant="flush">
        <ListGroup.Item>
        <Row>
          <Col xs={4}>
          <h6>Core List Display Options</h6>
          <Form.Control
          value={displayLength}
            onChange={(event) => setDisplayLength(parseInt(event.target.value))}
            as="select"
          >
            <option value="10">Show: First 10 Cores</option>
            <option value="1000000">Show: All Cores</option>
          </Form.Control>
          <Form.Control
          value={sortMethod}
            onChange={(event) => setSortMethod(event.target.value)}
            as="select"
          >
            <option value="signal">Sort By: Signal</option>
            <option value="distance">Sort By: Distance</option>
            <option value="capacity">Sort By: Thermal Capacity</option>
            <option value="type">Sort By: Core Type</option>
            <option value="name">Sort By: Name</option>
          </Form.Control>
          </Col>
        </Row>
        </ListGroup.Item>
        {
          coresForRender.map((core) => (
            <CoreListItem
              key={core.name}
              core={core}
              reactorLF={reactorLF}
              coreMods={coreMods}
              setCoreMods={setCoreMods}
              detector={detector}
              crossSection={crossSection.crossSection}
            />
          ))}
      </ListGroup>
    </Card>
  );
};
