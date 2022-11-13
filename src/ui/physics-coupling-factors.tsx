import React from 'react';

import { Card, Table } from 'react-bootstrap';

// import { ES_COEFFICIENTS_VECTOR, ES_COEFFICIENTS_AXIAL } "../physics/neutrino-cross-section"

export const eESCouplingFactors = () => {
  return (
    <Card>
      <Card.Header>eES Coupling Factors</Card.Header>
      <Card.Body>
        <Table>
            <thead>
              <tr>
                <th></th>
                <th>ν<sub>e</sub></th>
                <th>ν̅<sub>e</sub></th>
                <th>ν<sub>x</sub></th>
                <th>ν̅<sub>x</sub></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>c<sub>V</sub></td>
                <td>
                  1/2 + 2sin<sup>2</sup> <i>θ</i><sub>W</sub>
                </td>
                <td>
                  1/2 + 2sin<sup>2</sup> <i>θ</i><sub>W</sub>
                </td>
                <td>
                  -1/2 + 2sin<sup>2</sup> <i>θ</i><sub>W</sub>
                </td>
                <td>
                  -1/2 + 2sin<sup>2</sup> <i>θ</i><sub>W</sub>
                </td>
              </tr>
               <tr>
                <td>c<sub>A</sub></td>
                <td>
                  1/2
                </td>
                <td>
                  -1/2
                </td>
                <td>
                  -1/2
                </td>
                <td>
                  1/2
                </td>
              </tr>
            </tbody>
          </Table>
      </Card.Body>
    </Card>
  );
}
