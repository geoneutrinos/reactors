import React from 'react';

import {FERMI_COUPLING_CONSTANT, HBAR_C, WEAK_MIXING_ANGLE} from '../physics/constants'

import { Card, Table } from 'react-bootstrap';

export const PhysicsConstants = () => {
  return (
    <Card>
      <Card.Header>Physical Constants</Card.Header>
      <Card.Body>
        <p> 
          Except for sin<sup>2</sup><i>θ</i><sub>W</sub>, which is taken from J. Erler and M.J. Ramsey-Musolf (2005), <i>Weak mixing angle at 
          low energies</i>, Phys. Rev. D 72, 073003, values are from the 
          <a href="https://pdg.lbl.gov/2020/reviews/rpp2020-rev-phys-constants.pdf">Particle Data Group</a>.
        </p>
        <Table>
            <thead>
              <tr>
                <th><i>G<sub>F</sub></i> / (<i>ħc</i>)<sup>3</sup> (GeV<sup>-2</sup>)</th>
                <th><i>ħc</i> (MeV cm)</th>
                <th>sin<sup>2</sup><i>θ</i><sub>W</sub></th>
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
                  {WEAK_MIXING_ANGLE}
                </td>
              </tr>
            </tbody>
          </Table>
      </Card.Body>
    </Card>
  );
}
