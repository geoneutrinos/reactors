import React, {useContext} from "react";
import { Form, Card, Table } from "react-bootstrap";
import { sum } from "lodash";

import { PhysicsContext } from "../state";

import { RANames } from "../physics/reactor-antineutrinos";
import { XSNames } from "../physics/neutrino-cross-section";
import { Isotopes } from "../physics/constants";
import {Elements} from './elements';
import bins from "../physics/bins";
import { Num } from ".";

const {Pu239, Pu241, U235, U238} = Elements

export const RASwitcher = () => {
  const {reactorAntineutrinoModel, reactorAntineutrinoModelDispatch, crossSection} = useContext(PhysicsContext)

  const RASelector = (
    <Form.Group controlId="reactorCrossSectionSwitcher">
      <Form.Label>Reactor Antineutrino Model</Form.Label>
      <Form.Control
        as="select"
        onChange={(event) => reactorAntineutrinoModelDispatch({arg:"model", value:event.target.value})}
        value={reactorAntineutrinoModel.modelName}
      >
        {Object.values(RANames).map((name) => {
          return (
            <option key={name} value={name}>
              {name}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );

  const svYield = (isotope) => sum(bins.map(bin => reactorAntineutrinoModel.model[isotope](bin) * crossSection[XSNames.IBDSV2003](bin)))/100
  const vbYield = (isotope) => sum(bins.map(bin => reactorAntineutrinoModel.model[isotope](bin) * crossSection[XSNames.IBDVB1999](bin)))/100
  const esaYield = (isotope) => sum(bins.map(bin => reactorAntineutrinoModel.model[isotope](bin) * crossSection[XSNames.ESANTI](bin)))/100
  const esxYield = (isotope) => sum(bins.map(bin => reactorAntineutrinoModel.model[isotope](bin) * crossSection[XSNames.ESMUTAU](bin)))/100
  const InteractionYield = (
    <div>
      <h5>IBD/ES Yields</h5>
    <Table>
       <caption>IBD/ES Yields (10<sup>-43</sup> cm<sup>2</sup> fission<sup>-1</sup>)</caption>
      <thead>
        <tr>
          <th>Interaction</th>
          <th>{U235}</th>
          <th>{U238}</th>
          <th>{Pu239}</th>
          <th>{Pu241}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{XSNames.IBDSV2003}</td>
          <td><Num v={svYield(Isotopes.U235) * 1e43} p={3}/></td>
          <td><Num v={svYield(Isotopes.U238) * 1e43} p={3}/></td>
          <td><Num v={svYield(Isotopes.PU239) * 1e43} p={3}/></td>
          <td><Num v={svYield(Isotopes.PU241) * 1e43} p={3}/></td>
        </tr>
        <tr>
          <td>{XSNames.IBDVB1999}</td>
          <td><Num v={vbYield(Isotopes.U235) * 1e43} p={3}/></td>
          <td><Num v={vbYield(Isotopes.U238) * 1e43} p={3}/></td>
          <td><Num v={vbYield(Isotopes.PU239) * 1e43} p={3}/></td>
          <td><Num v={vbYield(Isotopes.PU241) * 1e43} p={3}/></td>
        </tr>
        <tr>
          <td>{XSNames.ESANTI}</td>
          <td><Num v={esaYield(Isotopes.U235) * 1e43} p={3}/></td>
          <td><Num v={esaYield(Isotopes.U238) * 1e43} p={3}/></td>
          <td><Num v={esaYield(Isotopes.PU239) * 1e43} p={3}/></td>
          <td><Num v={esaYield(Isotopes.PU241) * 1e43} p={3}/></td>
        </tr>
        <tr>
          <td>{XSNames.ESMUTAU}</td>
          <td><Num v={esxYield(Isotopes.U235) * 1e43} p={3}/></td>
          <td><Num v={esxYield(Isotopes.U238) * 1e43} p={3}/></td>
          <td><Num v={esxYield(Isotopes.PU239) * 1e43} p={3}/></td>
          <td><Num v={esxYield(Isotopes.PU241) * 1e43} p={3}/></td>
        </tr>
      </tbody>
    </Table>
    </div>
  );

  return (
    <Card>
      <Card.Body>
        {RASelector}
        {InteractionYield}
      </Card.Body>
    </Card>
  );
};
