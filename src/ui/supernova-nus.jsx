import React, {useState} from "react";
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

const SupernovaNusCEvNS = ({ nucleus, setNucleus, tESnMin, fluxSpectrums }) => {

  //const events = CEvNSEvents(Elements[nucleus], tESnMin/1000, fluxSpectrums); // KeV to MeV?
  const events = (CEvNSEventsElemental(Elements[nucleus], tESnMin/1000, fluxSpectrums))

  const isotopicContributions = Object.entries(events).filter(([key, value]) => key !== "total").map(([isotope, value]) => {
    return (
      <tr>
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
        Core Collapse SN Neutrino CEvNS Events (/1000 kg)
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
          </Form>
        </Provider>
      </Card.Body>
    </Card>
  );
};

const SupernovaNusEvents = ({
  IBDUnoscilated, 
  IBDOscilatedNormal, 
  IBDOscilatedInverted,
  ESpNue,
  ESpAnu,
  ESpNux,
  ESpAnx,
  ESEforNO,
  ESEforIO,
  AntiESEforNO, 
  AntiESEforIO,
  NuxESEforNO,
  NuxESEforIO,
  AnxESEforNO,
  AnxESEforIO,
}) => {
  return (
    <Card>
      <Card.Header>
        Core Collapse SN Neutrino IBD/ES Events (/10<sup>32</sup> targets)
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
                  <td>ν<sub>e</sub> + <sup>16</sup>O</td>
                  <td>
                    N<sup>0</sup> = 
                  </td>
                  <td>
                    N<sub>NO</sub> = 
                  </td>
                  <td>
                    N<sub>IO</sub> = 
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>ν̅<sub>e</sub> + <sup>16</sup>O</td>
                  <td>
                    N<sup>0</sup> = 
                  </td>
                  <td>
                    N<sub>NO</sub> = 
                  </td>
                  <td>
                    N<sub>IO</sub> = 
                  </td>
                  <td></td>
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
              </tbody>
            </Table>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};

const SupernovaNusIBDpTmin = ({ tIBDpMin, setTIBDpMin }) => {
  return (
    <Card>
      <Card.Header>ν̅<sub>e</sub> + p: Positron Minimum Kinetic Energy</Card.Header>
      <Card.Body>
        <Form.Group controlId="teplus_min">
          <Form.Label>
            T<sub>min</sub> = {tIBDpMin} MeV
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
      </Card.Body>
    </Card>
  );
};

const SupernovaNusIBDoxyTmin = ({ tIBDoxyMin, setTIBDoxyMin }) => {
  return (
    <Card>
      <Card.Header>ν<sub>e</sub> + <sup>16</sup>O, ν̅<sub>e</sub> + <sup>16</sup>O: e<sup>-</sup>, e<sup>+</sup> Minimum Kinetic Energy</Card.Header>
      <Card.Body>
        <Form.Group controlId="teoxy_min">
          <Form.Label>
            T<sub>min</sub> = {tIBDoxyMin} MeV
          </Form.Label>
          <InputGroup>
            <Form.Control
              value={tIBDoxyMin}
              type="range"
              step={0.5}
              min={0}
              max={10}
              onChange={(event) => setTIBDoxyMin(event.target.value)}
            />
          </InputGroup>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

const SupernovaNusESeTmin = ({ tESeMin, setTESeMin }) => {
  return (
    <Card>
      <Card.Header>ν + e<sup>-</sup>: Electron Minimum Kinetic Energy</Card.Header>
      <Card.Body>
        <Form.Group controlId="te_min">
          <Form.Label>
            T<sub>min</sub> = {tESeMin} MeV
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
      </Card.Body>
    </Card>
  );
};

const SupernovaNusESpTmin = ({ tESpMin, setTESpMin }) => {
  return (
    <Card>
      <Card.Header>ν + p: Proton Minimum Kinetic Energy</Card.Header>
      <Card.Body>
        <Form.Group controlId="tp_min">
          <Form.Label>
            T<sub>min</sub> = {tESpMin} MeV
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
      </Card.Body>
    </Card>
  );
};

const SupernovaNusESnTmin = ({ tESnMin, setTESnMin }) => {
  return (
    <Card>
      <Card.Header>CEvNS: Nucleus Minimum Kinetic Energy</Card.Header>
      <Card.Body>
        <Form.Group controlId="tn_min">
          <Form.Label>
            T<sub>min</sub> = {tESnMin} keV
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
              The non-oscillated flux spectrum of neutrinos of a given species{" "}
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

const NueAvgEnergy = ({ nueAvgEnrg, setAvgEnrgNue }) => {
  return (
    <Card>
      <Card.Header>ν<sub>e</sub> Average Energy</Card.Header>
      <Card.Body>
        <Form.Group controlId="avgenergy_nue">
          <Form.Label>
            E<sub>avg</sub> = {nueAvgEnrg} MeV
          </Form.Label>
          <InputGroup>
            <Form.Control
              value={nueAvgEnrg}
              type="range"
              step={0.1}
              min={7}
              max={12}
              onChange={(event) => setAvgEnrgNue(event.target.value)}
            />
          </InputGroup>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

const AnuAvgEnergy = ({ anuAvgEnrg, setAvgEnrgAnu }) => {
  return (
    <Card>
      <Card.Header>ν̅<sub>e</sub> Average Energy</Card.Header>
      <Card.Body>
        <Form.Group controlId="avgenergy_anu">
          <Form.Label>
            E<sub>avg</sub> = {anuAvgEnrg} MeV
          </Form.Label>
          <InputGroup>
            <Form.Control
              value={anuAvgEnrg}
              type="range"
              step={0.1}
              min={10}
              max={15}
              onChange={(event) => setAvgEnrgAnu(event.target.value)}
            />
          </InputGroup>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

const NuxAvgEnergy = ({ nuxAvgEnrg, setAvgEnrgNux }) => {
  return (
    <Card>
      <Card.Header>ν<sub>x</sub> Average Energy</Card.Header>
      <Card.Body>
        <Form.Group controlId="avgenergy_nux">
          <Form.Label>
            E<sub>avg</sub> = {nuxAvgEnrg} MeV
          </Form.Label>
          <InputGroup>
            <Form.Control
              value={nuxAvgEnrg}
              type="range"
              step={0.1}
              min={13}
              max={18}
              onChange={(event) => setAvgEnrgNux(event.target.value)}
            />
          </InputGroup>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

const NueTotEnergy = ({ nueTotEnrg, setTotEnrgNue }) => {
  return (
    <Card>
      <Card.Header>Total Energy of ν<sub>e</sub></Card.Header>
      <Card.Body>
        <Form.Group controlId="totenergy_nue">
          <Form.Label>
            E<sub>tot</sub> = {nueTotEnrg} x10<sup>52</sup> erg
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
      </Card.Body>
    </Card>
  );
};

const AnuTotEnergy = ({ anuTotEnrg, setTotEnrgAnu }) => {
  return (
    <Card>
      <Card.Header>Total Energy of ν̅<sub>e</sub></Card.Header>
      <Card.Body>
        <Form.Group controlId="totenergy_anu">
          <Form.Label>
            E<sub>tot</sub> = {anuTotEnrg} x10<sup>52</sup> erg
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
      </Card.Body>
    </Card>
  );
};

const NuxTotEnergy = ({ nuxTotEnrg, setTotEnrgNux }) => {
  return (
    <Card>
      <Card.Header>Total Energy of ν<sub>x</sub></Card.Header>
      <Card.Body>
        <Form.Group controlId="totenergy_nux">
          <Form.Label>
            E<sub>tot</sub> = {nuxTotEnrg} x10<sup>52</sup> erg
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

  // TODO move to state
  // inital guesses 12, 15, 18 MeV too hot and now reduced
  // new values from P.C. Divari, Journal of Cosmology and Astroparticle Physics, JCAP09(2018)029
  const avgNrgNue = 9.5;
  const avgNrgAnu = 12;
  const avgNrgNux = 15.6;
  const totNrgNue = 5;
  const totNrgAnu = 5;
  const totNrgNux = 5;

  const fluxSpectrums = SNFluxSpectrum(avgNrgNue, avgNrgAnu, avgNrgNux, totNrgNue, totNrgAnu, totNrgNux) 
  const oscillatedFluxSpectrums = oscillatedFluxSpectrum({fluxSpectrums})

  const IBDUnoscilated = calcIBDSNRecord(NeutrinoType.electronAntineutrino, fluxSpectrums, tIBDpMin)
  const IBDOscilatedNormal = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Normal], tIBDpMin)
  const IBDOscilatedInverted = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Inverted], tIBDpMin)

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
        fluxSpectrums={fluxSpectrums}
      />
      <SupernovaNusESnTmin
        tESnMin={tESnMin}
        setTESnMin={setTESnMin}
      />
      <SupernovaNusEvents
      IBDUnoscilated={IBDUnoscilated} 
      IBDOscilatedNormal={IBDOscilatedNormal} 
      IBDOscilatedInverted={IBDOscilatedInverted} 
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
      /> 
      <SupernovaNusIBDpTmin
        tIBDpMin={tIBDpMin}
        setTIBDpMin={setTIBDpMin}
      />
      <SupernovaNusIBDoxyTmin
        tIBDoxyMin={tIBDoxyMin}
        setTIBDoxyMin={setTIBDoxyMin}
      />
      <SupernovaNusESpTmin
        tESpMin={tESpMin}
        setTESpMin={setTESpMin}
      />
      <SupernovaNusESeTmin
        tESeMin={tESeMin}
        setTESeMin={setTESeMin}
      />
      <SupernovaNusPane  />
      <NueAvgEnergy
        nueAvgEnrg={nueAvgEnrg}
        setAvgEnrgNue={setAvgEnrgNue}
      />
      <AnuAvgEnergy
        anuAvgEnrg={anuAvgEnrg}
        setAvgEnrgAnu={setAvgEnrgAnu}
      />
      <NuxAvgEnergy
        nuxAvgEnrg={nuxAvgEnrg}
        setAvgEnrgNux={setAvgEnrgNux}
      />
      <NueTotEnergy
        nueTotEnrg={nueTotEnrg}
        setTotEnrgNue={setTotEnrgNue}
      />
      <AnuTotEnergy
        anuTotEnrg={anuTotEnrg}
        setTotEnrgAnu={setTotEnrgAnu}
      />
      <NuxTotEnergy
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
      />
    </div>
  )
})
