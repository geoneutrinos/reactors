import React from 'react';

import { Card, Table } from 'react-bootstrap';

import {Elements} from './elements'
import {Num} from "."
import {mantleUncertainty, crustUncertainty} from "../mantle"


const {K40, Th232, U235, U238} = Elements

export const GeoFluxUncertainties = () => {
  return (
    <Card>
      <Card.Header>Geoneutrino Isotopic Flux Uncertainties</Card.Header>
      <Card.Body>
        <Table>
            <thead>
              <tr>
                <th></th>
                <th>{K40}<sub>β</sub></th>
                <th>{Th232}</th>
                <th>{U235}</th>
                <th>{U238}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Crust</td>
                <td>
                  <Num v={crustUncertainty.K40Beta} p={2} />
                </td>
                <td>
                  <Num v={crustUncertainty.Th232} p={2} />
                </td>
                <td>
                  <Num v={crustUncertainty.U235} p={2} />
                </td>
                <td>
                  <Num v={crustUncertainty.U238} p={2} />
                </td>
              </tr>
               <tr>
                <td>Mantle</td>
                <td>
                  <Num v={mantleUncertainty.K40Beta} p={2} />
                </td>
                <td>
                  <Num v={mantleUncertainty.Th232} p={2} />
                </td>
                <td>
                  <Num v={mantleUncertainty.U235} p={2} />
                </td>
                <td>
                  <Num v={mantleUncertainty.U238} p={2} />
                </td>
              </tr>
          </tbody>
          </Table>
        <p><small>
          Crust uncertainties typical of site-specific results in Huang <i>et al.</i> (2013)<br />
          Mantle uncertainties represent range of predictions, precision of geoneutrino measurements<br />
        </small></p>
      </Card.Body>
    </Card>
  );
}
