import {memo} from 'react';

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

export const PhysicsOscillationPane = memo(() => {
  const tableProps = { size: "sm" };

  return (
    <Card>
      <Card.Header>Neutrino Oscillation Parameters</Card.Header>
      <Card.Body>
        <p>Values are from NuFit v6.0 IC24 w/ SK atmos, <a href="https://arxiv.org/abs/2410.05380"> arXiv:2410.05380 </a>, NuFIT 6.0 (2024) <a href="http://www.nu-fit.org"> www.nu-fit.org </a> </p>
        <Table {...tableProps} className="text-right">
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
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>NO</td>
              <td>{dmsq21.toExponential(2)}</td>
              <td>{dmsq31Normal.toExponential(4)}</td>
              <td>{dmsq32Normal.toExponential(4)}</td>
              <td>{s2t12.toFixed(3)}</td>
              <td>{s2t13Normal.toFixed(5)}</td>
            </tr>
            <tr>
              <td>IO</td>
              <td>{dmsq21.toExponential(2)}</td>
              <td>{dmsq31Inverted.toExponential(4)}</td>
              <td>{dmsq32Inverted.toExponential(4)}</td>
              <td>{s2t12.toFixed(3)}</td>
              <td>{s2t13Inverted.toFixed(5)}</td>
            </tr>
          </tbody>
        </Table>
        <p>
          NO (IO): Normal (Inverted) mass ordering- m<sub>3</sub> {">"} m<sub>2</sub> {">"} m<sub>1</sub> (m<sub>2</sub> {">"} m<sub>1</sub> {">"} m<sub>3</sub>)
        </p>
      </Card.Body>
    </Card>
  );
});

export const AverageSurvivalPane = memo(() => {
  const tableProps = { size: "sm" };

  return (
    <Card>
      <Card.Header>Average Survival Probability</Card.Header>
      <Card.Body>
        <p>Derived from mixing angles given by NuFit v6.0 IC24 w/ SK atmos, <a href="https://arxiv.org/abs/2410.05380"> arXiv:2410.05380 </a>, NuFIT 6.0 (2024) <a href="http://www.nu-fit.org"> www.nu-fit.org </a> </p>
        <Table {...tableProps} className="text-right">
          <thead>
            <tr>
              <th></th>
              <th>
                {"<"}P<sub>ee</sub>{">"}
              </th>
              <th>
                {"<"}P<sub>ee</sub>{">"}<sub>max</sub>
              </th>
              <th>
                {"%"} diff<sub>max</sub>
              </th>
              <th>
                {"<"}P<sub>ee</sub>{">"}<sub>min</sub>
              </th>
              <th>
                {"%"} diff<sub>min</sub>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>NO</td>
              <td>{averageSurvivalProbabilityNormal.toFixed(4)}</td>
              <td>0.5620</td>
              <td>1.771</td>
              <td>05419</td>
              <td>-1.872</td>
            </tr>
            <tr>
              <td>IO</td>
              <td>{averageSurvivalProbabilityInverted.toFixed(4)}</td>
              <td>0.5617</td>
              <td>-1.766</td>
              <td>0.5417</td>
              <td>-1.864</td>
            </tr>
          </tbody>
        </Table>
        <p>
          {"<"}P<sub>ee</sub>{">"}<sub>max</sub> ({"<"}P<sub>ee</sub>{">"}<sub>min</sub>) obtains with mixing angles at 1𝜎 minima (maxima)
        </p>
      </Card.Body>
    </Card>
  );
});
