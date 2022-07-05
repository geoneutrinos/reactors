import React, { useContext } from "react";
import { Card, Form } from "react-bootstrap";

import { Node, Provider } from "@nteract/mathjax";

export const SupernovaNusPane = () => {

  return (
    <Card>
      <Card.Header>Core Collapse SN Neutrinos</Card.Header>
      <Card.Body>
        <Provider>
          <div>
            <p>
              In the absence of oscillations, the estimated energy spectrum (/area/energy) of core collapse supernova neutrinos of a given species {" "}
              <Node inline>{String.raw`(\nu_\mathrm{e}, \overline{\nu}_\mathrm{e}, \nu_x)`}</Node> arriving at a detection site is
              <Node>{String.raw`
                F^0_{\nu_{\alpha}}(E)=\frac1{4 \pi D^2} \frac{E_{\nu_{\alpha}}^\mathrm{tot}}{\langle E_{\nu_\alpha} \rangle^2} \frac{\beta^\beta}{\Gamma(\beta)}\bigg[\frac{E}{\langle E_{\nu_\alpha} \rangle}\bigg]^{\beta-1} \mathrm{exp}\bigg[-\beta \frac{E}{\langle E_{\nu_\alpha} \rangle}\bigg]
                `}</Node> where {" "}
              <Node inline>{String.raw`D`}</Node> is the distance to the SN, <Node inline>{String.raw`E_{\nu_{\alpha}}^\mathrm{tot}`}</Node> is the total energy of the neutrinos, {" "}
              <Node inline>{String.raw`\beta`}</Node> is a parameter, <Node inline>{String.raw`\Gamma`}</Node> is the gamma function, {" "}
              and <Node inline>{String.raw`\langle E_{\nu{\alpha}} \rangle`}</Node> is the average neutrino energy. 
            </p>
            <p>
              Initially assume {" "}
              <Node inline>{String.raw`D = 10`}</Node> kpc, {" "}
              <Node inline>{String.raw`E_{\nu{\alpha}}^\mathrm{tot} = 5\times10^{52}`}</Node> erg, {" "}
              <Node inline>{String.raw`\beta = 4`}</Node> , {" "}
              <Node inline>{String.raw`\langle E_{\nu_{\mathrm{e}}} \rangle = 12`}</Node> MeV, {" "} 
              <Node inline>{String.raw`\langle E_{\overline{\nu}_{\mathrm{e}}} \rangle = 15`}</Node> MeV, and {" "}
              <Node inline>{String.raw`\langle E_{\nu_{x}} \rangle = 18`}</Node> MeV.
            </p>
            <p>
              Oscillation effects depend on the neutrino mass ordering (NO or IO). For NO {" "}
              <Node>{String.raw`\begin{aligned}
                & F_{\nu_{\mathrm{e}}}(E) = F^0_{\nu_{x}}(E) \\
                & F_{\overline{\nu}_{\mathrm{e}}}(E) = F^0_{\overline{\nu}_{\mathrm{e}}}(E)\cos^2\theta_{12} + F^0_{\nu_{x}}(E)\sin^2\theta_{12} \\
                & F_{\nu_{x}}(E) = \frac1{4}(2+\cos^2\theta_{12})F^0_{\nu_{x}}(E) + \frac1{4}F^0_{\nu_{\mathrm{e}}}(E) + \frac1{4}F^0_{\overline{\nu}_{\mathrm{e}}}(E)\sin^2\theta_{12}
                \end{aligned}`}</Node>
              </p>
              <p>
              For IO {" "}
              <Node>{String.raw`\begin{aligned}
                & F_{\nu_{\mathrm{e}}}(E) = F^0_{\nu_{\mathrm{e}}}(E)\sin^2\theta_{12} + F^0_{\nu_{x}}(E)\cos^2\theta_{12} \\
                & F_{\overline{\nu}_{\mathrm{e}}}(E) = F^0_{\nu_{x}}(E) \\
                & F_{\nu_{x}}(E) = \frac1{4}(2+\sin^2\theta_{12})F^0_{\nu_{x}}(E) + \frac1{4}F^0_{\overline{\nu}_{\mathrm{e}}}(E) + \frac1{4}F^0_{\overline{\nu}_{\mathrm{e}}}(E)\cos^2\theta_{12}
                \end{aligned}`}</Node>
              </p>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};
