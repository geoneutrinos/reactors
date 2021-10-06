import React from 'react';

import {NEUTRON_REST_MASS, PROTON_REST_MASS, ELECTRON_REST_MASS} from '../physics/constants'

import {IBD_THRESHOLD} from '../physics/derived'

import { Node, Provider } from "@nteract/mathjax";

import { Card, Table } from 'react-bootstrap';

export const ParticleMasses = () => {
  return (
    <Card>
      <Card.Header>Particle Masses / IBD Threshold</Card.Header>
      <Card.Body>
        <Provider>
        <p>Mass values are from the Particle Data Group <a href="https://pdg.lbl.gov/2020/reviews/rpp2020-rev-phys-constants.pdf">at this link</a>.</p>
        <Table>
            <thead>
              <tr>
                <th><i>m</i><sub>n</sub> (MeV)</th>
                <th><i>m</i><sub>p</sub> (MeV)</th>
                <th><i>m</i><sub>e</sub> (MeV)</th>
                <th><i>E</i><sub>thr</sub> (MeV)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {NEUTRON_REST_MASS}
                </td>
                <td>
                  {PROTON_REST_MASS}
                </td>
                <td>
                  {ELECTRON_REST_MASS}
                </td>
                <td>
                  {IBD_THRESHOLD.toFixed(6)}
                </td>
              </tr>
            </tbody>
          </Table>
          <div> 
            <p> Electron antineutrinos with energy greater than the threshold energy
            <Node>{String.raw`E_\mathrm{thr} = \frac{(m_\mathrm{n}+m_\mathrm{e})^2 - m_\mathrm{p}^2} {2m_\mathrm{p}},`}</Node> where {" "}
            <Node inline>{String.raw`m_\mathrm{n},`}</Node> {" "}
            <Node inline>{String.raw`m_\mathrm{p},`}</Node> {" "} and
            <Node inline>{String.raw`m_\mathrm{e},`}</Node> 
            are the masses of the neutron, proton, and electron respectively, initiate the IBD reaction on free protons.
            </p>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
}
