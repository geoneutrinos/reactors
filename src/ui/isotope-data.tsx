import {
  averageNeutrinoEnergy232Th,
  averageNeutrinoEnergy238U,
  averageNeutrinoEnergy235U,
  averageNeutrinoEnergy40K,
  averageNeutrinoEnergy40KEC,
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
} from "../mantle/geophysics";

import {Elements} from './elements'

import { Card, Table } from 'react-bootstrap';
import { Num } from '.';
import { Node } from "@nteract/mathjax";

const {K40, Th232, U235, U238, Ar40, Ca40, Pb206, Pb207, Pb208} = Elements

export const IsotopeData = () => {
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
                  <Num v={ISOTOPIC_DECAY_ENERGIES.K40EC} p={3} />
                </td>
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
                  <Num v={averageNeutrinoEnergy40KEC} p={3} />
                </td>
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
                  <Num v={ISOTOPIC_NEUTRINO_LUMINOSITY.K40EC} p={1} func={(v) => v / 1e6} />
                </td>
                <td>
                  <Num v={ISOTOPIC_NEUTRINO_LUMINOSITY.K40} p={1} func={(v) => v / 1e6} />
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
                <td> Decay heat (µW kg<sup>-1</sup>) </td>
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
                <th>Decay Daughter</th>
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
          </Table>
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
            The neutrino luminosity and decay heat for each nuclide are calculated using the tabulated constants. 
            The neutrino luminosity is given by {" "} 
            <Node>{String.raw`
               l = \frac {\mathrm{ln}(2)} {t_{1/2}} \frac {n_\nu} {M_A},`}</Node>{" "}
            where <Node inline>{String.raw`t_{1/2}`}</Node>{" "} 
            is the half life, <Node inline>{String.raw`n_\nu`}</Node>{" "}
            is the number of neutrinos, and <Node inline>{String.raw`M_A`}</Node>{" "}
            is the atomic mass. The decay heat is given by {" "}
            <Node>{String.raw`
               h = \frac {\mathrm{ln}(2)} {t_{1/2}} \frac {Q_h} {M_A},`}</Node>{" "}
            where <Node inline>{String.raw`Q_h = Q_\mathrm{dk} - \langle Q_\nu \rangle`}</Node>{" "} 
            with <Node inline>{String.raw`Q_\mathrm{dk}`}</Node>{" "}
            the decay energy and <Node inline>{String.raw`\langle Q_\nu \rangle`}</Node>{" "}
            the average neutrino energy. The average neutrino energy depends on the decay 
            spectrum <Node inline>{String.raw`dn(E_{\overline{\nu}_\mathrm{e}}) \text{.}`}</Node>{" "}
            Specifically
            <Node>{String.raw`
            \langle Q_\nu \rangle = \frac {\int E_{\overline{\nu}_\mathrm{e}} \big(dn(E_{\overline{\nu}_\mathrm{e}}) 
            / dE \big) \, dE} {\int \big(dn(E_{\overline{\nu}_\mathrm{e}}) / dE \big)\, dE} \text{.}`}</Node>
            Calculation of the decay energy uses established values 
            for the electron and alpha particles masses, <Node inline>{String.raw`m_\mathrm{e}`}</Node>{" "} 
            and <Node inline>{String.raw`m_\alpha,`}</Node>{" "} respectively, 
            along with the tabulated number of alpha paticles <Node inline>{String.raw`N_\alpha`}</Node>{" "}
            as well as the parent and daughter atomic masses <Node inline>{String.raw`M_A`}</Node>{" "}
            and <Node inline>{String.raw`M_{A'},`}</Node>{" "} respectively, according to
            <Node>{String.raw`
               Q_\mathrm{dk} = M_A - M_{A'} - N_\alpha(m_\alpha + 2m_\mathrm{e}) \text{.}`}</Node>
          </p>
          <p><small>
            <b>Double click on, or hover pointer over, table values to display more decimal places</b>
          </small></p>
      </Card.Body>
    </Card>
  );
}
