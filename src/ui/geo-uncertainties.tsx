import React from 'react';

import {Elements} from './elements'

import { Card, Table } from 'react-bootstrap';

const {K40, Th232, U235, U238} = Elements

export const GeoFluxUncertainties = () => {
  return (
    <Card>
      <Card.Header>Geoneutrino Isotopic Flux Uncertainties</Card.Header>
      <Card.Body>
        <Table>
            <thead>
              <tr>
                <th></th>
                <th>{K40}</th>
                <th>{Th232}</th>
                <th>{U235}</th>
                <th>{U238}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Crust</td>
                <td>
                  0.25
                </td>
                <td>
                  0.33
                </td>
                <td>
                  0.27
                </td>
                <td>
                  0.27
                </td>
              </tr>
               <tr>
                <td>Mantle</td>
                <td>
                  0.33
                </td>
                <td>
                  0.33
                </td>
                <td>
                  0.33
                </td>
                <td>
                  0.33
                </td>
              </tr>
          </tbody>
          </Table>
        <p><small>
          <sup>40</sup>K: cite ref here<br />
          <sup>232</sup>Th: cite ref here<br />
          <sup>235</sup>U: cite ref here<br />
          <sup>238</sup>U: cite ref here<br />
        </small></p>
      </Card.Body>
    </Card>
  );
}
