import React from 'react';

import {ISOTOPIC_NEUTRINO_LUMINOSITY} from '../physics/derived'
import {Elements} from './elements'

import { Card, Table } from 'react-bootstrap';
import { Num } from '.';

const {K40, Th232, U235, U238} = Elements

export const IsotopeNuLuminosities = () => {
  return (
    <Card>
      <Card.Header>Isotope Neutrino Luminosities- <small>kg<sup>-1</sup> µs<sup>-1</sup></small></Card.Header>
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
                  <Num v={ISOTOPIC_NEUTRINO_LUMINOSITY.K40} p={3} func={(v) => v / 1e6} />
                </td>
                <td>
                  <Num v={ISOTOPIC_NEUTRINO_LUMINOSITY.TH232} p={3} func={(v) => v / 1e6} />
                </td>
                <td>
                  <Num v={ISOTOPIC_NEUTRINO_LUMINOSITY.U235} p={3} func={(v) => v / 1e6} />
                </td>
                <td>
                  <Num v={ISOTOPIC_NEUTRINO_LUMINOSITY.U238} p={3} func={(v) => v / 1e6}  />
                </td>
              </tr>
            </tbody>
          </Table>
      </Card.Body>
    </Card>
  );
}
