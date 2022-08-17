import React from 'react';

import { Card, Table } from 'react-bootstrap';

import {Elements} from './elements'
import {Num} from "."

import {
  rateToFlux232Th,
  rateToFlux238U,
  rateToFlux235U,
  rateToFlux40K,
} from "../antineutrino-spectrum";

import { XSNames } from "../physics/neutrino-cross-section";

const {K40, Th232, U235, U238} = Elements

export const GeoRateFluxYields = () => {
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
                <td>IBD: Strumia and Vissani (2003)</td>
                <td>
                  N.A.
                </td>
                <td>
                  <Num v={rateToFlux232Th[XSNames.IBDSV2003] as number} p={0} />
                </td>
                <td>
                  N.A.
                </td>
                <td>
                  <Num v={rateToFlux238U[XSNames.IBDSV2003] as number} p={0} />                  
                </td>
              </tr>
              <tr>
                <td>IBD: Vogel and Beacom (1999)</td>
                <td>
                  N.A.
                </td>
                <td>
                  <Num v={rateToFlux232Th[XSNames.IBDVB1999] as number} p={0} />
                </td>
                <td>
                  N.A.
                </td>
                <td>
                  <Num v={rateToFlux238U[XSNames.IBDVB1999] as number} p={0} />                  
                </td>
              </tr>
              <tr>
                <td>eES: electron antineutrino</td>
                <td>
                  <Num v={rateToFlux40K[XSNames.ESANTI] as number} p={0} />                  
                </td>
                <td>
                  <Num v={rateToFlux232Th[XSNames.ESANTI] as number} p={0} />                
                </td>
                <td>
                  <Num v={rateToFlux235U[XSNames.ESANTI] as number} p={0} />                  
                </td>
                <td>
                  <Num v={rateToFlux238U[XSNames.ESANTI] as number} p={0} />                                  
                </td>
              </tr>
              <tr>
                <td>eES: mu/tau antineutrino</td>
                <td>
                  <Num v={rateToFlux40K[XSNames.ESMUTAU] as number} p={0} />                  
                </td>
                <td>
                  <Num v={rateToFlux232Th[XSNames.ESMUTAU] as number} p={0} />                
                </td>
                <td>
                  <Num v={rateToFlux235U[XSNames.ESMUTAU] as number} p={0} />                  
                </td>
                <td>
                  <Num v={rateToFlux238U[XSNames.ESMUTAU] as number} p={0} />                                  
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
