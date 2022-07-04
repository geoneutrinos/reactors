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
              <Node inline>{String.raw`(\nu_\mathrm{e}, \overline{\nu}_\mathrm{e}, \nu_x)`}</Node> arriving at detection site is
              <Node>{String.raw`
                F_\nu(E)=\frac1{4 \pi D^2} \frac{\Phi_\nu}{\langle E_\nu \rangle} \frac{\beta^\beta}{\Gamma(\beta)}\bigg[\frac{E}{\langle E_\nu \rangle}\bigg]^{\beta-1} \mathrm{exp}\bigg[-\beta \frac{E}{\langle E_\nu \rangle}\bigg]
                `}</Node> where {" "}
              <Node inline>{String.raw`D`}</Node> is the distance to the SN, <Node inline>{String.raw`\Phi_\nu`}</Node> is the number of neutrinos, {" "}
              <Node inline>{String.raw`\beta`}</Node> is a parameter (=4), <Node inline>{String.raw`\Gamma`}</Node> is the gamma function, {" "}
              and <Node inline>{String.raw`\langle E_\nu \rangle`}</Node> is the average neutrino energy with {" "}
              <Node inline>{String.raw`\langle E_{\nu_\mathrm{e}} \rangle = 12`}</Node> MeV, {" "} 
              <Node inline>{String.raw`\langle E_{\overline{\nu}_\mathrm{e}} \rangle = 15`}</Node> MeV, and {" "}
              <Node inline>{String.raw`\langle E_{\nu_x} = 18`}</Node> MeV.
            </p>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};
