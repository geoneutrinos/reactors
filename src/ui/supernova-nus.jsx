import React, { useState } from "react";
import { Card, Form, Table } from "react-bootstrap";
import { Num, Visible } from ".";

import { Node, Provider } from "@nteract/mathjax";

import { 
sumSpectrumIBDnoOsc,
sumSpectrumIBDforNO,
sumSpectrumIBDforIO,
sumSpectrumNueESP,
sumSpectrumAnuESP,
sumSpectrumNuxESP,
sumSpectrumNueESEforNO,
sumSpectrumAnuESEforNO,
sumSpectrumXnuESEforNO,
sumSpectrumNueESEforIO,
sumSpectrumAnuESEforIO,
sumSpectrumXnuESEforIO,
} from "../supernova";

export const SupernovaNusEvents = () => {

  return (
    <Card>
      <Card.Header>Core Collapse SN Neutrino Events</Card.Header>
      <Card.Body>
        <Provider>
          <div>
            <Table>
              <tbody>
              <tr>
                <td>
                  IBD (/10<sup>32</sup> p)
                </td>
                <td>
                  N<sup>0</sup> = <Num v={sumSpectrumIBDnoOsc} p={1} />
                </td>
                <td>
                  N<sub>NO</sub> = <Num v={sumSpectrumIBDforNO} p={1} />
                </td>
                <td>
                  N<sub>IO</sub> = <Num v={sumSpectrumIBDforIO} p={1} />
                </td>
              </tr>
              <tr>
                <td>
                  pES (/10<sup>32</sup> p)
                </td>
                <td>
                  N(ν<sub>e</sub>) = <Num v={sumSpectrumNueESP} p={1} />
                </td>
                <td>
                  N(ν̅<sub>e</sub>) = <Num v={sumSpectrumAnuESP} p={1} />
                </td>
                <td>
                  N(ν<sub>x</sub>) = <Num v={sumSpectrumNuxESP} p={1} />
                </td>
              </tr>
              <tr>
                <td>
                  eES NO (/10<sup>32</sup> e)
                </td>
                <td>
                  N(ν<sub>e</sub>) = <Num v={sumSpectrumNueESEforNO} p={1} />
                </td>
                <td>
                  N(ν̅<sub>e</sub>) = <Num v={sumSpectrumAnuESEforNO} p={1} />
                </td>
                <td>
                  N(ν<sub>x</sub>) = <Num v={sumSpectrumXnuESEforNO} p={1} />
                </td>
              </tr>
              <tr>
                <td>
                  eES IO (/10<sup>32</sup> e)
                </td>
                <td>
                  N(ν<sub>e</sub>) = <Num v={sumSpectrumNueESEforIO} p={1} />
                </td>
                <td>
                  N(ν̅<sub>e</sub>) = <Num v={sumSpectrumAnuESEforIO} p={1} />
                </td>
                <td>
                  N(ν<sub>x</sub>) = <Num v={sumSpectrumXnuESEforIO} p={1} />
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

export const SupernovaNusScatterTmins = () => {
  const [tESeMin, setTeMin] = useState(0.0);
  const [tESpMin, setTpMin] = useState(0.0);
  
  const UIsetTeMin = (event) => {
    const value = event.target.value;
    let te_min = parseFloat(value);
    if (isNaN(te_min)) {
      setTeMin(value);
    } else {
      if (te_min > 30) {
        te_min = 30.0;
      }
      setTeMin(te_min);
    }
  };
  
  const UIsetTpMin = (event) => {
    const value = event.target.value;
    let tp_min = parseFloat(value);
    if (isNaN(tp_min)) {
      setTpMin(value);
    } else {
      if (tp_min > 10) {
        tp_min = 10.0;
      }
      setTpMin(tp_min);
    }
  };

  return (
    <Card>
      <Card.Header>Set Scattered Charged Particle Minimum KE</Card.Header>
      <Card.Body>
      
            <Form.Group controlId="tp_min">
              <Form.Label>
                Proton Kinetic Energy Minimum
              </Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text><i>T</i><sub>min</sub></InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  onChange={UIsetTpMin}
                  type="number"
                  step="0.1"
                  value={tESpMin}
                />
                <InputGroup.Append>
                  <InputGroup.Text>MeV</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="te_min">
              <Form.Label>
                Electron Kinetic Energy Minimum
              </Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text><i>T</i><sub>min</sub></InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  onChange={UIsetTeMin}
                  type="number"
                  step="0.1"
                  value={tESeMin}
                />
                <InputGroup.Append>
                  <InputGroup.Text>MeV</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>

      </Card.Body>
    </Card>
  );
};

export const SupernovaNusPane = () => {

  return (
    <Card>
      <Card.Header>Core Collapse SN Neutrinos</Card.Header>
      <Card.Body>
        <Provider>
          <div>
            <p>
              The non-oscillated flux spectrum of neutrinos of a given species {" "}
              <Node inline>{String.raw`(\nu_\mathrm{e}, \overline{\nu}_\mathrm{e}, \nu_x)`}</Node> arriving at Earth from a core-collapse supernova is estimated by {" "} 
              <Node>{String.raw`
                \Phi^0_{\nu_{\alpha}}(E)=\frac1{4 \pi D^2} \frac{E_{\nu_{\alpha}}^\mathrm{tot}}{\langle E_{\nu_\alpha} \rangle^2} \frac{\beta^\beta}{\Gamma(\beta)}\bigg[\frac{E}{\langle E_{\nu_\alpha} \rangle}\bigg]^{\beta-1} \mathrm{exp}\bigg[-\beta \frac{E}{\langle E_{\nu_\alpha} \rangle}\bigg]
                ,`}</Node> where {" "}
              <Node inline>{String.raw`D`}</Node> is the distance to the SN, <Node inline>{String.raw`E_{\nu_{\alpha}}^\mathrm{tot}`}</Node> is the total energy of the neutrino species, {" "}
              <Node inline>{String.raw`\langle E_{\nu_\alpha} \rangle`}</Node> is the average energy of the neutrino species, {" "}
              <Node inline>{String.raw`\beta`}</Node> is a spectrum shape parameter, and {" "}
              <Node inline>{String.raw`\Gamma`}</Node> is the gamma function.
            </p>
            <p>
              Initially assume {" "}
              <Node inline>{String.raw`D = 10`}</Node> kpc, {" "}
              <Node inline>{String.raw`E_{\nu_{\alpha}}^\mathrm{tot} = 5\times10^{52}`}</Node> erg, {" "}
              <Node inline>{String.raw`\beta = 4`}</Node> , {" "}
              <Node inline>{String.raw`\langle E_{\nu_{\mathrm{e}}} \rangle = 12`}</Node> MeV, {" "} 
              <Node inline>{String.raw`\langle E_{\overline{\nu}_{\mathrm{e}}} \rangle = 15`}</Node> MeV, and {" "}
              <Node inline>{String.raw`\langle E_{\nu_{x}} \rangle = 18`}</Node> MeV.
            </p>
            <p>
              Oscillation effects depend on the neutrino mass ordering.<br />
              For normal ordering (NO) with {" "}
              <Node inline>{String.raw`m_3 > m_2 > m_1`}</Node> {" "}
              <Node>{String.raw`\begin{aligned}
                & \Phi_{\nu_{\mathrm{e}}} = \Phi^0_{\nu_{x}} \\
                & \Phi_{\overline{\nu}_{\mathrm{e}}} = \Phi^0_{\overline{\nu}_{\mathrm{e}}}\cos^2\theta_{12} + \Phi^0_{\nu_{x}}\sin^2\theta_{12} \\
                & \Phi_{\nu_{x}} = \frac1{4}\big(\Phi^0_{\nu_{x}}(2+\cos^2\theta_{12}) + \Phi^0_{\nu_{\mathrm{e}}} + \Phi^0_{\overline{\nu}_{\mathrm{e}}}\sin^2\theta_{12}\big)
                \end{aligned}`}</Node>
              </p>
              <p>
              For inverted ordering (IO) with {" "}
              <Node inline>{String.raw`m_2 > m_1 > m_3`}</Node> {" "}
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
