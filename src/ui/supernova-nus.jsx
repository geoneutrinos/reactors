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
                F_\nu(E)=\frac1{4 \pi D^2} \frac{E_\nu^\mathrm{tot}}{\langle E_\nu \rangle^2} \frac{\beta^\beta}{\Gamma(\beta)}\bigg[\frac{E}{\langle E_\nu \rangle}\bigg]^{\beta-1} \mathrm{exp}\bigg[-\beta \frac{E}{\langle E_\nu \rangle}\bigg]
                `}</Node> where {" "}
              <Node inline>{String.raw`D`}</Node> is the distance to the SN, <Node inline>{String.raw`E_\nu^\mathrm{tot}`}</Node> is the total number of neutrinos, {" "}
              <Node inline>{String.raw`\beta`}</Node> is a parameter, <Node inline>{String.raw`\Gamma`}</Node> is the gamma function, {" "}
              and <Node inline>{String.raw`\langle E_\nu \rangle`}</Node> is the average neutrino energy. 
            </p>
            <p>
              Initially assume {" "}
              <Node inline>{String.raw`E_\nu^\mathrm{tot} = 5\times10^{52}`}</Node> erg, {" "}
              <Node inline>{String.raw`\beta = 4`}</Node> , {" "}
              <Node inline>{String.raw`\langle E_{\nu_\mathrm{e}} \rangle = 12`}</Node> MeV, {" "} 
              <Node inline>{String.raw`\langle E_{\overline{\nu}_\mathrm{e}} \rangle = 15`}</Node> MeV, and {" "}
              <Node inline>{String.raw`\langle E_{\nu_x} \rangle = 18`}</Node> MeV.
            </p>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};
