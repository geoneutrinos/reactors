import React, {useState, useMemo, memo} from "react";
import { Card, Form, InputGroup, Table } from "react-bootstrap";

import { Num } from ".";

import { Node, Provider } from "@nteract/mathjax";

const MuonsPane = () => {
  return (
    <Card>
      <Card.Header>Muon-Induced Backgrounds</Card.Header>
      <Card.Body>
        <Provider>
          <div>
            <p>
              This pane describes the overburden-dependent muon-induced backgrunds{" "}
            </p>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};

export const Muons = React.memo(() => {
  return (
    <div>
      <MuonsPane />
    </div>
  )
})
