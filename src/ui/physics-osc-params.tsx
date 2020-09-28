import React from "react";
import { Card, Table } from "react-bootstrap";

import {
  s2t12,
  dmsq21,
  s2t13Normal,
  s2t13Inverted,
  dmsq31Inverted,
  dmsq31Normal,
} from "../physics/neutrino-oscillation";

export const PhysicsOscillationPane = () => {
  const tableProps = { style: { width: "auto" }, borderless: true, size: "sm" };

  return (
    <Card>
      <Card.Header>Neutrino Oscillation Parameters</Card.Header>
      <Card.Body>
          <p>Osciliation values are from table 14.1 in <a href="https://pdg.lbl.gov/2017/reviews/rpp2017-rev-neutrino-mixing.pdf">C. Patrignani et al. (Particle Data Group), Chin. Phys. C, 40, 100001 (2016) and 2017 update</a></p>
        <Table {...tableProps}>
          <thead>
            <tr>
              <th></th>
              <th>Normal</th>
              <th>Inverted</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Δm<sup>2</sup>
                <sub>21</sub>
              </td>
              <td>{dmsq21}</td>
              <td>{dmsq21}</td>
            </tr>
            <tr>
              <td>
                Δm<sup>2</sup>
                <sub>31</sub>
              </td>
              <td>{dmsq31Normal}</td>
              <td>{dmsq31Inverted}</td>
            </tr>
            <tr>
              <td>
                sin<sup>2</sup>θ<sub>12</sub>
              </td>
              <td>{s2t12}</td>
              <td>{s2t12}</td>
            </tr>
            <tr>
              <td>
                sin<sup>2</sup>θ<sub>13</sub>
              </td>
              <td>{s2t13Normal}</td>
              <td>{s2t13Inverted}</td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};
