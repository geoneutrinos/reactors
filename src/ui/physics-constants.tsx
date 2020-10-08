import React from 'react';

import { Card } from 'react-bootstrap';

export const PhysicsConstants = () => {
  return (
    <Card>
      <Card.Header>Physical Constants</Card.Header>
      <Card.Body>
        <Table {...table????}>
            <thead>
              <tr>
                <th><i>G</i><sub>F</sub> (MeV<sup>-2</sup>)</th>
                <th>hc/2pi (MeV-cm)</th>
                <th><i>m</i><sub>e</sub> (MeV)</th>
                <th>cos theta<sub>W</sub></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  1.1663787e<sup>-11</sup>
                </td>
                <td>
                  1.973269804e<sup>-11</sup>
                </td>
                <td>
                  0.5109989500
                </td>
                <td>
                  0.23153
                </td>
              </tr>
            </tbody>
          </Table>
      </Card.Body>
    </Card>
  );
}
