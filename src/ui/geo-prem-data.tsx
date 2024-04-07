import { Card, Table } from 'react-bootstrap';

import {Num} from "."

import {innerCoreMass,
        outerCoreMass,
        mantleMass,
        lowerCrustMass,
        upperCrustMass,
        oceanMass,
        earthMass,
        innerCoreGeophysicalResponse,
        outerCoreGeophysicalResponse,
        mantleGeophysicalResponse,
        lowerCrustGeophysicalResponse,
        upperCrustGeophysicalResponse,
        oceanGeophysicalResponse,
        earthMassAK135F,
       } from "../mantle/PREM";
export const GeoDataPREM = () => {
  return (
    <Card>
      <Card.Header>Model Data</Card.Header>
      <Card.Body>
        <Table>
            <thead>
              <tr>
                <th>PREM Region</th>
                <th>Radii (km)</th>
                <th>Mass (10<sup>22</sup>kg)</th>
                <th>Geophysical Response (10<sup>3</sup>kg/cm<sup>2</sup>)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Inner Core</td>
                <td>
                  0.0 - 1221.5
                </td>
                <td>
                  <Num v={innerCoreMass} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                  <Num v={innerCoreGeophysicalResponse} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
               <tr>
                <td>Outer Core</td>
                <td>
                  1221.5 - 3480.0
                </td>
                <td>
                  <Num v={outerCoreMass} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                   <Num v={outerCoreGeophysicalResponse} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
               <tr>
                <td>Mantle</td>
                <td>
                  3480.0 - 6346.6
                </td>
                <td>
                  <Num v={mantleMass} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                   <Num v={mantleGeophysicalResponse} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
                <tr>
                <td>Lower Crust</td>
                <td>
                  6346.6 - 6356.0
                </td>
                <td>
                  <Num v={lowerCrustMass} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                  <Num v={lowerCrustGeophysicalResponse} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
               <tr>
                <td>Upper Crust</td>
                <td>
                  6356.0 - 6368.0
                </td>
                <td>
                  <Num v={upperCrustMass} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                  <Num v={upperCrustGeophysicalResponse} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
               <tr>
                <td>Ocean</td>
                 <td>
                  6368.0 - 6371.0
                </td>
                <td>
                  <Num v={oceanMass} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                  <Num v={oceanGeophysicalResponse} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
         </tbody>
          </Table>
        <p><small>
          • PREM earth mass is <Num v={earthMass} p={4} func={(v) => v * 1e-27} /> x 10<sup>24</sup> kg. <br />
          • A.M. Dziewonski and D.L. Anderson (1981), <i>Preliminary Reference Earth Model (PREM)</i>, Phys. Earth Planet. Inter. 25, 297-356. <br />
        </small></p>
        <Table>
            <thead>
              <tr>
                <th>AK135F Region</th>
                <th>Radii (km)</th>
                <th>Mass (10<sup>22</sup>kg)</th>
                <th>Geophysical Response (10<sup>3</sup>kg/cm<sup>2</sup>)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Inner Core</td>
                <td>
                  0.0 - 1221.5
                </td>
                <td>
                  <Num v={innerCoreMass} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                  <Num v={innerCoreGeophysicalResponse} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
               <tr>
                <td>Outer Core</td>
                <td>
                  1221.5 - 3480.0
                </td>
                <td>
                  <Num v={outerCoreMass} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                   <Num v={outerCoreGeophysicalResponse} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
               <tr>
                <td>Mantle</td>
                <td>
                  3480.0 - 6346.6
                </td>
                <td>
                  <Num v={mantleMass} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                   <Num v={mantleGeophysicalResponse} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
                <tr>
                <td>Lower Crust</td>
                <td>
                  6346.6 - 6356.0
                </td>
                <td>
                  <Num v={lowerCrustMass} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                  <Num v={lowerCrustGeophysicalResponse} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
               <tr>
                <td>Upper Crust</td>
                <td>
                  6356.0 - 6368.0
                </td>
                <td>
                  <Num v={upperCrustMass} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                  <Num v={upperCrustGeophysicalResponse} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
               <tr>
                <td>Ocean</td>
                 <td>
                  6368.0 - 6371.0
                </td>
                <td>
                  <Num v={oceanMass} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                  <Num v={oceanGeophysicalResponse} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
         </tbody>
          </Table>
        <p><small>
          • AK135F earth mass is <Num v={earthMassAK135F} p={4} func={(v) => v * 1e-27} /> x 10<sup>24</sup> kg. <br />
          • Kennett B.L.N., Engdahl E.R. and Buland R. (1995) <i>Constraints on seismic velocities in the earth from travel times</i> Geophys. J. Int. 122:108-124. <br />
          • Montagner J.P. and Kennett B.L.N. (1995) <i>How to reconcile body-wave and normal-mode reference Earth models?</i> Geophys. J. Int. 125:229-248. <br />
        </small></p>
      </Card.Body>
    </Card>
  );
}
