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
              <Node>{String.raw`
                F_\nu(E)=\frac1{4 \pi D^2} \frac{\Phi_\nu}{\langle E_\nu \rangle} \frac{\beta^\beta}{\Gamma(\beta)}\bigg[\frac{E}{\langle E_\nu \rangle}\bigg]^{\beta-1} \mathrm{exp}\bigg[-\beta \frac{E}{\langle E_\nu \rangle}\bigg]
                `}</Node> where {" "}
              <Node inline>{String.raw`D`}</Node> is the distance to the SN. <Node inline>{String.raw`\Phi_\nu`}</Node> is the number of neutrinos, 
              <Node inline>{String.raw`\beta`}</Node> is a parameter, <Node inline>{String.raw`\Gamma`}</Node> is the gamma function.
              
            </p>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};
