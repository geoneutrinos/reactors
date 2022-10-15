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
  SupernovaPlotsIBDnue16O,
  SupernovaPlotsIBDnuebar16O,
  SupernovaFluxPlots,
  SupernovaOscillatedFluxPlots,
  SupernovaOscillatedInvertedFluxPlots,
  NeutrinoElectronElasticScatteringCrossSection,
} from "./supernova-plots"

import { Elements as ElementsUI } from "./elements";

import Elements from "../elements";
import { NeutrinoType, NeutrinoTarget } from "../physics/neutrino-cross-section";
import { MassOrdering } from "../physics/neutrino-oscillation"

import {
  crossSection16OElectronAntineutrino, 
  crossSection16OElectronNeutrino, 
  electronAntineutrino16OThresholdEnergy, 
  electronNeutrino16OThresholdEnergy,
  crossSection16OElectronNeutrinoG1, 
  electronNeutrino16OThresholdEnergyG1,
  crossSection16OElectronNeutrinoG2, 
  electronNeutrino16OThresholdEnergyG2,
  crossSection16OElectronNeutrinoG3, 
  electronNeutrino16OThresholdEnergyG3,
  crossSection16OElectronNeutrinoG4, 
  electronNeutrino16OThresholdEnergyG4,
  crossSection16OElectronAntineutrinoG1, 
  electronAntineutrino16OThresholdEnergyG1,
  crossSection16OElectronAntineutrinoG2, 
  electronAntineutrino16OThresholdEnergyG2,
  crossSection16OElectronAntineutrinoG3, 
  electronAntineutrino16OThresholdEnergyG3,
  crossSection16OElectronAntineutrinoG4, 
  electronAntineutrino16OThresholdEnergyG4,
} from "../physics/oxygen-16";

import {
  crossSection12CElectronAntineutrino, 
  crossSection12CElectronNeutrino, 
  electronAntineutrino12CThresholdEnergy, 
  electronNeutrino12CThresholdEnergy
} from "../physics/carbon-12";

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
                  <th></th>
                  <th>N(ν<sub>e</sub>)</th>
                  <th>N(ν̅<sub>e</sub>)</th>
                  <th>N(ν<sub>x</sub>)</th>
                  <th>N<sub>tot</sub></th>
                </tr>
                <tr>
                  <td>{Elements[nucleus].atomic_symbol} Events</td>
                  <td>
                    <Num v={events.total[NeutrinoType.electronNeutrino]} p={2} />
                  </td>
                  <td>
                    <Num v={events.total[NeutrinoType.electronAntineutrino]} p={2} />
                  </td>
                  <td>
                    <Num v={events.total[NeutrinoType.muTauNeutrino]} p={2} />
                  </td>
                  <td>
                    <Num v={events.total[NeutrinoType.electronNeutrino] + events.total[NeutrinoType.electronAntineutrino] + events.total[NeutrinoType.muTauNeutrino]} p={2} />
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
                  onChange={(event) => setTESnMin(parseFloat(event.target.value))}
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
  pIBDUnoscillated, 
  pIBDOscillatedNormal, 
  pIBDOscillatedInverted,
  AntiE12CIBDUnoscillated,
  AntiE12CIBDOscillatedNormal,
  AntiE12CIBDOscillatedInverted,
  E12CIBDUnoscillated,
  E12CIBDOscillatedNormal,
  E12CIBDOscillatedInverted,
  AntiE16OIBDUnoscillated,
  AntiE16OIBDOscillatedNormal,
  AntiE16OIBDOscillatedInverted,
  E16OIBDUnoscillated,
  E16OIBDOscillatedNormal,
  E16OIBDOscillatedInverted,
  E16OIBDUnoscillatedG1,
  E16OIBDOscillatedNormalG1,
  E16OIBDOscillatedInvertedG1,
  E16OIBDUnoscillatedG2,
  E16OIBDOscillatedNormalG2,
  E16OIBDOscillatedInvertedG2,
  E16OIBDUnoscillatedG3,
  E16OIBDOscillatedNormalG3,
  E16OIBDOscillatedInvertedG3,
  E16OIBDUnoscillatedG4,
  E16OIBDOscillatedNormalG4,
  E16OIBDOscillatedInvertedG4,
  AntiE16OIBDUnoscillatedG1,
  AntiE16OIBDOscillatedNormalG1,
  AntiE16OIBDOscillatedInvertedG1,
  AntiE16OIBDUnoscillatedG2,
  AntiE16OIBDOscillatedNormalG2,
  AntiE16OIBDOscillatedInvertedG2,
  AntiE16OIBDUnoscillatedG3,
  AntiE16OIBDOscillatedNormalG3,
  AntiE16OIBDOscillatedInvertedG3,
  AntiE16OIBDUnoscillatedG4,
  AntiE16OIBDOscillatedNormalG4,
  AntiE16OIBDOscillatedInvertedG4,
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
                  <th></th>
                  <th>N<sup>0</sup></th>
                  <th>N<sub>NO</sub></th>
                  <th>N<sub>IO</sub></th>
                </tr>
                <tr>
                  <td>ν̅<sub>e</sub> + p</td>
                  <td>
                    <Num v={pIBDUnoscillated.events} p={1} />
                  </td>
                  <td>
                    <Num v={pIBDOscillatedNormal.events} p={1} />
                  </td>
                  <td>
                    <Num v={pIBDOscillatedInverted.events} p={1} />
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>ν<sub>e</sub> + <sup>12</sup>C</td>
                  <td>
                    <Num v={E12CIBDUnoscillated.events} p={1} />
                  </td>
                  <td>
                    <Num v={E12CIBDOscillatedNormal.events} p={1} />
                  </td>
                  <td>
                    <Num v={E12CIBDOscillatedInverted.events} p={1} /> 
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>ν̅<sub>e</sub> + <sup>12</sup>C</td>
                  <td>
                    <Num v={AntiE12CIBDUnoscillated.events} p={1} />
                  </td>
                  <td>
                    <Num v={AntiE12CIBDOscillatedNormal.events} p={1} />
                  </td>
                  <td>
                    <Num v={AntiE12CIBDOscillatedInverted.events} p={1} />
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>ν<sub>e</sub> + <sup>16</sup>O</td>
                  <td>
                    <Num v={E16OIBDUnoscillatedG1.events + E16OIBDUnoscillatedG2.events + E16OIBDUnoscillatedG3.events + E16OIBDUnoscillatedG4.events} p={1} />
                  </td>
                  <td>
                    <Num v={E16OIBDOscillatedNormalG1.events + E16OIBDOscillatedNormalG2.events + E16OIBDOscillatedNormalG3.events + E16OIBDOscillatedNormalG4.events} p={1} />
                  </td>
                  <td>
                    <Num v={E16OIBDOscillatedInvertedG1.events + E16OIBDOscillatedInvertedG2.events + E16OIBDOscillatedInvertedG3.events + E16OIBDOscillatedInvertedG4.events} p={1} /> 
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>ν̅<sub>e</sub> + <sup>16</sup>O</td>
                  <td>
                    <Num v={AntiE16OIBDUnoscillatedG1.events + AntiE16OIBDUnoscillatedG2.events + AntiE16OIBDUnoscillatedG3.events + AntiE16OIBDUnoscillatedG4.events} p={1} />
                  </td>
                  <td>
                    <Num v={AntiE16OIBDOscillatedNormalG1.events + AntiE16OIBDOscillatedNormalG2.events + AntiE16OIBDOscillatedNormalG3.events + AntiE16OIBDOscillatedNormalG4.events} p={1} />
                  </td>
                  <td>
                    <Num v={AntiE16OIBDOscillatedInvertedG1.events + AntiE16OIBDOscillatedInvertedG2.events + AntiE16OIBDOscillatedInvertedG3.events + AntiE16OIBDOscillatedInvertedG4.events} p={1} />
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
                  onChange={(event) => setTIBDpMin(parseFloat(event.target.value))}
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
                  onChange={(event) => setTIBDoxyMin(parseFloat(event.target.value))}
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
  ESEfor0O,
  ESEforNO,
  ESEforIO,
  AntiESEfor0O, 
  AntiESEforNO, 
  AntiESEforIO,
  NuxESEfor0O,
  NuxESEforNO,
  NuxESEforIO,
  AnxESEfor0O,
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
        CCSNν (10 kpc): ES Events (/10<sup>32</sup> targets)
      </Card.Header>
      <Card.Body>
        <Provider>
          <div>
            <Table>
              <tbody>
                <tr>
                  <th></th>
                  <th>N(ν<sub>e</sub>)</th>
                  <th>N(ν̅<sub>e</sub>)</th>
                  <th>N(ν<sub>x</sub>)</th>
                  <th>N(ν̅<sub>x</sub>)</th>
                  <th>N<sub>tot</sub></th>
                </tr>
                <tr>
                  <td>ν + e<sup>-</sup> w/o Osc</td>
                  <td>
                    <Num v={ESEfor0O.events} p={2} />
                  </td>
                  <td>
                    <Num v={AntiESEfor0O.events} p={2} />
                  </td>
                  <td>
                    <Num v={NuxESEfor0O.events} p={2} />
                  </td>
                  <td>
                    <Num v={AnxESEfor0O.events} p={2} />
                  </td>
                  <td>
                    <Num v={ESEfor0O.events + AntiESEfor0O.events + NuxESEfor0O.events + AnxESEfor0O.events} p={2} />
                  </td>
                </tr>
                <tr>
                  <td>ν + e<sup>-</sup> w/ NO Osc</td>
                  <td>
                    <Num v={ESEforNO.events} p={2} />
                  </td>
                  <td>
                    <Num v={AntiESEforNO.events} p={2} />
                  </td>
                  <td>
                    <Num v={NuxESEforNO.events} p={2} />
                  </td>
                  <td>
                    <Num v={AnxESEforNO.events} p={2} />
                  </td>
                  <td>
                    <Num v={ESEforNO.events + AntiESEforNO.events + NuxESEforNO.events + AnxESEforNO.events} p={2} />
                  </td>
                </tr>
                <tr>
                  <td>ν + e<sup>-</sup> w/ IO Osc</td>
                  <td>
                    <Num v={ESEforIO.events} p={2} />
                  </td>
                  <td>
                    <Num v={AntiESEforIO.events} p={2} />
                  </td>
                  <td>
                    <Num v={NuxESEforIO.events} p={2} />
                  </td>
                  <td>
                    <Num v={AnxESEforIO.events} p={2} />
                  </td>
                  <td>
                    <Num v={ESEforIO.events + AntiESEforIO.events + NuxESEforIO.events + AnxESEforIO.events} p={2} />
                  </td>
               </tr>
                <tr>
                  <td>ν + p</td>
                  <td>
                    <Num v={ESpNue.events} p={1} />
                  </td>
                  <td>
                    <Num v={ESpAnu.events} p={1} />
                  </td>
                  <td>
                    <Num v={ESpNux.events} p={1} />
                  </td>
                  <td>
                    <Num v={ESpAnx.events} p={1} />
                  </td>
                  <td>
                    <Num v={ESpNue.events + ESpAnu.events + ESpNux.events + ESpAnx.events} p={1} />
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
                  onChange={(event) => setTESeMin(parseFloat(event.target.value))}
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
                  onChange={(event) => setTESpMin(parseFloat(event.target.value))}
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
      <Card.Header>Core Collapse SN Neutrinos (CCSNν)</Card.Header>
      <Card.Body>
        <Provider>
          <div>
            <p>
              The non-oscillated fluence spectrum of neutrinos of a given species{" "}
              <Node
                inline
              >{String.raw`(\nu_\mathrm{e}, \overline{\nu}_\mathrm{e}, \nu_x)`}</Node>{" "}
              arriving at Earth from a core-collapse supernova is estimated by (M.T. Keil, G.G. Raffelt, and H.T. Janka, Astrophys. J. 590 (2003), 971){" "}
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
              kpc is fixed, the default values for{" "}
              <Node 
                inline
              >{String.raw`\beta`}</Node>,{" "} 
              <Node
                inline
              >{String.raw`E_{\nu_{\alpha}}^\mathrm{tot}`}</Node>,{" "}
              and{" "}
              <Node inline>{String.raw`\langle E_{\nu_{\alpha}} \rangle`}</Node>,{" "}
              are user-settable for exploring signals from different models.
            </p>
            <p>
              Oscillation effects depend on the neutrino mass ordering (A.S. Dighe and A.Y. Smirnov, Phys. Rev. D 62 (2000), 033007). 
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
            <p>
              The relatively high energies, large fluence, and short duration of the burst of CCSN neutrinos allows consideration of 
              several reactions not presented elsewhere on this site. In addition to pIBD and eES, on this tab we present cross section plots 
              and event totals for pES, <sup>16</sup>O IBD, <sup>12</sup>C IBD, and CEvNS. While the cross sections for CEvNS and pES 
              are calculated internally using the estabished code for two-body elastic scattering (e.g. eES), the calculations 
              of the cross sections for <sup>16</sup>O IBD and <sup>12</sup>C IBD are not conducive to online execution. For the <sup>16</sup>O IBD cross sections we use
              parameterized fits (with threshold energies slightly larger than the excitation energies of each group)
              from Nakazato, Suzuki, Sakuda (2018). For the <sup>12</sup>C IBD cross sections we use the fits to the data in Kolbe, Langanke, Vogel (1999)
              as found on the SNOwGLoBES site.
            </p>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};

const SpectrumShapeParameter = ({
  nueSpectrumShapeParam,
  setNueSpectrumShapeParam,
  anuSpectrumShapeParam,
  setAnuSpectrumShapeParam,
  nuxSpectrumShapeParam,
  setNuxSpectrumShapeParam, 
}) => {
  return (
    <Card>
      <Card.Header>Spectrum Shape Parameters</Card.Header>
      <Card.Body>
        <Form.Group controlId="nue_shape_param">
          <Form.Label>
             ν<sub>e</sub> β = {nueSpectrumShapeParam}
          </Form.Label>
          <InputGroup>
            <Form.Control
              value={nueSpectrumShapeParam}
              type="range"
              step={1}
              min={2}
              max={6}
              onChange={(event) => setNueSpectrumShapeParam(parseFloat(event.target.value))}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="anu_shape_param">
          <Form.Label>
             ν̅<sub>e</sub> β = {anuSpectrumShapeParam}
          </Form.Label>
          <InputGroup>
            <Form.Control
              value={anuSpectrumShapeParam}
              type="range"
              step={1}
              min={2}
              max={6}
              onChange={(event) => setAnuSpectrumShapeParam(parseFloat(event.target.value))}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="nux_shape_param">
          <Form.Label>
             ν<sub>x</sub> β = {nuxSpectrumShapeParam}
          </Form.Label>
          <InputGroup>
            <Form.Control
              value={nuxSpectrumShapeParam}
              type="range"
              step={1}
              min={2}
              max={6}
              onChange={(event) => setNuxSpectrumShapeParam(parseFloat(event.target.value))}
            />
          </InputGroup>
        </Form.Group>
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
              min={5}
              max={25}
              onChange={(event) => setAvgEnrgNue(parseFloat(event.target.value))}
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
              min={5}
              max={25}
              onChange={(event) => setAvgEnrgAnu(parseFloat(event.target.value))}
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
              min={5}
              max={25}
              onChange={(event) => setAvgEnrgNux(parseFloat(event.target.value))}
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
              max={10}
              onChange={(event) => setTotEnrgNue(parseFloat(event.target.value))}
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
              max={10}
              onChange={(event) => setTotEnrgAnu(parseFloat(event.target.value))}
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
              max={10}
              onChange={(event) => setTotEnrgNux(parseFloat(event.target.value))}
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
  const [nueAvgEnrg,setAvgEnrgNue] = useState(10.0);
  const [anuAvgEnrg,setAvgEnrgAnu] = useState(12.0);
  const [nuxAvgEnrg,setAvgEnrgNux] = useState(15.0);
  const [nueTotEnrg,setTotEnrgNue] = useState(5);
  const [anuTotEnrg,setTotEnrgAnu] = useState(5);
  const [nuxTotEnrg,setTotEnrgNux] = useState(5);
  const [nueSpectrumShapeParam,setNueSpectrumShapeParam] = useState(4);
  const [anuSpectrumShapeParam,setAnuSpectrumShapeParam] = useState(4);
  const [nuxSpectrumShapeParam,setNuxSpectrumShapeParam] = useState(4);
  const [nucleus, setNucleus] = useState(Elements.Xe132.key);

  // inital guesses 12, 15, 18 MeV too hot and now reduced
  // new values from P.C. Divari, Journal of Cosmology and Astroparticle Physics, JCAP09(2018)029

  const fluxSpectrums = useMemo(() => SNFluxSpectrum(nueAvgEnrg, anuAvgEnrg, nuxAvgEnrg, nueTotEnrg, anuTotEnrg, nuxTotEnrg, nueSpectrumShapeParam, anuSpectrumShapeParam, nuxSpectrumShapeParam), [nueAvgEnrg, anuAvgEnrg, nuxAvgEnrg, nueTotEnrg, anuTotEnrg, nuxTotEnrg, nueSpectrumShapeParam, anuSpectrumShapeParam, nuxSpectrumShapeParam])
  const oscillatedFluxSpectrums = oscillatedFluxSpectrum({fluxSpectrums})

  const pIBDUnoscillated = calcIBDSNRecord(NeutrinoType.electronAntineutrino, fluxSpectrums, tIBDpMin)
  const pIBDOscillatedNormal = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Normal], tIBDpMin)
  const pIBDOscillatedInverted = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Inverted], tIBDpMin)

  const AntiE12CIBDUnoscillated = calcIBDSNRecord(NeutrinoType.electronAntineutrino, fluxSpectrums, tIBDoxyMin, crossSection12CElectronAntineutrino, electronAntineutrino12CThresholdEnergy)
  const AntiE12CIBDOscillatedNormal = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Normal], tIBDoxyMin, crossSection12CElectronAntineutrino, electronAntineutrino12CThresholdEnergy)
  const AntiE12CIBDOscillatedInverted = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Inverted], tIBDoxyMin, crossSection12CElectronAntineutrino, electronAntineutrino12CThresholdEnergy)

  const E12CIBDUnoscillated = calcIBDSNRecord(NeutrinoType.electronNeutrino, fluxSpectrums, tIBDoxyMin, crossSection12CElectronNeutrino, electronNeutrino12CThresholdEnergy)
  const E12CIBDOscillatedNormal = calcIBDSNRecord(NeutrinoType.electronNeutrino, oscillatedFluxSpectrums[MassOrdering.Normal], tIBDoxyMin, crossSection12CElectronNeutrino, electronNeutrino12CThresholdEnergy)
  const E12CIBDOscillatedInverted = calcIBDSNRecord(NeutrinoType.electronNeutrino, oscillatedFluxSpectrums[MassOrdering.Inverted], tIBDoxyMin, crossSection12CElectronNeutrino, electronNeutrino12CThresholdEnergy)

  const AntiE16OIBDUnoscillated = calcIBDSNRecord(NeutrinoType.electronAntineutrino, fluxSpectrums, tIBDoxyMin, crossSection16OElectronAntineutrino, electronAntineutrino16OThresholdEnergy)
  const AntiE16OIBDOscillatedNormal = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Normal], tIBDoxyMin, crossSection16OElectronAntineutrino, electronAntineutrino16OThresholdEnergy)
  const AntiE16OIBDOscillatedInverted = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Inverted], tIBDoxyMin, crossSection16OElectronAntineutrino, electronAntineutrino16OThresholdEnergy)

  const E16OIBDUnoscillated = calcIBDSNRecord(NeutrinoType.electronNeutrino, fluxSpectrums, tIBDoxyMin, crossSection16OElectronNeutrino, electronNeutrino16OThresholdEnergy)
  const E16OIBDOscillatedNormal = calcIBDSNRecord(NeutrinoType.electronNeutrino, oscillatedFluxSpectrums[MassOrdering.Normal], tIBDoxyMin, crossSection16OElectronNeutrino, electronNeutrino16OThresholdEnergy)
  const E16OIBDOscillatedInverted = calcIBDSNRecord(NeutrinoType.electronNeutrino, oscillatedFluxSpectrums[MassOrdering.Inverted], tIBDoxyMin, crossSection16OElectronNeutrino, electronNeutrino16OThresholdEnergy)

  const E16OIBDUnoscillatedG1 = calcIBDSNRecord(NeutrinoType.electronNeutrino, fluxSpectrums, tIBDoxyMin, crossSection16OElectronNeutrinoG1, electronNeutrino16OThresholdEnergyG1)
  const E16OIBDOscillatedNormalG1 = calcIBDSNRecord(NeutrinoType.electronNeutrino, oscillatedFluxSpectrums[MassOrdering.Normal], tIBDoxyMin, crossSection16OElectronNeutrinoG1, electronNeutrino16OThresholdEnergyG1)
  const E16OIBDOscillatedInvertedG1 = calcIBDSNRecord(NeutrinoType.electronNeutrino, oscillatedFluxSpectrums[MassOrdering.Inverted], tIBDoxyMin, crossSection16OElectronNeutrinoG1, electronNeutrino16OThresholdEnergyG1)

  const E16OIBDUnoscillatedG2 = calcIBDSNRecord(NeutrinoType.electronNeutrino, fluxSpectrums, tIBDoxyMin, crossSection16OElectronNeutrinoG2, electronNeutrino16OThresholdEnergyG2)
  const E16OIBDOscillatedNormalG2 = calcIBDSNRecord(NeutrinoType.electronNeutrino, oscillatedFluxSpectrums[MassOrdering.Normal], tIBDoxyMin, crossSection16OElectronNeutrinoG2, electronNeutrino16OThresholdEnergyG2)
  const E16OIBDOscillatedInvertedG2 = calcIBDSNRecord(NeutrinoType.electronNeutrino, oscillatedFluxSpectrums[MassOrdering.Inverted], tIBDoxyMin, crossSection16OElectronNeutrinoG2, electronNeutrino16OThresholdEnergyG2)

  const E16OIBDUnoscillatedG3 = calcIBDSNRecord(NeutrinoType.electronNeutrino, fluxSpectrums, tIBDoxyMin, crossSection16OElectronNeutrinoG3, electronNeutrino16OThresholdEnergyG3)
  const E16OIBDOscillatedNormalG3 = calcIBDSNRecord(NeutrinoType.electronNeutrino, oscillatedFluxSpectrums[MassOrdering.Normal], tIBDoxyMin, crossSection16OElectronNeutrinoG3, electronNeutrino16OThresholdEnergyG3)
  const E16OIBDOscillatedInvertedG3 = calcIBDSNRecord(NeutrinoType.electronNeutrino, oscillatedFluxSpectrums[MassOrdering.Inverted], tIBDoxyMin, crossSection16OElectronNeutrinoG3, electronNeutrino16OThresholdEnergyG3)

  const E16OIBDUnoscillatedG4 = calcIBDSNRecord(NeutrinoType.electronNeutrino, fluxSpectrums, tIBDoxyMin, crossSection16OElectronNeutrinoG4, electronNeutrino16OThresholdEnergyG4)
  const E16OIBDOscillatedNormalG4 = calcIBDSNRecord(NeutrinoType.electronNeutrino, oscillatedFluxSpectrums[MassOrdering.Normal], tIBDoxyMin, crossSection16OElectronNeutrinoG4, electronNeutrino16OThresholdEnergyG4)
  const E16OIBDOscillatedInvertedG4 = calcIBDSNRecord(NeutrinoType.electronNeutrino, oscillatedFluxSpectrums[MassOrdering.Inverted], tIBDoxyMin, crossSection16OElectronNeutrinoG4, electronNeutrino16OThresholdEnergyG4)

  const AntiE16OIBDUnoscillatedG1 = calcIBDSNRecord(NeutrinoType.electronAntineutrino, fluxSpectrums, tIBDoxyMin, crossSection16OElectronAntineutrinoG1, electronAntineutrino16OThresholdEnergyG1)
  const AntiE16OIBDOscillatedNormalG1 = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Normal], tIBDoxyMin, crossSection16OElectronAntineutrinoG1, electronAntineutrino16OThresholdEnergyG1)
  const AntiE16OIBDOscillatedInvertedG1 = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Inverted], tIBDoxyMin, crossSection16OElectronAntineutrinoG1, electronAntineutrino16OThresholdEnergyG1)

  const AntiE16OIBDUnoscillatedG2 = calcIBDSNRecord(NeutrinoType.electronAntineutrino, fluxSpectrums, tIBDoxyMin, crossSection16OElectronAntineutrinoG2, electronAntineutrino16OThresholdEnergyG2)
  const AntiE16OIBDOscillatedNormalG2 = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Normal], tIBDoxyMin, crossSection16OElectronAntineutrinoG2, electronAntineutrino16OThresholdEnergyG2)
  const AntiE16OIBDOscillatedInvertedG2 = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Inverted], tIBDoxyMin, crossSection16OElectronAntineutrinoG2, electronAntineutrino16OThresholdEnergyG2)

  const AntiE16OIBDUnoscillatedG3 = calcIBDSNRecord(NeutrinoType.electronAntineutrino, fluxSpectrums, tIBDoxyMin, crossSection16OElectronAntineutrinoG3, electronAntineutrino16OThresholdEnergyG3)
  const AntiE16OIBDOscillatedNormalG3 = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Normal], tIBDoxyMin, crossSection16OElectronAntineutrinoG3, electronAntineutrino16OThresholdEnergyG3)
  const AntiE16OIBDOscillatedInvertedG3 = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Inverted], tIBDoxyMin, crossSection16OElectronAntineutrinoG3, electronAntineutrino16OThresholdEnergyG3)

  const AntiE16OIBDUnoscillatedG4 = calcIBDSNRecord(NeutrinoType.electronAntineutrino, fluxSpectrums, tIBDoxyMin, crossSection16OElectronAntineutrinoG4, electronAntineutrino16OThresholdEnergyG4)
  const AntiE16OIBDOscillatedNormalG4 = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Normal], tIBDoxyMin, crossSection16OElectronAntineutrinoG4, electronAntineutrino16OThresholdEnergyG4)
  const AntiE16OIBDOscillatedInvertedG4 = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Inverted], tIBDoxyMin, crossSection16OElectronAntineutrinoG4, electronAntineutrino16OThresholdEnergyG4)

  const ESpNue = calcSNRecord(NeutrinoType.electronNeutrino, NeutrinoTarget.proton, tESpMin, fluxSpectrums)
  const ESpAnu = calcSNRecord(NeutrinoType.electronAntineutrino, NeutrinoTarget.proton, tESpMin, fluxSpectrums)
  const ESpNux = calcSNRecord(NeutrinoType.muTauNeutrino, NeutrinoTarget.proton, tESpMin, fluxSpectrums)
  const ESpAnx = calcSNRecord(NeutrinoType.muTauAntineutrino, NeutrinoTarget.proton, tESpMin, fluxSpectrums)

  const ESEfor0O = calcSNRecord(NeutrinoType.electronNeutrino, NeutrinoTarget.electron, tESeMin, fluxSpectrums)
  const ESEforNO = calcSNRecord(NeutrinoType.electronNeutrino, NeutrinoTarget.electron, tESeMin, oscillatedFluxSpectrums[MassOrdering.Normal])
  const ESEforIO = calcSNRecord(NeutrinoType.electronNeutrino, NeutrinoTarget.electron, tESeMin, oscillatedFluxSpectrums[MassOrdering.Inverted])

  const AntiESEfor0O = calcSNRecord(NeutrinoType.electronAntineutrino, NeutrinoTarget.electron, tESeMin, fluxSpectrums)
  const AntiESEforNO = calcSNRecord(NeutrinoType.electronAntineutrino, NeutrinoTarget.electron, tESeMin, oscillatedFluxSpectrums[MassOrdering.Normal])
  const AntiESEforIO = calcSNRecord(NeutrinoType.electronAntineutrino, NeutrinoTarget.electron, tESeMin, oscillatedFluxSpectrums[MassOrdering.Inverted])

  const NuxESEfor0O = calcSNRecord(NeutrinoType.muTauNeutrino, NeutrinoTarget.electron, tESeMin, fluxSpectrums)
  const NuxESEforNO = calcSNRecord(NeutrinoType.muTauNeutrino, NeutrinoTarget.electron, tESeMin, oscillatedFluxSpectrums[MassOrdering.Normal])
  const NuxESEforIO = calcSNRecord(NeutrinoType.muTauNeutrino, NeutrinoTarget.electron, tESeMin, oscillatedFluxSpectrums[MassOrdering.Inverted])

  const AnxESEfor0O = calcSNRecord(NeutrinoType.muTauAntineutrino, NeutrinoTarget.electron, tESeMin, fluxSpectrums)
  const AnxESEforNO = calcSNRecord(NeutrinoType.muTauAntineutrino, NeutrinoTarget.electron, tESeMin, oscillatedFluxSpectrums[MassOrdering.Normal])
  const AnxESEforIO = calcSNRecord(NeutrinoType.muTauAntineutrino, NeutrinoTarget.electron, tESeMin, oscillatedFluxSpectrums[MassOrdering.Inverted])

  return (
    <div>
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
      <SpectrumShapeParameter
        nueSpectrumShapeParam={nueSpectrumShapeParam}
        setNueSpectrumShapeParam={setNueSpectrumShapeParam}
        anuSpectrumShapeParam={anuSpectrumShapeParam}
        setAnuSpectrumShapeParam={setAnuSpectrumShapeParam}
        nuxSpectrumShapeParam={nuxSpectrumShapeParam}
        setNuxSpectrumShapeParam={setNuxSpectrumShapeParam}
      />
      <SupernovaFluxPlots
        fluxSpectrums={fluxSpectrums}
        nueAvgEnrg={nueAvgEnrg}
        anuAvgEnrg={anuAvgEnrg}
        nuxAvgEnrg={nuxAvgEnrg}
        nueTotEnrg={nueTotEnrg}
        anuTotEnrg={anuTotEnrg}
        nuxTotEnrg={nuxTotEnrg}
        nueSpectrumShapeParam={nueSpectrumShapeParam}
        anuSpectrumShapeParam={anuSpectrumShapeParam}
        nuxSpectrumShapeParam={nuxSpectrumShapeParam}
      />
      <SupernovaOscillatedFluxPlots
        oscillatedFluxSpectrums={oscillatedFluxSpectrums}
        nueAvgEnrg={nueAvgEnrg}
        anuAvgEnrg={anuAvgEnrg}
        nuxAvgEnrg={nuxAvgEnrg}
        nueTotEnrg={nueTotEnrg}
        anuTotEnrg={anuTotEnrg}
        nuxTotEnrg={nuxTotEnrg}
        nueSpectrumShapeParam={nueSpectrumShapeParam}
        anuSpectrumShapeParam={anuSpectrumShapeParam}
        nuxSpectrumShapeParam={nuxSpectrumShapeParam}
      />
      <SupernovaOscillatedInvertedFluxPlots
        oscillatedFluxSpectrums={oscillatedFluxSpectrums}
        nueAvgEnrg={nueAvgEnrg}
        anuAvgEnrg={anuAvgEnrg}
        nuxAvgEnrg={nuxAvgEnrg}
        nueTotEnrg={nueTotEnrg}
        anuTotEnrg={anuTotEnrg}
        nuxTotEnrg={nuxTotEnrg}
        nueSpectrumShapeParam={nueSpectrumShapeParam}
        anuSpectrumShapeParam={anuSpectrumShapeParam}
        nuxSpectrumShapeParam={nuxSpectrumShapeParam}
      />
      <NeutrinoElectronElasticScatteringCrossSection 
        ESpNue={ESpNue}
        ESpAnu={ESpAnu}
        ESEforNO={ESEforNO}
        AntiESEforNO={AntiESEforNO}
        NuxESEforNO={NuxESEforNO}
        AnxESEforNO={AnxESEforNO}
        AntiE12CIBDUnoscillated={AntiE12CIBDUnoscillated}
        E12CIBDUnoscillated={E12CIBDUnoscillated}
        AntiE16OIBDUnoscillated={AntiE16OIBDUnoscillated}
        E16OIBDUnoscillated={E16OIBDUnoscillated}
      />
      <SupernovaPlotsIBDnue16O
        E16OIBDUnoscillatedG1 = {E16OIBDUnoscillatedG1}
        E16OIBDOscillatedNormalG1 = {E16OIBDOscillatedNormalG1}
        E16OIBDOscillatedInvertedG1 = {E16OIBDOscillatedInvertedG1}
        E16OIBDUnoscillatedG2 = {E16OIBDUnoscillatedG2}
        E16OIBDOscillatedNormalG2 = {E16OIBDOscillatedNormalG2}
        E16OIBDOscillatedInvertedG2 = {E16OIBDOscillatedInvertedG2}
        E16OIBDUnoscillatedG3 = {E16OIBDUnoscillatedG3}
        E16OIBDOscillatedNormalG3 = {E16OIBDOscillatedNormalG3}
        E16OIBDOscillatedInvertedG3 = {E16OIBDOscillatedInvertedG3}
        E16OIBDUnoscillatedG4 = {E16OIBDUnoscillatedG4}
        E16OIBDOscillatedNormalG4 = {E16OIBDOscillatedNormalG4}
        E16OIBDOscillatedInvertedG4 = {E16OIBDOscillatedInvertedG4}
        nueAvgEnrg={nueAvgEnrg}
        anuAvgEnrg={anuAvgEnrg}
        nuxAvgEnrg={nuxAvgEnrg}
        nueTotEnrg={nueTotEnrg}
        anuTotEnrg={anuTotEnrg}
        nuxTotEnrg={nuxTotEnrg}
        nueSpectrumShapeParam={nueSpectrumShapeParam}
        anuSpectrumShapeParam={anuSpectrumShapeParam}
        nuxSpectrumShapeParam={nuxSpectrumShapeParam}
      />
      <SupernovaPlotsIBDnuebar16O
        AntiE16OIBDUnoscillatedG1 = {AntiE16OIBDUnoscillatedG1}
        AntiE16OIBDOscillatedNormalG1 = {AntiE16OIBDOscillatedNormalG1}
        AntiE16OIBDOscillatedInvertedG1 = {AntiE16OIBDOscillatedInvertedG1}
        AntiE16OIBDUnoscillatedG2 = {AntiE16OIBDUnoscillatedG2}
        AntiE16OIBDOscillatedNormalG2 = {AntiE16OIBDOscillatedNormalG2}
        AntiE16OIBDOscillatedInvertedG2 = {AntiE16OIBDOscillatedInvertedG2}
        AntiE16OIBDUnoscillatedG3 = {AntiE16OIBDUnoscillatedG3}
        AntiE16OIBDOscillatedNormalG3 = {AntiE16OIBDOscillatedNormalG3}
        AntiE16OIBDOscillatedInvertedG3 = {AntiE16OIBDOscillatedInvertedG3}
        AntiE16OIBDUnoscillatedG4 = {AntiE16OIBDUnoscillatedG4}
        AntiE16OIBDOscillatedNormalG4 = {AntiE16OIBDOscillatedNormalG4}
        AntiE16OIBDOscillatedInvertedG4 = {AntiE16OIBDOscillatedInvertedG4}
        nueAvgEnrg={nueAvgEnrg}
        anuAvgEnrg={anuAvgEnrg}
        nuxAvgEnrg={nuxAvgEnrg}
        nueTotEnrg={nueTotEnrg}
        anuTotEnrg={anuTotEnrg}
        nuxTotEnrg={nuxTotEnrg}
        nueSpectrumShapeParam={nueSpectrumShapeParam}
        anuSpectrumShapeParam={anuSpectrumShapeParam}
        nuxSpectrumShapeParam={nuxSpectrumShapeParam}
      />
      <SupernovaPlotsIBD 
        pIBDUnoscillated={pIBDUnoscillated} 
        pIBDOscillatedNormal={pIBDOscillatedNormal} 
        pIBDOscillatedInverted={pIBDOscillatedInverted}
        AntiE12CIBDUnoscillated={AntiE12CIBDUnoscillated}
        AntiE12CIBDOscillatedNormal={AntiE12CIBDOscillatedNormal}
        AntiE12CIBDOscillatedInverted={AntiE12CIBDOscillatedInverted}
        E12CIBDUnoscillated = {E12CIBDUnoscillated}
        E12CIBDOscillatedNormal = {E12CIBDOscillatedNormal}
        E12CIBDOscillatedInverted = {E12CIBDOscillatedInverted}
        nueAvgEnrg={nueAvgEnrg}
        anuAvgEnrg={anuAvgEnrg}
        nuxAvgEnrg={nuxAvgEnrg}
        nueTotEnrg={nueTotEnrg}
        anuTotEnrg={anuTotEnrg}
        nuxTotEnrg={nuxTotEnrg}
        nueSpectrumShapeParam={nueSpectrumShapeParam}
        anuSpectrumShapeParam={anuSpectrumShapeParam}
        nuxSpectrumShapeParam={nuxSpectrumShapeParam}
      />
      <SupernovaNusEventsIBD
        pIBDUnoscillated={pIBDUnoscillated} 
        pIBDOscillatedNormal={pIBDOscillatedNormal} 
        pIBDOscillatedInverted={pIBDOscillatedInverted} 
        AntiE12CIBDUnoscillated={AntiE12CIBDUnoscillated}
        AntiE12CIBDOscillatedNormal={AntiE12CIBDOscillatedNormal}
        AntiE12CIBDOscillatedInverted={AntiE12CIBDOscillatedInverted}
        E12CIBDUnoscillated = {E12CIBDUnoscillated}
        E12CIBDOscillatedNormal = {E12CIBDOscillatedNormal}
        E12CIBDOscillatedInverted = {E12CIBDOscillatedInverted}
        AntiE16OIBDUnoscillated={AntiE16OIBDUnoscillated}
        AntiE16OIBDOscillatedNormal={AntiE16OIBDOscillatedNormal}
        AntiE16OIBDOscillatedInverted={AntiE16OIBDOscillatedInverted}
        E16OIBDUnoscillated = {E16OIBDUnoscillated}
        E16OIBDOscillatedNormal = {E16OIBDOscillatedNormal}
        E16OIBDOscillatedInverted = {E16OIBDOscillatedInverted}
        E16OIBDUnoscillatedG1 = {E16OIBDUnoscillatedG1}
        E16OIBDOscillatedNormalG1 = {E16OIBDOscillatedNormalG1}
        E16OIBDOscillatedInvertedG1 = {E16OIBDOscillatedInvertedG1}
        E16OIBDUnoscillatedG2 = {E16OIBDUnoscillatedG2}
        E16OIBDOscillatedNormalG2 = {E16OIBDOscillatedNormalG2}
        E16OIBDOscillatedInvertedG2 = {E16OIBDOscillatedInvertedG2}
        E16OIBDUnoscillatedG3 = {E16OIBDUnoscillatedG3}
        E16OIBDOscillatedNormalG3 = {E16OIBDOscillatedNormalG3}
        E16OIBDOscillatedInvertedG3 = {E16OIBDOscillatedInvertedG3}
        E16OIBDUnoscillatedG4 = {E16OIBDUnoscillatedG4}
        E16OIBDOscillatedNormalG4 = {E16OIBDOscillatedNormalG4}
        E16OIBDOscillatedInvertedG4 = {E16OIBDOscillatedInvertedG4}
        AntiE16OIBDUnoscillatedG1 = {AntiE16OIBDUnoscillatedG1}
        AntiE16OIBDOscillatedNormalG1 = {AntiE16OIBDOscillatedNormalG1}
        AntiE16OIBDOscillatedInvertedG1 = {AntiE16OIBDOscillatedInvertedG1}
        AntiE16OIBDUnoscillatedG2 = {AntiE16OIBDUnoscillatedG2}
        AntiE16OIBDOscillatedNormalG2 = {AntiE16OIBDOscillatedNormalG2}
        AntiE16OIBDOscillatedInvertedG2 = {AntiE16OIBDOscillatedInvertedG2}
        AntiE16OIBDUnoscillatedG3 = {AntiE16OIBDUnoscillatedG3}
        AntiE16OIBDOscillatedNormalG3 = {AntiE16OIBDOscillatedNormalG3}
        AntiE16OIBDOscillatedInvertedG3 = {AntiE16OIBDOscillatedInvertedG3}
        AntiE16OIBDUnoscillatedG4 = {AntiE16OIBDUnoscillatedG4}
        AntiE16OIBDOscillatedNormalG4 = {AntiE16OIBDOscillatedNormalG4}
        AntiE16OIBDOscillatedInvertedG4 = {AntiE16OIBDOscillatedInvertedG4}
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
        ESEfor0O={ESEfor0O}
        ESEforNO={ESEforNO}
        ESEforIO={ESEforIO}
        AntiESEfor0O={AntiESEfor0O}
        AntiESEforNO={AntiESEforNO}
        AntiESEforIO={AntiESEforIO}
        NuxESEfor0O={NuxESEfor0O}
        NuxESEforNO={NuxESEforNO}
        NuxESEforIO={NuxESEforIO}
        AnxESEfor0O={AnxESEfor0O}
        AnxESEforNO={AnxESEforNO}
        AnxESEforIO={AnxESEforIO}
        tESeMin={tESeMin}
        setTESeMin={setTESeMin}
        tESpMin={tESpMin}
        setTESpMin={setTESpMin}
      />
      <SupernovaNusCEvNS
        nucleus={nucleus}
        setNucleus={setNucleus}
        tESnMin={tESnMin}
        setTESnMin={setTESnMin}
        fluxSpectrums={fluxSpectrums}
      />
    </div>
  )
})
