import React from 'react';

import {ISOTOPIC_HALF_LIFE} from '../physics/constants'

import { Card, Table } from 'react-bootstrap';

export const IsotopeHalfLives = () => {
  return (
    <Card>
      <Card.Header>Isotope Half Lives</Card.Header>
      <Card.Body>
        <p>The listed half life values in 10<sup>9</sup> y are from the Nuclear Data Sheets.</p>
        <Table>
            <thead>
              <tr>
                <th><sup>40</sup>K)</th>
                <th><sup>232</sup>Th)</th>
                <th><sup>232</sup>U)</th>
                <th><sup>238</sup>U)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {ISOTOPIC_HALF_LIFE.K40}
                </td>
                <td>
                  {ISOTOPIC_HALF_LIFE.Th232}
                </td>
                <td>
                  {ISOTOPIC_HALF_LIFE.U235}
                </td>
                <td>
                  {ISOTOPIC_HALF_LIFE.U238}
                </td>
              </tr>
            </tbody>
          </Table>
      </Card.Body>
    </Card>
  );
}
