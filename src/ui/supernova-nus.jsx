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
                F_\nu(E_\nu)=\frac1{4 \pi D^2} \frac{\Phi_\nu}{\langle E_\nu \rangle} \frac{\beta^\beta}{\Gamma(\beta)}\big[\frac{E}{\langle E_\nu \rangle}\big]^{\beta-1} \mathrm{exp}\big[-\beta \frac{E}{\langle E_\nu \rangle}\big]
                `}</Node> where {" "}
              <Node inline>{String.raw`D`}</Node> is the distance to the SN.
            </p>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};
