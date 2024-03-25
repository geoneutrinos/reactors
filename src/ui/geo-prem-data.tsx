import { Card, Table } from 'react-bootstrap';

import {Num} from "."

import { innerCoreMass,outerCoreMass,mantleMass,lowerCrustMass,upperCrustMass } from "../mantle/PREM";
export const GeoDataPREM = () => {
  return (
    <Card>
      <Card.Header>PREM Data</Card.Header>
      <Card.Body>
        <Table>
            <thead>
              <tr>
                <th>Region</th>
                <th>Inner Radius (km)</th>
                <th>Outer Radius (km)</th>
                <th>Mass (kg)</th>
                <th>Geophysical Response (kg/cm<sup>2</sup>)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Inner Core</td>
                <td>
                  
                </td>
                <td>
                  
                </td>
                <td>
                  <Num v={innerCoreMass} p={2} />
                </td>
                <td>
                  
                </td>
              </tr>
               <tr>
                <td>Outer Core</td>
                <td>
                  
                </td>
                <td>
                  
                </td>
                <td>
                  <Num v={outerCoreMass} p={2} />
                </td>
                <td>
                  
                </td>
              </tr>
               <tr>
                <td>Mantle</td>
                <td>
                  
                </td>
                <td>
                  
                </td>
                <td>
                  <Num v={mantleMass} p={2} />
                </td>
                <td>
                  
                </td>
              </tr>
                <tr>
                <td>Lower Crust</td>
                <td>
                  
                </td>
                <td>
                  
                </td>
                <td>
                  <Num v={lowerCrustMass} p={2} />
                </td>
                <td>
                  
                </td>
              </tr>
               <tr>
                <td>Upper Crust</td>
                <td>
                  
                </td>
                <td>
                  
                </td>
                <td>
                  <Num v={upperCrustMass} p={2} />
                </td>
                <td>
                  
                </td>
              </tr>
         </tbody>
          </Table>
        <p><small>
          • <br />
          • <br />
        </small></p>
      </Card.Body>
    </Card>
  );
}
