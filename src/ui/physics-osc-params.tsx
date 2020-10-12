import React from "react";
import { Card, Table } from "react-bootstrap";

import {
  s2t12,
  dmsq21,
  s2t13Normal,
  s2t13Inverted,
  dmsq31Inverted,
  dmsq31Normal,
  averageSurvivalProbabilityNormal,
  averageSurvivalProbabilityInverted,
} from "../physics/neutrino-oscillation";

export const PhysicsOscillationPane = () => {
  const tableProps = { style: { width: "auto" }, borderless: true, size: "sm" };

  return (
    <Card>
      <Card.Header>Neutrino Oscillation Parameters</Card.Header>
      <Card.Body>
      <p>Parameter values are from table 14.7 in <a href="https://pdg.lbl.gov/2020/reviews/rpp2020-rev-neutrino-mixing.pdf">Particle Data Group</a></p>
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
                Δ<i>m</i><sup>2</sup>
                <sub>21</sub>
              </td>
              <td>{dmsq21}</td>
              <td>{dmsq21}</td>
            </tr>
            <tr>
              <td>
                Δ<i>m</i><sup>2</sup>
                <sub>31</sub>
              </td>
              <td>{dmsq31Normal}</td>
              <td>{dmsq31Inverted}</td>
            </tr>
            <tr>
              <td>
                sin<sup>2</sup><i>θ</i><sub>12</sub>
              </td>
              <td>{s2t12}</td>
              <td>{s2t12}</td>
            </tr>
            <tr>
              <td>
                sin<sup>2</sup><i>θ</i><sub>13</sub>
              </td>
              <td>{s2t13Normal}</td>
              <td>{s2t13Inverted}</td>
            </tr>
            <tr>
              <td>
                P<sub>e</sub>
              </td>
              <td>{averageSurvivalProbabilityNormal.toFixed(4)}</td>
              <td>{averageSurvivalProbabilityInverted.toFixed(4)}</td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};
