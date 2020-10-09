import React from 'react';

import {FERMI_COUPLING_CONSTANT, HBAR_C, ELECTRON_REST_MASS, WEAK_MIXING_ANGLE} from '../physics/constants'

import { Card, Table } from 'react-bootstrap';

export const PhysicsConstants = () => {
  return (
    <Card>
      <Card.Header>Physical Constants</Card.Header>
      <Card.Body>
        <Table>
            <thead>
              <tr>
                <th><i>G</i><sub>F</sub>/(ħc)<sup>3</sup> (GeV<sup>-2</sup>)</th>
                <th>ħc (MeV cm)</th>
                <th><i>m</i><sub>e</sub> (MeV)</th>
                <th>sin<sup>2</sup> θ<sub>W</sub></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {FERMI_COUPLING_CONSTANT.toExponential(7)}
                </td>
                <td>
                  {HBAR_C}
                </td>
                <td>
                  {ELECTRON_REST_MASS}
                </td>
                <td>
                  {WEAK_MIXING_ANGLE}
                </td>
              </tr>
            </tbody>
          </Table>
      </Card.Body>
    </Card>
  );
}
