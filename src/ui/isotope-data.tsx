import React from 'react';

import {
  averageNeutrinoEnergy232Th,
  averageNeutrinoEnergy238U,
  averageNeutrinoEnergy235U,
  averageNeutrinoEnergy40K,
  ISOTOPIC_DECAY_HEATING,
} from "../antineutrino-spectrum";

import {
  ISOTOPIC_HALF_LIFE,
  ISOTOPIC_NATURAL_ABUNDANCE,
} from '../physics/constants';

import {
  ISOTOPIC_DECAY_ENERGIES,
  ISOTOPIC_NEUTRINO_LUMINOSITY,
} from '../physics/derived';

import {Elements} from './elements'

import { Card, Table } from 'react-bootstrap';
import { Num } from '.';

const {K40, Th232, U235, U238} = Elements

export const IsotopeData = () => {
  return (
    <Card>
      <Card.Header>Isotope Data</Card.Header>
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
                <td> Half life (10<sup>9</sup> y) </td>
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
                <td> Natural abundance (%) </td>
                 <td>
                  {ISOTOPIC_NATURAL_ABUNDANCE.K40}
                </td>
                <td>
                  {ISOTOPIC_NATURAL_ABUNDANCE.TH232}
                </td>
                <td>
                  {ISOTOPIC_NATURAL_ABUNDANCE.U235}
                </td>
                <td>
                  {ISOTOPIC_NATURAL_ABUNDANCE.U238}
                </td>
              </tr>
              <tr>
                <td> ν luminosity (kg<sup>-1</sup> µs<sup>-1</sup>) </td>
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
              <tr>
                <td> Decay heat (µW kg<sup>-1</sup>) </td>
                <td>
                  <Num v={ISOTOPIC_DECAY_HEATING.K40beta} p={3} func={(v) => v * 1e6}  />
                </td>
                <td>
                  <Num v={ISOTOPIC_DECAY_HEATING.TH232} p={3} func={(v) => v * 1e6} />
                </td>
                <td>
                  <Num v={ISOTOPIC_DECAY_HEATING.U235} p={3} func={(v) => v * 1e6} />
                </td>
                <td>
                  <Num v={ISOTOPIC_DECAY_HEATING.U238} p={3} func={(v) => v * 1e6} />
                </td>
              </tr>
            </tbody>
          </Table>
          <p><small>
          Half life references:<br />
          {K40}: J. Chen, Nuclear Data Sheets A=40 140 (2017)<br />
          {Th232}: E. Browne, Nuclear Data Shetts A=232 107 (2006)<br />
          {U235}: E. Browne and J.K. Tuli, Nuclear Data Sheets A=235 122 (2014)<br />
          {U238}: E. Browne and J.K. Tuli, Nuclear Data Sheets A=238 127 (2015)<br />
        </small></p>
      </Card.Body>
    </Card>
  );
}