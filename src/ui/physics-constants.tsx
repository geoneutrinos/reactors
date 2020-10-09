import React from 'react';

import {FERMI_COUPLING_CONSTANT, HBAR_C, ELECTRON_REST_MASS, WEAK_MIXING_ANGLE} from '../physics/constants'

import { Card, Table } from 'react-bootstrap';

export const PhysicsConstants = () => {
  return (
    <Card>
      <Card.Header>Physical Constants</Card.Header>
      <Card.Body>
        <p>The listed values are from the Particle Data Group <a href="https://pdg.lbl.gov/2020/reviews/rpp2020-rev-phys-constants.pdf">at this link</a></p>
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
