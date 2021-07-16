import React, { useState } from "react";
import { Card, Form, InputGroup } from "react-bootstrap";
import { sum } from "lodash";
import { Node, Provider } from "@nteract/mathjax";

export const CalculatorPanel = ({ cores, spectrum }) => {
  const [signal, setSignal] = useState("all");
  const [solveFor, setSolveFor] = useState("exposure");
  const [eMin, setEMin] = useState(0);
  const [eMax, setEMax] = useState(10);
  const [time, setTime] = useState(0);
  const [sigma, setSigma] = useState(3);
  const [deltaReactors, setDeltaReactors] = useState(0.06);
  const [deltaGeoNu, setDeltaGeoNu] = useState(0.25);
  const [targetScale, setTargetScale] = useState(1.0);

  const UIsetSelect = (event) => {
    var key = event.target.id;
    const value = event.target.value;
    const selects = {
      signal: setSignal,
      solve_for: setSolveFor,
    };
    selects[key](value);
  };

  const UIsetEMin = (event) => {
    const value = event.target.value;
    let e_min = parseFloat(value);
    if (isNaN(e_min)) {
      setEMin(value);
    } else {
      if (e_min < 0) {
        e_min = 0;
      }
      if (eMax < e_min) {
        setEMax(e_min);
      }
      setEMin(e_min);
    }
  };

  const UIsetEMax = (event) => {
    const value = event.target.value;
    let e_max = parseFloat(value);
    if (isNaN(e_max)) {
      setEMax(value);
    } else {
      if (e_max < eMin) {
        e_max = eMin;
      }
      setEMax(e_max);
    }
  };

  const UIsetTime = (event) => {
    const value = event.target.value;
    let time = parseFloat(value);
    if (isNaN(time)) {
      setTime(value);
    } else {
      if (time < 0) {
        time = 0;
      }
      setTime(time);
    }
  };

  const UIsetSigma = (event) => {
    const value = event.target.value;
    let sigma = parseFloat(value);
    if (isNaN(sigma)) {
      setSigma(value);
    } else {
      if (sigma < 0) {
        sigma = 0;
      }
      setSigma(sigma);
    }
  };

  const min_i = parseInt(eMin * 100);
  const max_i = parseInt(eMax * 100);

  const coreList = Object.values(cores);

  const closestActiveCore = coreList
    .filter((core) => core.detectorAnySignal)
    .sort((a, b) => a.detectorDistance - b.detectorDistance)[0];

  const closestNIU = closestActiveCore?.detectorNIU || 0;

  const totalCoreSignal = sum(
    coreList.map((core) => sum(core.detectorSignal.slice(min_i, max_i)) * 0.01)
  );

  // custom cores
  const customCores = coreList.filter((core) => core.custom);
  const customTotalSignal = sum(
    customCores.map((core) => core.detectorSignal.slice(min_i, max_i))
  );

  const geoUNIU = sum(spectrum.geoU.slice(min_i, max_i)) * 0.01;
  const geoThNIU = sum(spectrum.geoTh.slice(min_i, max_i)) * 0.01;
  const geoKNIU = sum(spectrum.geoK.slice(min_i, max_i)) * 0.01;

  const geoTotalNIU = geoUNIU + geoThNIU + geoKNIU;

  let UIsignal = 0;
  let UIbackground = 0;
  let UIBackgroundUncertanty = 0;

  if (signal === "all") {
    UIsignal = totalCoreSignal;
    UIbackground = geoTotalNIU;
    UIBackgroundUncertanty = geoTotalNIU * deltaGeoNu;
  }
  if (signal === "closest") {
    UIsignal = closestNIU;
    UIbackground = geoTotalNIU + totalCoreSignal - closestNIU;
    UIBackgroundUncertanty = Math.sqrt(
      (geoTotalNIU * deltaGeoNu) ** 2 +
        ((totalCoreSignal - closestNIU) * deltaReactors) ** 2
    );
  }
  if (signal === "custom") {
    UIsignal = customTotalSignal;
    UIbackground = geoTotalNIU + totalCoreSignal - customTotalSignal;
    UIBackgroundUncertanty = Math.sqrt(
      (geoTotalNIU * deltaGeoNu) ** 2 +
        ((totalCoreSignal - customTotalSignal) * deltaReactors) ** 2
    );
  }
  if (signal === "geoneutrino") {
    UIbackground = totalCoreSignal;
    UIsignal = geoTotalNIU;
    UIBackgroundUncertanty = totalCoreSignal * deltaReactors;
  }
  if (signal === "geo_u") {
    UIbackground = totalCoreSignal + geoTotalNIU - geoUNIU;
    UIsignal = geoUNIU;
    UIBackgroundUncertanty = Math.sqrt(
      ((geoTotalNIU - geoUNIU) * deltaGeoNu) ** 2 +
        (totalCoreSignal * deltaReactors) ** 2
    );
  }
  if (signal === "geo_th") {
    UIbackground = totalCoreSignal + geoTotalNIU - geoThNIU;
    UIsignal = geoThNIU;
    UIBackgroundUncertanty = Math.sqrt(
      ((geoTotalNIU - geoThNIU) * deltaGeoNu) ** 2 +
        (totalCoreSignal * deltaReactors) ** 2
    );
  }

  let UITime = time;
  let UISigma = sigma;
  let UIExposureNever = false;

  if (solveFor === "exposure") {
    UITime =
      (sigma ** 2 * (UIsignal + UIbackground)) /
      (UIsignal ** 2 - sigma ** 2 * UIBackgroundUncertanty ** 2) /
      targetScale;
    if (sigma * UIBackgroundUncertanty >= UIsignal) {
      UITime = 0;
      UIExposureNever = true;
    }

    UITime = UITime.toFixed(5);
  }
  if (solveFor === "significance") {
    UISigma =
      (UIsignal * time * targetScale) /
      Math.sqrt(
        (UIsignal + UIbackground) * time * targetScale +
          (UIBackgroundUncertanty * time * targetScale) ** 2
      );
  }

  return (
    <Card>
      <Card.Header>Rate Significance Calculator</Card.Header>
      <Card.Body>
        <Provider>
          <Form noValidate>
            <Form.Group controlId="signal">
              <Form.Label>Signal (background)</Form.Label>
              <Form.Control as="select" onChange={UIsetSelect} value={signal}>
                <option value="all">All Cores (geoneutrinos)</option>
                <option value="closest">
                  Closest Core (geoneutrinos + other reactors)
                </option>
                <option value="custom">
                  Custom Core (geoneutrinos + other reactors)
                </option>
                <option value="geoneutrino">
                  Geoneutrino (reactors)
                </option>
                <option value="geo_u">
                  Geoneutrino U (reactors + geo Th)
                </option>
                <option value="geo_th">
                  Geoneutrino Th (reactors + geo U)
                </option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="solve_for">
              <Form.Label>Solve For</Form.Label>
              <Form.Control as="select" onChange={UIsetSelect} value={solveFor}>
                <option value="exposure">Exposure Time</option>
                <option value="significance">Significance</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="e_min">
              <Form.Label>
                Antineutrino E<sub>min</sub>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  onChange={UIsetEMin}
                  type="number"
                  step="0.1"
                  value={eMin}
                />
                <InputGroup.Append>
                  <InputGroup.Text>MeV</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="e_max">
              <Form.Label>
                Antineutrino E<sub>max</sub>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  onChange={UIsetEMax}
                  type="number"
                  step="0.1"
                  value={eMax}
                />
                <InputGroup.Append>
                  <InputGroup.Text>MeV</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="time">
              <Form.Label>
                Exposure Time for{" "}
                <Node
                  inline
                >{`${targetScale} \\times 10^{32} \\text{targets}`}</Node>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  isInvalid={UIExposureNever}
                  onChange={UIsetTime}
                  type="number"
                  value={UITime}
                />
                <InputGroup.Append>
                  <InputGroup.Text>years</InputGroup.Text>
                </InputGroup.Append>
                <Form.Control.Feedback type="invalid">
                  Background Uncertainty Exceeds Signal
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="sigma">
              <Form.Label>
                N<sub>σ</sub> for{" "}
                <Node
                  inline
                >{`${targetScale} \\times 10^{32} \\text{targets}`}</Node>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  onChange={UIsetSigma}
                  type="number"
                  value={UISigma}
                />
              </InputGroup>
            </Form.Group>
          </Form>
          <div>
            <Node>{String.raw`N_{\sigma} = \frac{ S * E}{\sqrt{(S + B) * E + (\delta B * E)^2}}`}</Node>
            Where S is the signal rate, B is the background rate,{" "}
            <Node inline>{String.raw`\delta B`}</Node> is the background
            uncertainty and E is exposure:{" "}
            <Node
              inline
            >{`E = \\text{time} * ${targetScale} \\times 10^{32} \\text{targets}`}</Node>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};
