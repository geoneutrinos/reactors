import React from 'react';

import { Card, Table } from 'react-bootstrap';

import {Elements} from './elements'
import {Num} from "."

import {
  rateToFlux232Th,
  rateToFlux238U,
  rateToFlux40K,
} from "../antineutrino-spectrum";

import { XSNames } from "../physics/neutrino-cross-section";

const {K40, Th232, U235, U238} = Elements

export const GeoRateFluxYields = () => {
  console.log(rateToFlux232Th)
  console.log(rateToFlux235U)
  console.log(rateToFlux238U)
  console.log(rateToFlux40K)
  return (
    <Card>
      <Card.Header>Geoneutrino Isotopic Rate to Flux (10<sup>32</sup> y cm<sup>-2</sup> s<sup>-1</sup>) </Card.Header>
      <Card.Body>
        <Table>
            <thead>
              <tr>
                <th></th>
                <th>{K40}<sub>β</sub></th>
                <th>{Th232}</th>
                <th>{U235}</th>
                <th>{U238}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Inverse Beta Decay (IBD)</td>
                <td>
                  N.A.
                </td>
                <td>
                  <Num v={rateToFlux232Th[XSNames.IBDSV2003] as number} p={1} />
                </td>
                <td>
                  N.A.
                </td>
                <td>
                  <Num v={rateToFlux238U[XSNames.IBDSV2003] as number} p={1} />                  
                </td>
              </tr>
               <tr>
                <td>Electron Elastic Scattering (eES)</td>
                <td>
                  <Num v={rateToFlux40K[XSNames.ESANTI] as number} p={1} />                  
                </td>
                <td>
                  <Num v={rateToFlux232Th[XSNames.ESANTI] as number} p={1} />                
                </td>
                <td>
                  <Num v={rateToFlux235U[XSNames.ESANTI] as number} p={1} />                  
                </td>
                <td>
                  <Num v={rateToFlux238U[XSNames.ESANTI] as number} p={1} />                                  
                </td>
              </tr>
          </tbody>
          </Table>
        <p><small>
          These factors convert isotopic geo-neutrino rates to fluxes<br />
        </small></p>
      </Card.Body>
    </Card>
  );
}
