import React, {memo} from "react";
import { Card, Table } from "react-bootstrap";

import {FISSION_FRACTIONS, POWER_FRACTIONS} from '../reactor-cores';
import {FISSION_ENERGIES} from '../physics/constants'

export const FissionFractionPane = memo(() => {
    const tableProps = { style: { width: "auto" }, borderless: true, size: "sm" };
  
    return (
      <Card>
        <Card.Header>Fission Energies, Fractional Fission Ratess, Power Fractions</Card.Header>
        <Card.Body>
            <p> Fission energies- <i>Q</i>
            <br />
            X. B. Ma <i>et al.</i> (2013), <i>Improved calculation of the energy release in neutron-induced fission</i>, Phys. Rev. C. 88, 014605.
            </p>          
            <p> Mid-cycle fractional fission rates- <i>ffr</i>
            <br />
            PWR, BWR: K. Eguchi <i>et al.</i> (2003), <i>First Results from KamLAND: Evidence for Reactor Anti-Neutrino Disappearance</i>, Phys. Rev. Lett. 90, 021802.
            <br />
            GCR: R. Mills, private communication, Dec. 12, 2018.
            <br />
            PHWR: M. Chen, private communication, Aug. 14, 2017 (also <a href="https://arxiv.org/abs/2210.14154"> arXiv:2210.14154 </a>).
            </p>
            <p> Mid-cycle power fractions- <i>p</i>
            <br />
            M. Baldoncini <i>et al.</i> (2015), <i>Reference worldwide model for antineutrinos from reactors</i>, Phys.  Rev. D91, 065002.
            </p>
          <Table {...tableProps}>
            <thead>
              <tr>
                <th></th>
                <th><sup>235</sup>U</th>
                <th><sup>238</sup>U</th>
                <th><sup>239</sup>Pu</th>
                <th><sup>241</sup>Pu</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <i>Q</i> (MeV)
                </td>
                <td>{FISSION_ENERGIES.U235}</td>
                <td>{FISSION_ENERGIES.U238}</td>
                <td>{FISSION_ENERGIES.PU239}</td>
                <td>{FISSION_ENERGIES.PU241}</td>
              </tr>
              <tr>
                <td>
                  <i>ffr</i> (PWR, BWR)
                </td>
                <td>{FISSION_FRACTIONS.LEU.U235.toFixed(3)}</td>
                <td>{FISSION_FRACTIONS.LEU.U238.toFixed(3)}</td>
                <td>{FISSION_FRACTIONS.LEU.PU239.toFixed(3)}</td>
                <td>{FISSION_FRACTIONS.LEU.PU241.toFixed(3)}</td>
              </tr>
             <tr>
                <td>
                  <i>ffr</i> (GCR)
                </td>
                <td>{FISSION_FRACTIONS.GCR.U235.toFixed(4)}</td>
                <td>{FISSION_FRACTIONS.GCR.U238.toFixed(4)}</td>
                <td>{FISSION_FRACTIONS.GCR.PU239.toFixed(4)}</td>
                <td>{FISSION_FRACTIONS.GCR.PU241.toFixed(4)}</td>
              </tr>
              <tr>
                <td>
                  <i>ffr</i> (PHWR)
                </td>
                <td>{FISSION_FRACTIONS.PHWR.U235.toFixed(3)}</td>
                <td>{FISSION_FRACTIONS.PHWR.U238.toFixed(3)}</td>
                <td>{FISSION_FRACTIONS.PHWR.PU239.toFixed(3)}</td>
                <td>{FISSION_FRACTIONS.PHWR.PU241.toFixed(3)}</td>
              </tr>
              <tr>
                <td>
                  <i>p</i> (PWR/MOX)
                </td>
                <td>{POWER_FRACTIONS.LEU_MOX.U235.toFixed(3)}</td>
                <td>{POWER_FRACTIONS.LEU_MOX.U238.toFixed(3)}</td>
                <td>{POWER_FRACTIONS.LEU_MOX.PU239.toFixed(3)}</td>
                <td>{POWER_FRACTIONS.LEU_MOX.PU241.toFixed(3)}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  });
