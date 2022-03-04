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
                <th>{K40}</th>
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
          <sup>40</sup>K: cite ref here<br />
          <sup>232</sup>Th: cite ref here<br />
          <sup>235</sup>U: cite ref here<br />
          <sup>238</sup>U: cite ref here<br />
        </small></p>
      </Card.Body>
    </Card>
  );
}