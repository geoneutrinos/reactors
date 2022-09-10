import React, {useState} from "react";
import { Card, Form, InputGroup, Table } from "react-bootstrap";

import { Num } from ".";

import { Node, Provider } from "@nteract/mathjax";

import {
  CEvNSEvents,
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

  const events = CEvNSEvents(Elements[nucleus], tESnMin/1000, fluxSpectrums); // KeV to MeV?

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
                  <td>{ElementsUI[nucleus]}</td>
                  <td>
                    N(ν<sub>e</sub>) ={" "}
                    <Num v={events[NeutrinoType.electronNeutrino]} p={2} />
                  </td>
                  <td>
                    N(ν̅<sub>e</sub>) ={" "}
                    <Num v={events[NeutrinoType.electronAntineutrino]} p={2} />
                  </td>
                  <td>
                    N(ν<sub>x</sub>) ={" "}
                    <Num v={events[NeutrinoType.muTauNeutrino]} p={2} />
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </div>
          <Form noValidate>
            <Form.Group controlId="set_nucleus">
              <Form.Label> Nucleus </Form.Label>
              <Form.Control as="select" onChange={(event) => setNucleus(event.target.value)} value={nucleus}>
                <option value={Elements.Ar40.key}>Argon-40</option>
                <option value={Elements.Ge70.key}>Germanium-70</option>
                <option value={Elements.Ge72.key}>Germanium-72</option>
                <option value={Elements.Ge73.key}>Germanium-73</option>
                <option value={Elements.Ge74.key}>Germanium-74</option>
                <option value={Elements.Ge76.key}>Germanium-76</option>
                <option value={Elements.I127.key}>Iodine-127</option>
                <option value={Elements.Xe128.key}>Xenon-128</option>
                <option value={Elements.Xe129.key}>Xenon-129</option>
                <option value={Elements.Xe130.key}>Xenon-130</option>
                <option value={Elements.Xe131.key}>Xenon-131</option>                
                <option value={Elements.Xe132.key}>Xenon-132</option>
                <option value={Elements.Xe134.key}>Xenon-134</option>
                <option value={Elements.Xe136.key}>Xenon-136</option>
                <option value={Elements.Cs133.key}>Cesium-133</option>
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
                  <td>IBD</td>
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
                  <td>pES</td>
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
                  <td>eES NO</td>
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
                  <td>eES IO</td>
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

const SupernovaNusESeTmin = ({ tESeMin, setTESeMin }) => {
  return (
    <Card>
      <Card.Header>eES: Electron Minimum Kinetic Energy</Card.Header>
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
      <Card.Header>pES: Proton Minimum Kinetic Energy</Card.Header>
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
              Initially assume <Node inline>{String.raw`D = 10`}</Node> kpc,{" "}
              <Node
                inline
              >{String.raw`E_{\nu_{\alpha}}^\mathrm{tot} = 5\times10^{52}`}</Node>{" "}
              erg, <Node inline>{String.raw`\beta = 4`}</Node> ,{" "}
              <Node
                inline
              >{String.raw`\langle E_{\nu_{\mathrm{e}}} \rangle = 12`}</Node>{" "}
              MeV,{" "}
              <Node
                inline
              >{String.raw`\langle E_{\overline{\nu}_{\mathrm{e}}} \rangle = 15`}</Node>{" "}
              MeV, and{" "}
              <Node inline>{String.raw`\langle E_{\nu_{x}} \rangle = 18`}</Node>{" "}
              MeV.
            </p>
            <p>
              Oscillation effects depend on the neutrino mass ordering.
              <br />
              For normal ordering (NO) with{" "}
              <Node inline>{String.raw`m_3 > m_2 > m_1`}</Node>{" "}
              <Node>{String.raw`\begin{aligned}
                & \Phi_{\nu_{\mathrm{e}}} = \Phi^0_{\nu_{x}} \\
                & \Phi_{\overline{\nu}_{\mathrm{e}}} = \Phi^0_{\overline{\nu}_{\mathrm{e}}}\cos^2\theta_{12} + \Phi^0_{\nu_{x}}\sin^2\theta_{12} \\
                & \Phi_{\nu_{x}} = \frac1{4}\big(\Phi^0_{\nu_{x}}(2+\cos^2\theta_{12}) + \Phi^0_{\nu_{\mathrm{e}}} + \Phi^0_{\overline{\nu}_{\mathrm{e}}}\sin^2\theta_{12}\big)
                \end{aligned}`}</Node>
            </p>
            <p>
              For inverted ordering (IO) with{" "}
              <Node inline>{String.raw`m_2 > m_1 > m_3`}</Node>{" "}
              <Node>{String.raw`\begin{aligned}
                & \Phi_{\nu_{\mathrm{e}}} = \Phi^0_{\nu_{\mathrm{e}}}\sin^2\theta_{12} + \Phi^0_{\nu_{x}}\cos^2\theta_{12} \\
                & \Phi_{\overline{\nu}_{\mathrm{e}}} = \Phi^0_{\nu_{x}} \\
                & \Phi_{\nu_{x}} = \frac1{4}\big(\Phi^0_{\nu_{x}}(2+\sin^2\theta_{12}) + \Phi^0_{\overline{\nu}_{\mathrm{e}}} + \Phi^0_{\nu_{\mathrm{e}}}\cos^2\theta_{12}\big)
                \end{aligned}`}</Node>
            </p>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};

export const SupernovaNus = React.memo(() => {
  const [tESeMin, setTESeMin] = useState(0.0);
  const [tESpMin, setTESpMin] = useState(0.0);
  const [tESnMin, setTESnMin] = useState(0.0);
  const [nucleus, setNucleus] = useState(Elements.Xe132.key);

  // TODO move to state
  const avgNrgNue = 12;
  const avgNrgAnu = 15;
  const avgNrgNux = 18;

  const fluxSpectrums = SNFluxSpectrum(avgNrgNue, avgNrgAnu, avgNrgNux) 
  const oscillatedFluxSpectrums = oscillatedFluxSpectrum({fluxSpectrums})

  const IBDUnoscilated = calcIBDSNRecord(NeutrinoType.electronAntineutrino, fluxSpectrums)
  const IBDOscilatedNormal = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Normal])
  const IBDOscilatedInverted = calcIBDSNRecord(NeutrinoType.electronAntineutrino, oscillatedFluxSpectrums[MassOrdering.Inverted])

  const ESpNue = calcSNRecord(NeutrinoType.electronNeutrino, NeutrinoTarget.proton, tESpMin, fluxSpectrums)
  const ESpAnu = calcSNRecord(NeutrinoType.electronAntineutrino, NeutrinoTarget.proton, tESpMin, fluxSpectrums)
  const ESpNux = calcSNRecord(NeutrinoType.muTauNeutrino, NeutrinoTarget.proton, tESpMin, fluxSpectrums)
  const ESpAnx = calcSNRecord(NeutrinoType.muTauAntineutrino, NeutrinoTarget.proton, tESpMin, fluxSpectrums)

  const ESEforNO = calcSNRecord(NeutrinoType.electronNeutrino, NeutrinoTarget.electron, 0, oscillatedFluxSpectrums[MassOrdering.Normal])
  const ESEforIO = calcSNRecord(NeutrinoType.electronNeutrino, NeutrinoTarget.electron, 0, oscillatedFluxSpectrums[MassOrdering.Inverted])

  const AntiESEforNO = calcSNRecord(NeutrinoType.electronAntineutrino, NeutrinoTarget.electron, 0, oscillatedFluxSpectrums[MassOrdering.Normal])
  const AntiESEforIO = calcSNRecord(NeutrinoType.electronAntineutrino, NeutrinoTarget.electron, 0, oscillatedFluxSpectrums[MassOrdering.Inverted])

  const NuxESEforNO = calcSNRecord(NeutrinoType.muTauNeutrino, NeutrinoTarget.electron, 0, oscillatedFluxSpectrums[MassOrdering.Normal])
  const NuxESEforIO = calcSNRecord(NeutrinoType.muTauNeutrino, NeutrinoTarget.electron, 0, oscillatedFluxSpectrums[MassOrdering.Inverted])

  const AnxESEforNO = calcSNRecord(NeutrinoType.muTauAntineutrino, NeutrinoTarget.electron, 0, oscillatedFluxSpectrums[MassOrdering.Normal])
  const AnxESEforIO = calcSNRecord(NeutrinoType.muTauAntineutrino, NeutrinoTarget.electron, 0, oscillatedFluxSpectrums[MassOrdering.Inverted])

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
      <SupernovaNusESeTmin
        tESeMin={tESeMin}
        setTESeMin={setTESeMin}
      />
      <SupernovaNusESpTmin
        tESpMin={tESpMin}
        setTESpMin={setTESpMin}
      />
      <SupernovaNusPane  />
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