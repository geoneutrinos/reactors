import React from "react";

import { Modal, Button, Table } from "react-bootstrap";
import { ReactorCore } from "../reactor-cores";

export const AddCustomCoreModal = ({show, customCores, setCustomCores, close}) => {
  let defaultName = "Custom Core 1";
  let c = 1;
  while (defaultName in customCores){
    c += 1;
    defaultName = `Custom Core ${c}`;
  }
    const save = () => {
        const newCore = ReactorCore({
            name: defaultName,
            lat: 0,
            lon: 0,
            power: 1000,
            elevation: 0,
            custom: true,
            fisionFractions: {
                U235: 1,
                U238: 0,
                PU239: 0,
                PU241: 0
            }
        })
        setCustomCores({...customCores, [newCore.name]: newCore});
        close();
    }
    return <Modal show={show} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>Add Custom Core</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {defaultName}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
          <Button variant="primary" onClick={save}>
            Add Core
          </Button>
        </Modal.Footer>
    </Modal>
}

const ManageCustomCoreItem = ({core, delCore}) => {
  return <tr><td><Button variant="danger" onClick={delCore}>Delete Core</Button></td><td>{core.name}</td></tr>
}

export const ManageCustomCoreModal = ({show, customCores, setCustomCores, close}) => {
    const coreNmaes = Object.keys(customCores)

    const CoreList = coreNmaes.map((core) => <ManageCustomCoreItem core={customCores[core]} delCore={() => {let nc = {...customCores}; delete nc[core];  setCustomCores(nc)}}/> )
    return <Modal show={show} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>Manage Custom Core</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
          {coreNmaes.length > 0? CoreList: <li>No Custom Cores</li>}
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
        </Modal.Footer>
    </Modal>
}
