import React from "react";
import { Card, Table } from "react-bootstrap";

import {
  s2t12,
  dmsq21,
  s2t13Normal,
  s2t13Inverted,
  dmsq31Inverted,
  dmsq31Normal,
  dmsq32Normal,
  dmsq32Inverted,
  averageSurvivalProbabilityNormal,
  averageSurvivalProbabilityInverted,
} from "../physics/neutrino-oscillation";

export const PhysicsOscillationPane = () => {
  const tableProps = { size: "sm" };

  return (
    <Card>
      <Card.Header>Neutrino Oscillation Parameters</Card.Header>
      <Card.Body>
        <p>Parameter values are from JHEP 09 (2020) 178 <a href="https://arxiv.org/abs/2007.14792"> arXiv:2007.14792 </a></p>
        <Table {...tableProps}>
          <thead>
            <tr>
              <th></th>
              <th>
               δ<i>m</i><sup>2</sup>
                <sub>21</sub> (eV<sup>2</sup>)
              </th>
              <th>
                δ<i>m</i><sup>2</sup>
                <sub>31</sub> (eV<sup>2</sup>)
              </th>
              <th>
                δ<i>m</i><sup>2</sup>
                <sub>32</sub> (eV<sup>2</sup>)
              </th>
              <th>
                sin<sup>2</sup><i>θ</i><sub>12</sub>
              </th>
              <th>
                sin<sup>2</sup><i>θ</i><sub>13</sub>
              </th>
              <th>
                {"<"}P<sub>ee</sub>{">"}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>NO</td>
              <td>{dmsq21}</td>
              <td>{dmsq31Normal.toFixed(7)}</td>
              <td>{dmsq32Normal}</td>
              <td>{s2t12.toFixed(3)}</td>
              <td>{s2t13Normal}</td>
              <td>{averageSurvivalProbabilityNormal.toFixed(4)}</td>
            </tr>
            <tr>
              <td>IO</td>
              <td>{dmsq21}</td>
              <td>{dmsq31Inverted.toFixed(7)}</td>
              <td>{dmsq32Inverted}</td>
              <td>{s2t12.toFixed(3)}</td>
              <td>{s2t13Inverted.toFixed(5)}</td>
              <td>{averageSurvivalProbabilityInverted.toFixed(4)}</td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};
