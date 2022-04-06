import React from 'react';

import {
  averageNeutrinoEnergy232Th,
  averageNeutrinoEnergy238U,
  averageNeutrinoEnergy235U,
  averageNeutrinoEnergy40K,
} from "../antineutrino-spectrum";

import {ISOTOPIC_HALF_LIFE} from '../physics/constants'

import {
  ISOTOPIC_DECAY_ENERGIES,
  ISOTOPIC_NEUTRINO_LUMINOSITY,
} from '../physics/derived';

import {Elements} from './elements'

import { Card, Table } from 'react-bootstrap';
import { Num } from '.';

const {K40, Th232, U235, U238} = Elements

export const IsotopeAvgNuEnergy = () => {
  return (
    <Card>
      <Card.Header>Isotope Data</Card.Header>
      <Card.Body>
        <Table>
            <thead>
              <tr>
                <th></th>
                <th><sup>40</sup>K<sub>β</sub></th>
                <th>{Th232}</th>
                <th>{U235}</th>
                <th>{U238}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> Decay energy (MeV) </td>
                <td>
                  <Num v={ISOTOPIC_DECAY_ENERGIES.K40} p={3} />
                </td>
                <td>
                  <Num v={ISOTOPIC_DECAY_ENERGIES.TH232} p={3} />
                </td>
                <td>
                  <Num v={ISOTOPIC_DECAY_ENERGIES.U235} p={3} />
                </td>
                <td>
                  <Num v={ISOTOPIC_DECAY_ENERGIES.U238} p={3} />
                </td>
              </tr>
              <tr>
                <td> Average ν energy (MeV) </td>
                <td>
                  <Num v={averageNeutrinoEnergy40K} p={3} />
                </td>
                <td>
                  <Num v={averageNeutrinoEnergy232Th} p={3} />
                </td>
                <td>
                  <Num v={averageNeutrinoEnergy235U} p={3} />
                </td>
                <td>
                  <Num v={averageNeutrinoEnergy238U} p={3} />
                </td>
              </tr>
              <tr>
                <td> Half Life (10<sup>9</sup> y) </td>
                 <td>
                  {ISOTOPIC_HALF_LIFE.K40e9y}
                </td>
                <td>
                  {ISOTOPIC_HALF_LIFE.TH232e9y.toFixed(1)}
                </td>
                <td>
                  {ISOTOPIC_HALF_LIFE.U235e9y}
                </td>
                <td>
                  {ISOTOPIC_HALF_LIFE.U238e9y}
                </td>
              </tr>
              <tr>
                <td> ν Luminosity (kg<sup>-1</sup> µs<sup>-1</sup>) </td>
                <td>
                  <Num v={ISOTOPIC_NEUTRINO_LUMINOSITY.K40} p={3} func={(v) => v / 1e6} />
                </td>
                <td>
                  <Num v={ISOTOPIC_NEUTRINO_LUMINOSITY.TH232} p={3} func={(v) => v / 1e6} />
                </td>
                <td>
                  <Num v={ISOTOPIC_NEUTRINO_LUMINOSITY.U235} p={3} func={(v) => v / 1e6} />
                </td>
                <td>
                  <Num v={ISOTOPIC_NEUTRINO_LUMINOSITY.U238} p={3} func={(v) => v / 1e6}  />
                </td>
              </tr>
            </tbody>
          </Table>
      </Card.Body>
    </Card>
  );
}
