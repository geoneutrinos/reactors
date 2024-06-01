import {memo} from 'react';
import { Card, Table } from 'react-bootstrap';

import {Num} from "."

import {innerCoreMass,
        outerCoreMass,
        lowerMantleMass,
        upperMantleMass,
        lowerCrustMass,
        upperCrustMass,
        oceanMass,
        earthMass,
        innerCoreGeophysicalResponse,
        outerCoreGeophysicalResponse,
        lowerMantleGeophysicalResponse,
        upperMantleGeophysicalResponse,
        lowerCrustGeophysicalResponse,
        upperCrustGeophysicalResponse,
        oceanGeophysicalResponse,
        innerCoreMassAK135F,
        outerCoreMassAK135F,
        lowerMantleMassAK135F,
        upperMantleMassAK135F,
        lowerCrustMassAK135F,
        upperCrustMassAK135F,
        innerCoreGeophysicalResponseAK135F,
        outerCoreGeophysicalResponseAK135F,
        lowerMantleGeophysicalResponseAK135F,
        upperMantleGeophysicalResponseAK135F,
        lowerCrustGeophysicalResponseAK135F,
        upperCrustGeophysicalResponseAK135F,
        earthMassAK135F,
       } from "../mantle/PREM";
import {innerCoreMass as lunarInnerCoreMass,
        outerCoreMass as lunarOuterCoreMass,
        lvzMass,
        mantleMass as lunarMantleMass,
        crustMass as lunarCrustMass,
        innerCoreGeophysicalResponse as lunarInnerCoreGeophysicalResponse,
        outerCoreGeophysicalResponse as lunarOuterCoreGeophysicalResponse,
        lvzGeophysicalResponse,
        mantleGeophysicalResponse as lunarMantleGeophysicalResponse,
        crustGeophysicalResponse as lunarCrustGeophysicalResponse,
        lunarMass,
       } from "../mantle/lunar";
        
export const GeoDataPREM = memo(() => {
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
                <td>Lower Mantle</td>
                <td>
                  3480.0 - 5771.0
                </td>
                <td>
                  <Num v={lowerMantleMass} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                   <Num v={lowerMantleGeophysicalResponse} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
               <tr>
                <td>Upper Mantle</td>
                <td>
                  5711.0 - 6346.6
                </td>
                <td>
                  <Num v={upperMantleMass} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                   <Num v={upperMantleGeophysicalResponse} p={4} func={(v) => v * 1e-3} />
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
          • A.M. Dziewonski and D.L. Anderson (1981) <i>Preliminary Reference Earth Model (PREM)</i>, Phys. Earth Planet. Inter. 25, 297-356. <br />
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
                  0.0 - 1217.5
                </td>
                <td>
                  <Num v={innerCoreMassAK135F} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                  <Num v={innerCoreGeophysicalResponseAK135F} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
              <tr>
                <td>Outer Core</td>
                <td>
                  1217.5 - 3479.5
                </td>
                <td>
                  <Num v={outerCoreMassAK135F} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                   <Num v={outerCoreGeophysicalResponseAK135F} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
              <tr>
                <td>Lower Mantle</td>
                <td>
                  3479.5 - 5711.0
                </td>
                <td>
                  <Num v={lowerMantleMassAK135F} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                   <Num v={lowerMantleGeophysicalResponseAK135F} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
              <tr>
                <td>Upper Mantle</td>
                <td>
                  5711.0 - 6353.0
                </td>
                <td>
                  <Num v={upperMantleMassAK135F} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                   <Num v={upperMantleGeophysicalResponseAK135F} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
              <tr>
                <td>Lower Crust</td>
                <td>
                  6353.0 - 6361.0
                </td>
                <td>
                  <Num v={lowerCrustMassAK135F} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                  <Num v={lowerCrustGeophysicalResponseAK135F} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
              <tr>
                <td>Upper Crust</td>
                <td>
                  6361.0 - 6368.0
                </td>
                <td>
                  <Num v={upperCrustMassAK135F} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                  <Num v={upperCrustGeophysicalResponseAK135F} p={4} func={(v) => v * 1e-3} />
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
       </small></p>
       <Table>
            <thead>
              <tr>
                <th>Lunar Region</th>
                <th>Radii (km)</th>
                <th>Mass (10<sup>22</sup>kg)</th>
                <th>Geophysical Response (10<sup>3</sup>kg/cm<sup>2</sup>)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Inner Core</td>
                <td>
                  0.0 - 258
                </td>
                <td>
                  <Num v={lunarInnerCoreMass} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                  <Num v={lunarInnerCoreGeophysicalResponse} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
              <tr>
                <td>Outer Core</td>
                <td>
                  258 - 362
                </td>
                <td>
                  <Num v={lunarOuterCoreMass} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                   <Num v={lunarOuterCoreGeophysicalResponse} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
              <tr>
                <td>LVZ</td>
                <td>
                  362 - 560
                </td>
                <td>
                  <Num v={lvzMass} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                   <Num v={lvzGeophysicalResponse} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
              <tr>
                <td>Mantle</td>
                <td>
                  560 - 1698.6
                </td>
                <td>
                  <Num v={lunarMantleMass} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                   <Num v={lunarMantleGeophysicalResponse} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
              <tr>
                <td>Crust</td>
                <td>
                  1698.6 - 1737.1
                </td>
                <td>
                  <Num v={lunarCrustMass} p={4} func={(v) => v * 1e-25} />
                </td>
                <td>
                  <Num v={lunarCrustGeophysicalResponse} p={4} func={(v) => v * 1e-3} />
                </td>
              </tr>
         </tbody>
        </Table>
         <p><small>
          • Briaud et al. (2023) lunar mass is <Num v={lunarMass} p={4} func={(v) => v * 1e-25} /> x 10<sup>22</sup> kg. <br />
        </small></p>
      </Card.Body>
    </Card>
  );
})
