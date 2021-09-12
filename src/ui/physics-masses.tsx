import React from 'react';

import {NEUTRON_REST_MASS, PROTON_REST_MASS, ELECTRON_REST_MASS} from '../physics/constants'

import IBD_THRESHOLD from '../physics/derived'

import { Card, Table } from 'react-bootstrap';

export const ParticleMasses = () => {
  return (
    <Card>
      <Card.Header>Particle Masses / IBD Threshold</Card.Header>
      <Card.Body>
        <p>The listed values are from the Particle Data Group <a href="https://pdg.lbl.gov/2020/reviews/rpp2020-rev-phys-constants.pdf">at this link</a>.</p>
        <Table>
            <thead>
              <tr>
                <th><i>m</i><sub>n</sub> (MeV)</th>
                <th><i>m</i><sub>p</sub> (MeV)</th>
                <th><i>m</i><sub>e</sub> (MeV)</th>
                <th><i>E</i><sub>thesh</sub> (MeV)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {NEUTRON_REST_MASS}
                </td>
                <td>
                  {PROTON_REST_MASS}
                </td>
                <td>
                  {ELECTRON_REST_MASS}
                </td>
                <td>
                  {IBD_THRESHOLD}
                </td>
              </tr>
            </tbody>
          </Table>
      </Card.Body>
    </Card>
  );
}
