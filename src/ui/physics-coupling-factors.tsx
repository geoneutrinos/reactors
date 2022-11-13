import React from 'react';

import { Card, Table } from 'react-bootstrap';

export const EesCouplingFactors = () => {
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
                <td><i>c</i><sub>V</sub></td>
                <td>
                  1/2 + 2sin<sup>2</sup><i>θ</i><sub>W</sub>
                </td>
                <td>
                  1/2 + 2sin<sup>2</sup><i>θ</i><sub>W</sub>
                </td>
                <td>
                  -1/2 + 2sin<sup>2</sup><i>θ</i><sub>W</sub>
                </td>
                <td>
                  -1/2 + 2sin<sup>2</sup><i>θ</i><sub>W</sub>
                </td>
              </tr>
               <tr>
                <td><i>c</i><sub>A</sub></td>
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

export const PesCouplingFactors = () => {
  return (
    <Card>
      <Card.Header>pES Coupling Factors</Card.Header>
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
                <td><i>c</i><sub>V</sub></td>
                <td>
                  1/2 - 2sin<sup>2</sup><i>θ</i><sub>W</sub>
                </td>
                <td>
                  1/2 - 2sin<sup>2</sup><i>θ</i><sub>W</sub>
                </td>
                <td>
                  1/2 - 2sin<sup>2</sup><i>θ</i><sub>W</sub>
                </td>
                <td>
                  1/2 - 2sin<sup>2</sup><i>θ</i><sub>W</sub>
                </td>
              </tr>
               <tr>
                <td><i>c</i><sub>A</sub></td>
                <td>
                  1.27/2
                </td>
                <td>
                  -1.27/2
                </td>
                <td>
                  1.27/2
                </td>
                <td>
                  -1.27/2
                </td>
              </tr>
            </tbody>
          </Table>
      </Card.Body>
    </Card>
  );
}
