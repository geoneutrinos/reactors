import React, {useState, useMemo, memo} from "react";
import { Card, Form, InputGroup, Table } from "react-bootstrap";

import { Num } from ".";

import { Node, Provider } from "@nteract/mathjax";

import {
  CEvNSEventsElemental,
  SNFluxSpectrum,
  oscillatedFluxSpectrum,
  calcIBDSNRecord,
  calcSNRecord,
} from "../supernova";

import {
  SupernovaPlotsIBD,
  SupernovaFluxPlots,
  SupernovaOscillatedFluxPlots,
  SupernovaOscillatedInvertedFluxPlots,
  NeutrinoElectronElasticScatteringCrossSection,
} from "./supernova-plots"

import { Elements as ElementsUI } from "./elements";

import Elements from "../elements";
import { NeutrinoType, NeutrinoTarget } from "../physics/neutrino-cross-section";
import { MassOrdering } from "../physics/neutrino-oscillation"
import {crossSection16OElectronAntineutrino, crossSection16OElectronNeutrino, electronAntineutrino16OThresholdEnergy, electronNeutrino16OThresholdEnergy} from "../physics/oxygen-16";
import {crossSection12CElectronAntineutrino, crossSection12CElectronNeutrino, electronAntineutrino12CThresholdEnergy, electronNeutrino12CThresholdEnergy} from "../physics/carbon-12";

const SupernovaNusCEvNS = memo(({ nucleus, setNucleus, tESnMin, setTESnMin, fluxSpectrums }) => {

  //const events = CEvNSEvents(Elements[nucleus], tESnMin/1000, fluxSpectrums); // KeV to MeV?
  const events = (CEvNSEventsElemental(Elements[nucleus], tESnMin/1000, fluxSpectrums))

  const isotopicContributions = Object.entries(events).filter(([key, value]) => key !== "total").map(([isotope, value]) => {
    return (
      <tr key={isotope}>
      <td>{ElementsUI[isotope]}</td>
      <td>
        <Num v={value[NeutrinoType.electronNeutrino]} p={2} />
      </td>
      <td>
        <Num v={value[NeutrinoType.electronAntineutrino]} p={2} />
      </td>
      <td>
        <Num v={value[NeutrinoType.muTauNeutrino]} p={2} />
      </td>
    </tr> 
    )
  })

  return (
    <Card>
      <Card.Header>
        CCSNν (10 kpc): CEvNS Events (/1000 kg)
      </Card.Header>
      <Card.Body>
        <Provider>
          <div>
            <Table>
              <tbody>
                <tr>
                  <td>{Elements[nucleus].atomic_symbol} Events</td>
                  <td>
                    N(ν<sub>e</sub>) ={" "}
                    <Num v={events.total[NeutrinoType.electronNeutrino]} p={2} />
                  </td>
                  <td>
                    N(ν̅<sub>e</sub>) ={" "}
                    <Num v={events.total[NeutrinoType.electronAntineutrino]} p={2} />
                  </td>
                  <td>
                    N(ν<sub>x</sub>) ={" "}
                    <Num v={events.total[NeutrinoType.muTauNeutrino]} p={2} />
                  </td>
                </tr>
              </tbody>
            </Table>
          <details>
            <summary>Events by Isotope</summary>
            <Table>
              <thead>
                <tr>
                  <th></th>
                  <th>N(ν<sub>e</sub>)</th>
                  <th>N(ν̅<sub>e</sub>)</th>
                  <th>N(ν<sub>x</sub>)</th>
                </tr>
              </thead>
              <tbody>
                {isotopicContributions}
                </tbody>
                </Table>
                </details>
              <br />
          </div>
          <Form noValidate>
            <Form.Group controlId="set_nucleus">
              <Form.Label>Target Element</Form.Label>
              <Form.Control as="select" onChange={(event) => setNucleus(event.target.value)} value={nucleus}>
                <option value={Elements.Ar40.key}>Argon</option>
                <option value={Elements.Ge76.key}>Germanium</option>
                <option value={Elements.I127.key}>Iodine</option>
                <option value={Elements.Xe132.key}>Xenon</option>
                <option value={Elements.Cs133.key}>Cesium</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="tn_min">
              <Form.Label>
                Nucleus T<sub>min</sub> = {tESnMin} keV
              </Form.Label>
              <InputGroup>
                <Form.Control
                  value={tESnMin}
                  type="range"
                  step={.1}
                  min={0}
                  max={10}
                  onChange={(event) => setTESnMin(event.target.value)}
                />
              </InputGroup>
            </Form.Group>
          </Form>
        </Provider>
      </Card.Body>
    </Card>
  );
});

const SupernovaNusEventsIBD = ({
  IBDUnoscilated, 
  IBDOscilatedNormal, 
  IBDOscilatedInverted,
  AntiE12CIBDUnoscilated,
  AntiE12CIBDOscilatedNormal,
  AntiE12CIBDOscilatedInverted,
  E12CIBDUnoscilated,
  E12CIBDOscilatedNormal,
  E12CIBDOscilatedInverted,
  AntiE16OIBDUnoscilated,
  AntiE16OIBDOscilatedNormal,
  AntiE16OIBDOscilatedInverted,
  E16OIBDUnoscilated,
  E16OIBDOscilatedNormal,
  E16OIBDOscilatedInverted,
  tIBDpMin,
  setTIBDpMin,
  tIBDoxyMin,
  setTIBDoxyMin,
}) => {
  return (
    <Card>
      <Card.Header>
        CCSNν (10 kpc): IBD Events (/10<sup>32</sup> targets)
      </Card.Header>
      <Card.Body>
        <Provider>
          <div>
            <Table>
              <tbody>
                <tr>
                  <td>ν̅<sub>e</sub> + p</td>
                  <td>
                    N<sup>0</sup> = <Num v={IBDUnoscilated.events} p={1} />
                  </td>
                  <td>
                    N<sub>NO</sub> = <Num v={IBDOscilatedNormal.events} p={1} />
                  </td>
                  <td>
                    N<sub>IO</sub> = <Num v={IBDOscilatedInverted.events} p={1} />
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>ν<sub>e</sub> + <sup>12</sup>C</td>
                  <td>
                    N<sup>0</sup> = <Num v={E12CIBDUnoscilated.events} p={1} />
                  </td>
                  <td>
                    N<sub>NO</sub> = <Num v={E12CIBDOscilatedNormal.events} p={1} />
                  </td>
                  <td>
                    N<sub>IO</sub> = <Num v={E12CIBDOscilatedInverted.events} p={1} /> 
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>ν̅<sub>e</sub> + <sup>12</sup>C</td>
                  <td>
                    N<sup>0</sup> = <Num v={AntiE12CIBDUnoscilated.events} p={1} />
                  </td>
                  <td>
                    N<sub>NO</sub> = <Num v={AntiE12CIBDOscilatedNormal.events} p={1} />
                  </td>
                  <td>
                    N<sub>IO</sub> = <Num v={AntiE12CIBDOscilatedInverted.events} p={1} />
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>ν<sub>e</sub> + <sup>16</sup>O</td>
                  <td>
                    N<sup>0</sup> = <Num v={E16OIBDUnoscilated.events} p={1} />
                  </td>
                  <td>
                    N<sub>NO</sub> = <Num v={E16OIBDOscilatedNormal.events} p={1} />
                  </td>
                  <td>
                    N<sub>IO</sub> = <Num v={E16OIBDOscilatedInverted.events} p={1} /> 
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>ν̅<sub>e</sub> + <sup>16</sup>O</td>
                  <td>
                    N<sup>0</sup> = <Num v={AntiE16OIBDUnoscilated.events} p={1} />
                  </td>
                  <td>
                    N<sub>NO</sub> = <Num v={AntiE16OIBDOscilatedNormal.events} p={1} />
                  </td>
                  <td>
                    N<sub>IO</sub> = <Num v={AntiE16OIBDOscilatedInverted.events} p={1} />
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
            <Form.Group controlId="teplus_min">
              <Form.Label>
                ν̅<sub>e</sub> + p: e<sup>+</sup> T<sub>min</sub> = {tIBDpMin} MeV
              </Form.Label>
              <InputGroup>
                <Form.Control
                  value={tIBDpMin}
                  type="range"
                  step={0.5}
                  min={0}
                  max={10}
                  onChange={(event) => setTIBDpMin(event.target.value)}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="teoxy_min">
              <Form.Label>
                ν<sub>e</sub> + <sup>A</sup>X, ν̅<sub>e</sub> + <sup>A</sup>X: e<sup>-</sup>, e<sup>+</sup> T<sub>min</sub> = {tIBDoxyMin} MeV
              </Form.Label>
              <InputGroup>
                <Form.Control
                  value={tIBDoxyMin}
                  type="range"
                  step={0.5}
                  min={0}
                  max={20}
                  onChange={(event) => setTIBDoxyMin(event.target.value)}
                />
              </InputGroup>
            </Form.Group>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};

const SupernovaNusEventsES = ({
  ESEforNO,
  ESEforIO,
  AntiESEforNO, 
  AntiESEforIO,
  NuxESEforNO,
  NuxESEforIO,
  AnxESEforNO,
  AnxESEforIO,
  ESpNue,
  ESpAnu,
  ESpNux,
  ESpAnx,
  tESeMin,
  setTESeMin,
  tESpMin,
  setTESpMin,
}) => {
  return (
    <Card>
      <Card.Header>
        CCSNν: ES Events (/10<sup>32</sup> targets)
      </Card.Header>
      <Card.Body>
        <Provider>
          <div>
            <Table>
              <tbody>
                <tr>
                  <td>ν + e<sup>-</sup> NO</td>
                  <td>
                    N(ν<sub>e</sub>) = <Num v={ESEforNO.events} p={2} />
                  </td>
                  <td>
                    N(ν̅<sub>e</sub>) = <Num v={AntiESEforNO.events} p={2} />
                  </td>
                  <td>
                    N(ν<sub>x</sub>) = <Num v={NuxESEforNO.events} p={2} />
                  </td>
                  <td>
                    N(ν̅<sub>x</sub>) = <Num v={AnxESEforNO.events} p={2} />
                  </td>
                </tr>
                <tr>
                  <td>ν + e<sup>-</sup> IO</td>
                  <td>
                    N(ν<sub>e</sub>) = <Num v={ESEforIO.events} p={2} />
                  </td>
                  <td>
                    N(ν̅<sub>e</sub>) = <Num v={AntiESEforIO.events} p={2} />
                  </td>
                  <td>
                    N(ν<sub>x</sub>) = <Num v={NuxESEforIO.events} p={2} />
                  </td>
                  <td>
                    N(ν̅<sub>x</sub>) = <Num v={AnxESEforIO.events} p={2} />
                  </td>
                </tr>
                <tr>
                  <td>ν + p</td>
                  <td>
                    N(ν<sub>e</sub>) = <Num v={ESpNue.events} p={1} />
                  </td>
                  <td>
                    N(ν̅<sub>e</sub>) = <Num v={ESpAnu.events} p={1} />
                  </td>
                  <td>
                    N(ν<sub>x</sub>) = <Num v={ESpNux.events} p={1} />
                  </td>
                  <td>
                    N(ν̅<sub>x</sub>) = <Num v={ESpAnx.events} p={1} />
                  </td>
                </tr>
              </tbody>
            </Table>
            <Form.Group controlId="te_min">
              <Form.Label>
                ν + e<sup>-</sup>: e<sup>-</sup> T<sub>min</sub> = {tESeMin} MeV
              </Form.Label>
              <InputGroup>
                <Form.Control
                  value={tESeMin}
                  type="range"
                  step={0.5}
                  min={0}
                  max={10}
                  onChange={(event) => setTESeMin(event.target.value)}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="tp_min">
              <Form.Label>
                ν + p: p<sup>+</sup> T<sub>min</sub> = {tESpMin} MeV
              </Form.Label>
              <InputGroup>
                <Form.Control
                  value={tESpMin}
                  type="range"
                  step={0.1}
                  min={0}
                  max={2}
                  onChange={(event) => setTESpMin(event.target.value)}
                />
              </InputGroup>
            </Form.Group>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};

const SupernovaNusPane = () => {
  return (
    <Card>
      <Card.Header>Core Collapse SN Neutrinos</Card.Header>
      <Card.Body>
        <Provider>
          <div>
            <p>
              The non-oscillated fluence spectrum of neutrinos of a given species{" "}
              <Node
                inline
              >{String.raw`(\nu_\mathrm{e}, \overline{\nu}_\mathrm{e}, \nu_x)`}</Node>{" "}
              arriving at Earth from a core-collapse supernova is estimated by{" "}
              <Node>{String.raw`
                \Phi^0_{\nu_{\alpha}}(E)=\frac1{4 \pi D^2} \frac{E_{\nu_{\alpha}}^\mathrm{tot}}{\langle E_{\nu_\alpha} \rangle^2} \frac{\beta^\beta}{\Gamma(\beta)}\bigg[\frac{E}{\langle E_{\nu_\alpha} \rangle}\bigg]^{\beta-1} \mathrm{exp}\bigg[-\beta \frac{E}{\langle E_{\nu_\alpha} \rangle}\bigg]
                ,`}</Node>{" "}
              where <Node inline>{String.raw`D`}</Node> is the distance to the
              SN,{" "}
              <Node inline>{String.raw`E_{\nu_{\alpha}}^\mathrm{tot}`}</Node> is
              the total energy of the neutrino species,{" "}
              <Node inline>{String.raw`\langle E_{\nu_\alpha} \rangle`}</Node>{" "}
              is the average energy of the neutrino species,{" "}
              <Node inline>{String.raw`\beta`}</Node> is a spectrum shape
              parameter, and <Node inline>{String.raw`\Gamma`}</Node> is the
              gamma function.
            </p>
            <p>
              While distance <Node inline>{String.raw`D = 10`}</Node>{" "}
              kpc and spectrum shape parameter{" "}
              <Node inline>{String.raw`\beta = 4`}</Node>{" "} 
              are fixed, the default values for{" "}
              <Node
                inline
              >{String.raw`E_{\nu_{\alpha}}^\mathrm{tot} = 5\times10^{52}`}</Node>{" "}
              erg,{" "}
              <Node
                inline
              >{String.raw`\langle E_{\nu_{\mathrm{e}}} \rangle = 9.5`}</Node>{" "}
              MeV,{" "}
              <Node
                inline
              >{String.raw`\langle E_{\overline{\nu}_{\mathrm{e}}} \rangle = 12`}</Node>{" "}
              MeV, and{" "}
              <Node inline>{String.raw`\langle E_{\nu_{x}} \rangle = 15.6`}</Node>{" "}
              MeV are user-settable for exploring different models.
            </p>
            <p>
              Oscillation effects depend on the neutrino mass ordering (Dighe, A.S. and Smirnov, A.Y. (2000) Phys. Rev. D 62, 033007). 
              <br />
              For normal ordering (NO) with{" "}
              <Node inline>{String.raw`m_3 > m_2 > m_1`}</Node>{" "}
              <Node>{String.raw`\begin{aligned}
                & \Phi_{\nu_{\mathrm{e}}} = \Phi^0_{\nu_{e}}\sin^2\theta_{13} + \Phi^0_{\nu_{x}}(1-\sin^2\theta_{13})\\
                & \Phi_{\overline{\nu}_{\mathrm{e}}} = \Phi^0_{\overline{\nu}_{\mathrm{e}}}\cos^2\theta_{12}\cos^2\theta_{13} + \Phi^0_{\nu_{x}}(1-\cos^2\theta_{12}\cos^2\theta_{13}) \\
                & \Phi_{\nu_{x}} = \frac1{2}\big(\Phi^0_{\nu_{\mathrm{e}}}(1-\sin^2\theta_{13}) + \Phi^0_{\nu_{x}}(1+\sin^2\theta_{13}) \big) \\
                & \Phi_{\overline{\nu}_{x}} = \frac1{2}\big(\Phi^0_{\overline{\nu}_{\mathrm{e}}}(1-\cos^2\theta_{12}\cos^2\theta_{13}) + \Phi^0_{\nu_{x}}(1+\cos^2\theta_{12}\cos^2\theta_{13})\big)
                \end{aligned}`}</Node>
            </p>
            <p>
              For inverted ordering (IO) with{" "}
              <Node inline>{String.raw`m_2 > m_1 > m_3`}</Node>{" "}
              <Node>{String.raw`\begin{aligned}
                & \Phi_{\nu_{\mathrm{e}}} = \Phi^0_{\nu_{e}}\sin^2\theta_{12}\cos^2\theta_{13} + \Phi^0_{\nu_{x}}(1-\sin^2\theta_{12}\cos^2\theta_{13})\\
                & \Phi_{\overline{\nu}_{\mathrm{e}}} = \Phi^0_{\overline{\nu}_{\mathrm{e}}}\sin^2\theta_{13} + \Phi^0_{\nu_{x}}(1-\sin^2\theta_{13}) \\
                & \Phi_{\nu_{x}} = \frac1{2}\big(\Phi^0_{\nu_{\mathrm{e}}}(1-\sin^2\theta_{12}\cos^2\theta_{13}) + \Phi^0_{\nu_{x}}(1+\sin^2\theta_{12}\cos^2\theta_{13}) \big) \\
                & \Phi_{\overline{\nu}_{x}} = \frac1{2}\big(\Phi^0_{\overline{\nu}_{\mathrm{e}}}(1-\sin^2\theta_{13}) + \Phi^0_{\nu_{x}}(1+\sin^2\theta_{13})\big)
                \end{aligned}`}</Node>
            </p>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};

const NeutrinoAvgEnergy = ({ nueAvgEnrg, setAvgEnrgNue, anuAvgEnrg, setAvgEnrgAnu, nuxAvgEnrg, setAvgEnrgNux }) => {
  return (
    <Card>
      <Card.Header>Average Energy of Neutrinos</Card.Header>
      <Card.Body>
        <Form.Group controlId="avgenergy_nue">
          <Form.Label>
            ν<sub>e</sub> E<sub>avg</sub> = {nueAvgEnrg} MeV
          </Form.Label>
          <InputGroup>
            <Form.Control
              value={nueAvgEnrg}
              type="range"
              step={0.1}
              min={6}
              max={13}
              onChange={(event) => setAvgEnrgNue(event.target.value)}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="avgenergy_anu">
          <Form.Label>
            ν̅<sub>e</sub> E<sub>avg</sub> = {anuAvgEnrg} MeV
          </Form.Label>
          <InputGroup>
            <Form.Control
              value={anuAvgEnrg}
              type="range"
              step={0.1}
              min={9}
              max={16}
              onChange={(event) => setAvgEnrgAnu(event.target.value)}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="avgenergy_nux">
          <Form.Label>
            ν<sub>x</sub> E<sub>avg</sub> = {nuxAvgEnrg} MeV
          </Form.Label>
          <InputGroup>
            <Form.Control
              value={nuxAvgEnrg}
              type="range"
              step={0.1}
              min={12}
              max={19}
              onChange={(event) => setAvgEnrgNux(event.target.value)}
            />
          </InputGroup>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

const NeutrinoTotEnergy = ({ nueTotEnrg, setTotEnrgNue, anuTotEnrg, setTotEnrgAnu, nuxTotEnrg, setTotEnrgNux }) => {
  return (
    <Card>
      <Card.Header>Total Energy of Neutrinos</Card.Header>
      <Card.Body>
        <Form.Group controlId="totenergy_nue">
          <Form.Label>
            ν<sub>e</sub> E<sub>tot</sub> = {nueTotEnrg} x10<sup>52</sup> erg
          </Form.Label>
          <InputGroup>
            <Form.Control
              value={nueTotEnrg}
              type="range"
              step={0.1}
              min={1}
              max={5}
              onChange={(event) => setTotEnrgNue(event.target.value)}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="totenergy_anu">
          <Form.Label>
            ν̅<sub>e</sub> E<sub>tot</sub> = {anuTotEnrg} x10<sup>52</sup> erg
          </Form.Label>
          <InputGroup>
            <Form.Control
              value={anuTotEnrg}
              type="range"
              step={0.1}
              min={1}
              max={5}
              onChange={(event) => setTotEnrgAnu(event.target.value)}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="totenergy_nux">
          <Form.Label>
            ν<sub>x</sub> E<sub>tot</sub> = {nuxTotEnrg} x10<sup>52</sup> erg
          </Form.Label>
          <InputGroup>
            <Form.Control
              value={nuxTotEnrg}
              type="range"
              step={0.1}
              min={1}
              max={5}
              onChange={(event) => setTotEnrgNux(event.target.value)}
            />
          </InputGroup>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export const SupernovaNus = React.memo(() => {
  const [tIBDpMin, setTIBDpMin] = useState(0.0);
  const [tIBDoxyMin, setTIBDoxyMin] = useState(0.0);
  const [tESeMin, setTESeMin] = useState(0.0);
  const [tESpMin, setTESpMin] = useState(0.0);
  const [tESnMin, setTESnMin] = useState(0.0);
  const [nueAvgEnrg,setAvgEnrgNue] = useState(9.5);
  const [anuAvgEnrg,setAvgEnrgAnu] = useState(12.0);
  const [nuxAvgEnrg,setAvgEnrgNux] = useState(15.6);
  const [nueTotEnrg,setTotEnrgNue] = useState(5);
  const [anuTotEnrg,setTotEnrgAnu] = useState(5);
  const [nuxTotEnrg,setTotEnrgNux] = useState(5);
  const [nucleus, setNucleus] = useState(Elements.Xe132.key);

  // inital guesses 12, 15, 18 MeV too hot and now reduced
  // new values from P.C. Divari, Journal of Cosmology and Astroparticle Physics, JCAP09(2018)029

  const fluxSpectrums = useMemo(() => SNFluxSpectrum(nueAvgEnrg, anuAvgEnrg, nuxAvgEnrg, nueTotEnrg, anuTotEnrg, nuxTotEnrg), [nueAvgEnrg, anuAvgEnrg, nuxAvgEnrg, nueTotEnrg, anuTotEnrg, nuxTotEnrg])
  const oscillatedFluxSpectrums = oscillatedFluxSpectrum({fluxSpectrums})

  const IBDUnoscilated = calcIBDSNRecord(NeutrinoType.electronAntineutrino, fluxSpectrums, tIBDpMin)
  const IBDOscilatedNormal = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Normal], tIBDpMin)
  const IBDOscilatedInverted = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Inverted], tIBDpMin)

  const AntiE12CIBDUnoscilated = calcIBDSNRecord(NeutrinoType.electronAntineutrino, fluxSpectrums, tIBDoxyMin, crossSection12CElectronAntineutrino, electronAntineutrino12CThresholdEnergy)
  const AntiE12CIBDOscilatedNormal = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Normal], tIBDoxyMin, crossSection12CElectronAntineutrino, electronAntineutrino12CThresholdEnergy)
  const AntiE12CIBDOscilatedInverted = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Inverted], tIBDoxyMin, crossSection12CElectronAntineutrino, electronAntineutrino12CThresholdEnergy)

  const E12CIBDUnoscilated = calcIBDSNRecord(NeutrinoType.electronNeutrino, fluxSpectrums, tIBDoxyMin, crossSection12CElectronNeutrino, electronNeutrino12CThresholdEnergy)
  const E12CIBDOscilatedNormal = calcIBDSNRecord(NeutrinoType.electronNeutrino, oscillatedFluxSpectrums[MassOrdering.Normal], tIBDoxyMin, crossSection12CElectronNeutrino, electronNeutrino12CThresholdEnergy)
  const E12CIBDOscilatedInverted = calcIBDSNRecord(NeutrinoType.electronNeutrino, oscillatedFluxSpectrums[MassOrdering.Inverted], tIBDoxyMin, crossSection12CElectronNeutrino, electronNeutrino12CThresholdEnergy)

  const AntiE16OIBDUnoscilated = calcIBDSNRecord(NeutrinoType.electronAntineutrino, fluxSpectrums, tIBDoxyMin, crossSection16OElectronAntineutrino, electronAntineutrino16OThresholdEnergy)
  const AntiE16OIBDOscilatedNormal = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Normal], tIBDoxyMin, crossSection16OElectronAntineutrino, electronAntineutrino16OThresholdEnergy)
  const AntiE16OIBDOscilatedInverted = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Inverted], tIBDoxyMin, crossSection16OElectronAntineutrino, electronAntineutrino16OThresholdEnergy)

  const E16OIBDUnoscilated = calcIBDSNRecord(NeutrinoType.electronNeutrino, fluxSpectrums, tIBDoxyMin, crossSection16OElectronNeutrino, electronNeutrino16OThresholdEnergy)
  const E16OIBDOscilatedNormal = calcIBDSNRecord(NeutrinoType.electronNeutrino, oscillatedFluxSpectrums[MassOrdering.Normal], tIBDoxyMin, crossSection16OElectronNeutrino, electronNeutrino16OThresholdEnergy)
  const E16OIBDOscilatedInverted = calcIBDSNRecord(NeutrinoType.electronNeutrino, oscillatedFluxSpectrums[MassOrdering.Inverted], tIBDoxyMin, crossSection16OElectronNeutrino, electronNeutrino16OThresholdEnergy)

  const ESpNue = calcSNRecord(NeutrinoType.electronNeutrino, NeutrinoTarget.proton, tESpMin, fluxSpectrums)
  const ESpAnu = calcSNRecord(NeutrinoType.electronAntineutrino, NeutrinoTarget.proton, tESpMin, fluxSpectrums)
  const ESpNux = calcSNRecord(NeutrinoType.muTauNeutrino, NeutrinoTarget.proton, tESpMin, fluxSpectrums)
  const ESpAnx = calcSNRecord(NeutrinoType.muTauAntineutrino, NeutrinoTarget.proton, tESpMin, fluxSpectrums)

  const ESEforNO = calcSNRecord(NeutrinoType.electronNeutrino, NeutrinoTarget.electron, tESeMin, oscillatedFluxSpectrums[MassOrdering.Normal])
  const ESEforIO = calcSNRecord(NeutrinoType.electronNeutrino, NeutrinoTarget.electron, tESeMin, oscillatedFluxSpectrums[MassOrdering.Inverted])

  const AntiESEforNO = calcSNRecord(NeutrinoType.electronAntineutrino, NeutrinoTarget.electron, tESeMin, oscillatedFluxSpectrums[MassOrdering.Normal])
  const AntiESEforIO = calcSNRecord(NeutrinoType.electronAntineutrino, NeutrinoTarget.electron, tESeMin, oscillatedFluxSpectrums[MassOrdering.Inverted])

  const NuxESEforNO = calcSNRecord(NeutrinoType.muTauNeutrino, NeutrinoTarget.electron, tESeMin, oscillatedFluxSpectrums[MassOrdering.Normal])
  const NuxESEforIO = calcSNRecord(NeutrinoType.muTauNeutrino, NeutrinoTarget.electron, tESeMin, oscillatedFluxSpectrums[MassOrdering.Inverted])

  const AnxESEforNO = calcSNRecord(NeutrinoType.muTauAntineutrino, NeutrinoTarget.electron, tESeMin, oscillatedFluxSpectrums[MassOrdering.Normal])
  const AnxESEforIO = calcSNRecord(NeutrinoType.muTauAntineutrino, NeutrinoTarget.electron, tESeMin, oscillatedFluxSpectrums[MassOrdering.Inverted])

  return (
    <div>
      <SupernovaNusCEvNS
        nucleus={nucleus}
        setNucleus={setNucleus}
        tESnMin={tESnMin}
        setTESnMin={setTESnMin}
        fluxSpectrums={fluxSpectrums}
      />
      <SupernovaNusEventsIBD
        IBDUnoscilated={IBDUnoscilated} 
        IBDOscilatedNormal={IBDOscilatedNormal} 
        IBDOscilatedInverted={IBDOscilatedInverted} 
        AntiE12CIBDUnoscilated={AntiE12CIBDUnoscilated}
        AntiE12CIBDOscilatedNormal={AntiE12CIBDOscilatedNormal}
        AntiE12CIBDOscilatedInverted={AntiE12CIBDOscilatedInverted}
        E12CIBDUnoscilated = {E12CIBDUnoscilated}
        E12CIBDOscilatedNormal = {E12CIBDOscilatedNormal}
        E12CIBDOscilatedInverted = {E12CIBDOscilatedInverted}
        AntiE16OIBDUnoscilated={AntiE16OIBDUnoscilated}
        AntiE16OIBDOscilatedNormal={AntiE16OIBDOscilatedNormal}
        AntiE16OIBDOscilatedInverted={AntiE16OIBDOscilatedInverted}
        E16OIBDUnoscilated = {E16OIBDUnoscilated}
        E16OIBDOscilatedNormal = {E16OIBDOscilatedNormal}
        E16OIBDOscilatedInverted = {E16OIBDOscilatedInverted}
        tIBDpMin={tIBDpMin}
        setTIBDpMin={setTIBDpMin}
        tIBDoxyMin={tIBDoxyMin}
        setTIBDoxyMin={setTIBDoxyMin}
      /> 
      <SupernovaNusEventsES
        ESpNue={ESpNue}
        ESpAnu={ESpAnu}
        ESpNux={ESpNux}
        ESpAnx={ESpAnx}
        ESEforNO={ESEforNO}
        ESEforIO={ESEforIO}
        AntiESEforNO={AntiESEforNO}
        AntiESEforIO={AntiESEforIO}
        NuxESEforNO={NuxESEforNO}
        NuxESEforIO={NuxESEforIO}
        AnxESEforNO={AnxESEforNO}
        AnxESEforIO={AnxESEforIO}
        tESeMin={tESeMin}
        setTESeMin={setTESeMin}
        tESpMin={tESpMin}
        setTESpMin={setTESpMin}
      />
      <SupernovaNusPane  />
      <NeutrinoAvgEnergy
        nueAvgEnrg={nueAvgEnrg}
        setAvgEnrgNue={setAvgEnrgNue}
        anuAvgEnrg={anuAvgEnrg}
        setAvgEnrgAnu={setAvgEnrgAnu}
        nuxAvgEnrg={nuxAvgEnrg}
        setAvgEnrgNux={setAvgEnrgNux}
      />
      <NeutrinoTotEnergy
        nueTotEnrg={nueTotEnrg}
        setTotEnrgNue={setTotEnrgNue}
        anuTotEnrg={anuTotEnrg}
        setTotEnrgAnu={setTotEnrgAnu}
        nuxTotEnrg={nuxTotEnrg}
        setTotEnrgNux={setTotEnrgNux}
      />
      <SupernovaPlotsIBD 
        IBDUnoscilated={IBDUnoscilated} 
        IBDOscilatedNormal={IBDOscilatedNormal} 
        IBDOscilatedInverted={IBDOscilatedInverted} 
      />
      <SupernovaFluxPlots fluxSpectrums={fluxSpectrums}/>
      <SupernovaOscillatedFluxPlots oscillatedFluxSpectrums={oscillatedFluxSpectrums}/>
      <SupernovaOscillatedInvertedFluxPlots oscillatedFluxSpectrums={oscillatedFluxSpectrums}/>
      <NeutrinoElectronElasticScatteringCrossSection 
        ESpNue={ESpNue}
        ESpAnu={ESpAnu}
        ESEforNO={ESEforNO}
        AntiESEforNO={AntiESEforNO}
        NuxESEforNO={NuxESEforNO}
        AnxESEforNO={AnxESEforNO}
        AntiE12CIBDUnoscilated={AntiE12CIBDUnoscilated}
        E12CIBDUnoscilated={E12CIBDUnoscilated}
        AntiE16OIBDUnoscilated={AntiE16OIBDUnoscilated}
        E16OIBDUnoscilated={E16OIBDUnoscilated}
      />
    </div>
  )
})
