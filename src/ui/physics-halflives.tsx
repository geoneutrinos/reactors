import React from 'react';

import {ISOTOPIC_HALF_LIFE} from '../physics/constants'
import {Elements} from './elements'

import { Card, Table } from 'react-bootstrap';

const {K40, Th232, U235, U238} = Elements

export const IsotopeHalfLives = () => {
  return (
    <Card>
      <Card.Header>Isotope Half Lives</Card.Header>
      <Card.Body>
        <p>The listed half life values in 10<sup>9</sup> years are from the Nuclear Data Sheets.</p>
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
      </Card.Body>
    </Card>
  );
}
