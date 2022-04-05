import React from 'react';

import {ISOTOPIC_DECAY_HEATING} from '../physics/derived'
import {Elements} from './elements'

import { Card, Table } from 'react-bootstrap';
import { Num } from '.';

const {K40, Th232, U235, U238} = Elements

export const IsotopeDecayHeating = () => {
  return (
    <Card>
      <Card.Header>Isotope Decay Heating- <small>µJ kg<sup>-1</sup> s<sup>-1</sup></small></Card.Header>
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
                  <Num v={ISOTOPIC_DECAY_HEATING.K40_beta} p={3} func={(v) => v * 1e6}  />
                </td>
                <td>
                  <Num v={ISOTOPIC_DECAY_HEATING.TH232} p={3} func={(v) => v * 1e6} />
                </td>
                <td>
                  <Num v={ISOTOPIC_DECAY_HEATING.U235} p={3} func={(v) => v * 1e6} />
                </td>
                <td>
                  <Num v={ISOTOPIC_DECAY_HEATING.U238} p={3} func={(v) => v * 1e6} />
                </td>
              </tr>
            </tbody>
          </Table>
      </Card.Body>
    </Card>
  );
}
