import React from "react";
import { Card, Table } from "react-bootstrap";

import {FISSION_FRACTIONS, POWER_FRACTIONS} from '../reactor-cores';
import {FISSION_ENERGIES} from '../physics/constants'

export const FissionFractionPane = () => {
    const tableProps = { style: { width: "auto" }, borderless: true, size: "sm" };
  
    return (
      <Card>
        <Card.Header>Fission Energies, Power and Fission Fractions</Card.Header>
        <Card.Body>
            <p> Mid-cycle fission fractions
            <br />
            GCR: R. Mills, private communication, Dec. 12, 2018.
            <br />
            PHWR: M. Chen, private communication, Aug. 14, 2017.
            </p>
            <p> Mid-cycle power fractions
            <br />
            M. Baldoncini et al., "Reference worldwide model for antineutrinos from reactors," Phys.  Rev. D91, 065002 (2015).
            </p>
            <p> Mid-cycle fission energies
            <br />
            V. I. Kopeikin et al., "Reactor as a Source of Antineutrinos: Thermal Fission Energy," Phys. Atom. Nucl. 67, 1892 (2004).
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
                Q (MeV)
                </td>
                <td>{FISSION_ENERGIES.U235}</td>
                <td>{FISSION_ENERGIES.U238}</td>
                <td>{FISSION_ENERGIES.PU239}</td>
                <td>{FISSION_ENERGIES.PU241}</td>
              </tr>
              <tr>
                <td>
                p (PWR, BWR)
                </td>
                <td>{POWER_FRACTIONS.LEU.U235.toFixed(3)}</td>
                <td>{POWER_FRACTIONS.LEU.U238.toFixed(3)}</td>
                <td>{POWER_FRACTIONS.LEU.PU239.toFixed(3)}</td>
                <td>{POWER_FRACTIONS.LEU.PU241.toFixed(3)}</td>
              </tr>
              <tr>
                <td>
                p (PWR/MOX)
                </td>
                <td>{POWER_FRACTIONS.LEU_MOX.U235.toFixed(3)}</td>
                <td>{POWER_FRACTIONS.LEU_MOX.U238.toFixed(3)}</td>
                <td>{POWER_FRACTIONS.LEU_MOX.PU239.toFixed(3)}</td>
                <td>{POWER_FRACTIONS.LEU_MOX.PU241.toFixed(3)}</td>
              </tr>
              <tr>
                <td>
                f (GCR)
                </td>
                <td>{FISSION_FRACTIONS.GCR.U235.toFixed(4)}</td>
                <td>{FISSION_FRACTIONS.GCR.U238.toFixed(4)}</td>
                <td>{FISSION_FRACTIONS.GCR.PU239.toFixed(4)}</td>
                <td>{FISSION_FRACTIONS.GCR.PU241.toFixed(4)}</td>
              </tr>
              <tr>
                <td>
                f (PHWR)
                </td>
                <td>{FISSION_FRACTIONS.PHWR.U235.toFixed(3)}</td>
                <td>{FISSION_FRACTIONS.PHWR.U238.toFixed(3)}</td>
                <td>{FISSION_FRACTIONS.PHWR.PU239.toFixed(3)}</td>
                <td>{FISSION_FRACTIONS.PHWR.PU241.toFixed(3)}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };
