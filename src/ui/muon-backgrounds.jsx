import React from "react";
import { Card } from "react-bootstrap";

import { Provider } from "@nteract/mathjax";

const MuonsPane = () => {
  return (
    <Card>
      <Card.Header>Muon-Induced Backgrounds</Card.Header>
      <Card.Body>
        <Provider>
          <div>
            <p>
              Description of the overburden-dependent muon-induced backgrunds goes here...
            </p>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};

export const Muons = () => {
  return (
    <div>
      <MuonsPane />
    </div>
  );
}
