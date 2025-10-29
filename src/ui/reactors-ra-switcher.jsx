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

export const RASwitcher = ({active}) => {
  const {reactorAntineutrinoModel, reactorAntineutrinoModelDispatch, crossSection} = useContext(PhysicsContext)

  if (!active){
    return <div>Not Active</div>
  }

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

  const svYieldUncertanty = (isotope) => sum(bins.map(bin => reactorAntineutrinoModel.uncertanty[isotope](bin) * crossSection[XSNames.IBDSV2003](bin)))/100
  const vbYieldUncertanty = (isotope) => sum(bins.map(bin => reactorAntineutrinoModel.uncertanty[isotope](bin) * crossSection[XSNames.IBDVB1999](bin)))/100
  const esaYieldUncertanty = (isotope) => sum(bins.map(bin => reactorAntineutrinoModel.uncertanty[isotope](bin) * crossSection[XSNames.ESANTI](bin)))/100
  const esxYieldUncertanty = (isotope) => sum(bins.map(bin => reactorAntineutrinoModel.uncertanty[isotope](bin) * crossSection[XSNames.ESMUTAU](bin)))/100

  const InteractionYield = (
    <div>
      <br />
      <h6>pIBD/eES Yields- <small>10<sup>-43</sup> cm<sup>2</sup> fission<sup>-1</sup></small> </h6>
    <Table>
       <caption>Double click on, or hover pointer over, values to see more decimal places.</caption>
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
          <td><Num v={svYield(Isotopes.U235) * 1e43} u={svYieldUncertanty(Isotopes.U235) * 1e43} p={2}/></td>
          <td><Num v={svYield(Isotopes.U238) * 1e43} u={svYieldUncertanty(Isotopes.U238) * 1e43} p={2}/></td>
          <td><Num v={svYield(Isotopes.PU239) * 1e43} u={svYieldUncertanty(Isotopes.PU239) * 1e43} p={2}/></td>
          <td><Num v={svYield(Isotopes.PU241) * 1e43} u={svYieldUncertanty(Isotopes.PU241) * 1e43} p={2}/></td>
        </tr>
        <tr>
          <td>{XSNames.IBDVB1999}</td>
          <td><Num v={vbYield(Isotopes.U235) * 1e43} u={vbYieldUncertanty(Isotopes.U235) * 1e43} p={2}/></td>
          <td><Num v={vbYield(Isotopes.U238) * 1e43} u={vbYieldUncertanty(Isotopes.U238) * 1e43} p={2}/></td>
          <td><Num v={vbYield(Isotopes.PU239) * 1e43} u={vbYieldUncertanty(Isotopes.PU239) * 1e43} p={2}/></td>
          <td><Num v={vbYield(Isotopes.PU241) * 1e43} u={vbYieldUncertanty(Isotopes.PU241) * 1e43} p={2}/></td>
        </tr>
        <tr>
          <td>{XSNames.ESANTI}</td>
          <td><Num v={esaYield(Isotopes.U235) * 1e43} u={esaYieldUncertanty(Isotopes.U235) * 1e43} p={2}/></td>
          <td><Num v={esaYield(Isotopes.U238) * 1e43} u={esaYieldUncertanty(Isotopes.U238) * 1e43} p={2}/></td>
          <td><Num v={esaYield(Isotopes.PU239) * 1e43} u={esaYieldUncertanty(Isotopes.PU239) * 1e43} p={2}/></td>
          <td><Num v={esaYield(Isotopes.PU241) * 1e43} u={esaYieldUncertanty(Isotopes.PU241) * 1e43} p={2}/></td>
        </tr>
        <tr>
          <td>{XSNames.ESMUTAU}</td>
          <td><Num v={esxYield(Isotopes.U235) * 1e43} u={esxYieldUncertanty(Isotopes.U235) * 1e43} p={2}/></td>
          <td><Num v={esxYield(Isotopes.U238) * 1e43} u={esxYieldUncertanty(Isotopes.U238) * 1e43}  p={2}/></td>
          <td><Num v={esxYield(Isotopes.PU239) * 1e43} u={esxYieldUncertanty(Isotopes.PU239) * 1e43}  p={2}/></td>
          <td><Num v={esxYield(Isotopes.PU241) * 1e43} u={esxYieldUncertanty(Isotopes.PU241) * 1e43}  p={2}/></td>
        </tr>
      </tbody>
    </Table>
    </div>
  );

  return (
    <Card>
      <Card.Body>
        {RASelector}
        <p>
          <small>
            Reactor isotope emission spectra are constructed following the methods presented by C. Giunti, Y.F. Li, C.A. Ternes, Z. Xin (2021),{" "} 
            <a href="https://doi.org/10.1016/j.physletb.2022.137054"><i>Reactor antineutrino anomaly in light of recent flux model refinements</i></a>
          </small>
        </p>
        {InteractionYield}
      </Card.Body>
    </Card>
  );
};
