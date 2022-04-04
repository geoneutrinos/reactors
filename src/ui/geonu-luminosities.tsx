import React from 'react';

import {ISOTOPIC_NEUTRINO_LUMINOSITY} from '../physics/derived'
import {Elements} from './elements'

import { Card, Table } from 'react-bootstrap';

const {K40, Th232, U235, U238} = Elements

export const IsotopeNuLuminosities = () => {
  return (
    <Card>
      <Card.Header>Isotopic Neutrino Luminosities- <small>kg<sup>-1</sup> µs<sup>-1</sup></small></Card.Header>
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
                  {ISOTOPIC_NEUTRINO_LUMINOSITY.K40us}
                </td>
                <td>
                  {ISOTOPIC_NEUTRINO_LUMINOSITY.TH232us}
                </td>
                <td>
                  {ISOTOPIC_NEUTRINO_LUMINOSITY.U235us}
                </td>
                <td>
                  {ISOTOPIC_NEUTRINO_LUMINOSITY.U238us}
                </td>
              </tr>
            </tbody>
          </Table>
      </Card.Body>
    </Card>
  );
}
