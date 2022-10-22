import React from "react";
import { Card } from "react-bootstrap";

import { Provider } from "@nteract/mathjax";

import { calcFluxesAtDepth } from "../muons";

import { MuonBackgroundPlots } from "./muon-backgrounds-plots";

const MuonsPane = () => {
  return (
    <Card>
      <Card.Header>Muon-Induced Backgrounds</Card.Header>
      <Card.Body>
        <Provider>
          <div>
            <p>
              This page is an inital attempt to model the muon-induced backgrounds that depend on the overburden of the detector site.  
              So far there are three plots- differential muon intensity corresonding to slant depth, differential muon intensity 
              corresponding to a falt overburden, and the neutron flux emerging from the rock into the underground cavern as a function of
              the depth relative to a flat overburden.
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
      <MuonBackgroundPlots
        calcFluxesAtDepth={calcFluxesAtDepth}
      />
    </div>
  );
}
