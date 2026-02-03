import { memo } from "react";
import {
  averageNeutrinoEnergy232Th,
  averageNeutrinoEnergy238U,
  averageNeutrinoEnergy235U,
  averageNeutrinoEnergy40Kbeta,
  averageNeutrinoEnergy40Kec,
} from "../antineutrino-spectrum";

import {
  ISOTOPIC_HALF_LIFE,
  ISOTOPIC_NATURAL_ABUNDANCE,
  ISOTOPIC_NEUTRINOS_PER_DECAY,
  ISOTOPIC_ALPHAS_PER_DECAY,
  AU,
  K40_BRANCH_RATIO,
} from '../physics/constants';

import {
  ISOTOPIC_DECAY_ENERGIES,
  ISOTOPIC_NEUTRINO_LUMINOSITY,
  ISOTOPIC_ATOMIC_MASS_KG,
} from '../physics/derived';

import {
ISOTOPIC_DECAY_HEATING,
ELEMENTAL_DECAY_HEATING,
} from "../mantle/geophysics";

import {Elements} from './elements'

import { Card, Table } from 'react-bootstrap';
import { Num } from '.';
import { MathJax } from "better-react-mathjax";

const {K40, Th232, U235, U238, Ar40, Ca40, Pb206, Pb207, Pb208} = Elements

export const IsotopeData = memo(() => {
  return (
    <Card>
      <Card.Header>Nuclide Data</Card.Header>
      <Card.Body>
        <Table>
            <thead>
              <tr>
                <th>Decay Parent</th>
                <th>{K40}<sub>ec</sub></th>
                <th>{K40}<sub>β</sub></th>
                <th>{Th232}</th>
                <th>{U235}</th>
                <th>{U238}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> Atomic mass (10<sup>-26</sup> kg) </td>
                <td colSpan={2} style={{ textAlign: 'center' }}>
                  <Num v={ISOTOPIC_ATOMIC_MASS_KG.K40} p={3} func={(v) => v * 1e26} />
                </td>
                <td>
                  <Num v={ISOTOPIC_ATOMIC_MASS_KG.TH232} p={3} func={(v) => v * 1e26} />
                </td>
                <td>
                  <Num v={ISOTOPIC_ATOMIC_MASS_KG.U235} p={3} func={(v) => v * 1e26} />
                </td>
                <td>
                  <Num v={ISOTOPIC_ATOMIC_MASS_KG.U238} p={3} func={(v) => v * 1e26} />
                </td>
              </tr>
              <tr>
                <td> Decay energy (MeV) </td>
                <td>
                  <Num v={ISOTOPIC_DECAY_ENERGIES.K40ec} p={3} />
                </td>
                <td>
                  <Num v={ISOTOPIC_DECAY_ENERGIES.K40beta} p={3} />
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
                  <Num v={averageNeutrinoEnergy40Kec} p={3} />
                </td>
                <td>
                  <Num v={averageNeutrinoEnergy40Kbeta} p={3} />
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
                <td> Number ν (/decay) </td>
                <td>
                  {K40_BRANCH_RATIO.ec}
                </td>
                <td>
                  {K40_BRANCH_RATIO.beta}
                </td>
                <td>
                  {ISOTOPIC_NEUTRINOS_PER_DECAY.TH232}
                </td>
                <td>
                  {ISOTOPIC_NEUTRINOS_PER_DECAY.U235}
                </td>
                <td>
                  {ISOTOPIC_NEUTRINOS_PER_DECAY.U238}
                </td>
              </tr>
              <tr>
                <td> Number <i>&alpha;</i> (/decay) </td>
                <td colSpan={2} style={{ textAlign: 'center' }}>
                  {ISOTOPIC_ALPHAS_PER_DECAY.K40}
                </td>
                <td>
                  {ISOTOPIC_ALPHAS_PER_DECAY.TH232}
                </td>
                <td>
                  {ISOTOPIC_ALPHAS_PER_DECAY.U235}
                </td>
                <td>
                  {ISOTOPIC_ALPHAS_PER_DECAY.U238}
                </td>
              </tr>
              <tr>
                <td> Half life (10<sup>9</sup> y) </td>
                 <td colSpan={2} style={{ textAlign: 'center' }}>
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
                 <td colSpan={2} style={{ textAlign: 'center' }}>
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
                  <Num v={ISOTOPIC_NEUTRINO_LUMINOSITY.K40ec} p={1} func={(v) => v / 1e6} />
                </td>
                <td>
                  <Num v={ISOTOPIC_NEUTRINO_LUMINOSITY.K40beta} p={1} func={(v) => v / 1e6} />
                </td>
                <td>
                  <Num v={ISOTOPIC_NEUTRINO_LUMINOSITY.TH232} p={1} func={(v) => v / 1e6} />
                </td>
                <td>
                  <Num v={ISOTOPIC_NEUTRINO_LUMINOSITY.U235} p={1} func={(v) => v / 1e6} />
                </td>
                <td>
                  <Num v={ISOTOPIC_NEUTRINO_LUMINOSITY.U238} p={1} func={(v) => v / 1e6}  />
                </td>
              </tr>
              <tr>
                <td> Decay heating (µW kg<sup>-1</sup>) </td>
                <td>
                  <Num v={ISOTOPIC_DECAY_HEATING.K40ec} p={1} func={(v) => v * 1e6}  />
                </td>
                <td>
                  <Num v={ISOTOPIC_DECAY_HEATING.K40beta} p={1} func={(v) => v * 1e6}  />
                </td>
                <td>
                  <Num v={ISOTOPIC_DECAY_HEATING.TH232} p={1} func={(v) => v * 1e6} />
                </td>
                <td>
                  <Num v={ISOTOPIC_DECAY_HEATING.U235} p={1} func={(v) => v * 1e6} />
                </td>
                <td>
                  <Num v={ISOTOPIC_DECAY_HEATING.U238} p={1} func={(v) => v * 1e6} />
                </td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th>Stable Daughter</th>
                <th>{Ar40}</th>
                <th>{Ca40}</th>
                <th>{Pb208}</th>
                <th>{Pb207}</th>
                <th>{Pb206}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> Atomic mass (10<sup>-26</sup> kg) </td>
                <td>
                  <Num v={ISOTOPIC_ATOMIC_MASS_KG.AR40} p={3} func={(v) => v * 1e26} />
                </td>
                <td>
                  <Num v={ISOTOPIC_ATOMIC_MASS_KG.CA40} p={3} func={(v) => v * 1e26} />
                </td>
                <td>
                  <Num v={ISOTOPIC_ATOMIC_MASS_KG.PB208} p={3} func={(v) => v * 1e26} />
                </td>
                <td>
                  <Num v={ISOTOPIC_ATOMIC_MASS_KG.PB207} p={3} func={(v) => v * 1e26} />
                </td>
                <td>
                  <Num v={ISOTOPIC_ATOMIC_MASS_KG.PB206} p={3} func={(v) => v * 1e26} />
                </td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th>Element</th>
                <th>Potassium</th>
                <th>Thorium</th>
                <th>Uranium</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> Decay heating (µW kg<sup>-1</sup>) </td>
                <td>
                  <Num v={ELEMENTAL_DECAY_HEATING.K} p={3} func={(v) => v * 1e6} />
                </td>
                <td>
                  <Num v={ELEMENTAL_DECAY_HEATING.TH} p={3} func={(v) => v * 1e6} />
                </td>
                <td>
                  <Num v={ELEMENTAL_DECAY_HEATING.U} p={3} func={(v) => v * 1e6} />
                </td>
              </tr>
            </tbody>
          </Table>
          <p><small>
            <b>Double click on, or hover pointer over, calculated values to display more decimal places</b>
          </small></p>
          <p><small>
            <b>Atomic mass reference:</b> <br />
              &nbsp;&nbsp; https://physics.nist.gov/cgi-bin/Compositions/stand_alone.pl <br />
            <b>Half life references:</b> <br />
              &nbsp;&nbsp; {K40}: J. Chen, Nuclear Data Sheets A=40 140 (2017)<br />
              &nbsp;&nbsp; {Th232}: E. Browne, Nuclear Data Sheets A=232 107 (2006)<br />
              &nbsp;&nbsp; {U235}: E. Browne and J.K. Tuli, Nuclear Data Sheets A=235 122 (2014)<br />
              &nbsp;&nbsp; {U238}: E. Browne and J.K. Tuli, Nuclear Data Sheets A=238 127 (2015)<br />
          </small></p>
          <p>
            <MathJax>{String.raw`
            The neutrino luminosity and decay heat for each nuclide are calculated using the tabulated constants. 
            The neutrino luminosity is given by 
            $$
              l = \frac {\mathrm{ln}(2)} {t_{1/2}} \frac {n_\nu} {M_A},
            $$
            where $t_{1/2}$ is the half life, $n_\nu$ is the number of neutrinos, and $M_A$ is the atomic mass.
            The decay heating is given by 
            $$
               h = \frac {\mathrm{ln}(2)} {t_{1/2}} \frac {Q_h} {M_A},
            $$
            wherex $Q_h = Q_\mathrm{dk} - \langle Q_\nu \rangle$ with $Q_\mathrm{dk}$ the decay energy and $\langle Q_\nu \rangle$ the average neutrino energy.
            The average neutrino energy depends on the decay 
            spectrum $dn(E_{\overline{\nu}_\mathrm{e}}) \text{.}$
            Specifically
            $$
            \langle Q_\nu \rangle = \frac {\int E_{\overline{\nu}_\mathrm{e}} \big(dn(E_{\overline{\nu}_\mathrm{e}}) 
            / dE \big) \, dE} {\int \big(dn(E_{\overline{\nu}_\mathrm{e}}) / dE \big)\, dE} \text{.}
            $$
            Calculation of the decay energy uses established values for the electron and alpha particle masses, $m_\mathrm{e}$ and $m_\alpha,$ respectively, 
            along with the tabulated number of alpha paticls $N_\alpha$
            as well as the parent and daughter atomic masses $M_A$
            and $M_{A'},$ respectively, according to
            
               $$Q_\mathrm{dk} = M_A - M_{A'} - N_\alpha(m_\alpha + 2m_\mathrm{e}) \text{.}$$
               `}</MathJax>
          </p>
          <p>
            <MathJax>{String.raw`
            The radiogenic heating in the mantle from a nuclide with uniform concentration is given by
            $$
              H = \frac{\Phi M_m}{G_m} \frac{h}{l},
            $$
          where $\Phi$
          is the flux, $M_m$
          is the mantle mass, $G_m$
          is the mantle geophysical response, $h$
          is the decay heating, and $l$
          is the neutrino luminosity. 
          `}</MathJax>
          </p>
      </Card.Body>
    </Card>
  );
})
