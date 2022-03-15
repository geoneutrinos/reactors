import React from 'react';

import {ISOTOPIC_HALF_LIFE} from '../physics/constants'
import {Elements} from './elements'

import { Card, Table } from 'react-bootstrap';

const {K40, Th232, U235, U238} = Elements

export const IsotopeHalfLives = () => {
  return (
    <Card>
      <Card.Header>Isotope Half Lives- <small>10<sup>9</sup> years</small></Card.Header>
      <Card.Body>
        <Table>
            <thead>
              <tr>
                <th>{K40}</th>
                <th>{Th232}</th>
                <th>{U235}</th>
                <th>{U238}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {ISOTOPIC_HALF_LIFE.K40e9y}
                </td>
                <td>
                  {ISOTOPIC_HALF_LIFE.TH232e9y.toFixed(1)}
                </td>
                <td>
                  {ISOTOPIC_HALF_LIFE.U235e9y}
                </td>
                <td>
                  {ISOTOPIC_HALF_LIFE.U238e9y}
                </td>
              </tr>
            </tbody>
          </Table>
        <p><small>
          <sup>40</sup>K: J. Chen, Nuclear Data Sheets A=40 140 (2017)<br />
          <sup>232</sup>Th: E. Browne, Nuclear Data Shetts A=232 107 (2006)<br />
          <sup>235</sup>U: E. Browne and J.K. Tuli, Nuclear Data Sheets A=235 122 (2014)<br />
          <sup>238</sup>U: E. Browne and J.K. Tuli, Nuclear Data Sheets A=238 127 (2015)<br />
        </small></p>
      </Card.Body>
    </Card>
  );
}
