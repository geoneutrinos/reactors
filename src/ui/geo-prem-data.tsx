import { Card, Table } from 'react-bootstrap';

import {Num} from "."

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
                <th>Geophysical Response (kg/cm<sup>2</sup></th>
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
