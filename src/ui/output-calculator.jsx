import React, { useState, useContext } from "react";
import { Card, Form, InputGroup } from "react-bootstrap";
import { sum } from "lodash";
import { Node, Provider } from "@nteract/mathjax";
import { PhysicsContext } from "../state";
import { XSNames } from "../physics/neutrino-cross-section";
import { IBD_THRESHOLD } from "../physics/derived";

const getCoreSums = (cores, min_i, max_i, low_i) => {
  const lowSum = sum(
    cores.map((core) => sum(core.detectorSignal.slice(min_i, low_i)) * 0.01)
  );
  const highSum = sum(
    cores.map((core) => sum(core.detectorSignal.slice(low_i, max_i)) * 0.01)
  );
  return [lowSum + highSum, lowSum, highSum];
};

export const CalculatorPanel = ({ cores, spectrum }) => {
  const [signal, setSignal] = useState("closest");
  const [solveFor, setSolveFor] = useState("exposure");
  const [eMin, setEMin] = useState(parseFloat(IBD_THRESHOLD.toFixed(1)));
  const [eMax, setEMax] = useState(10);
  const [time, setTime] = useState(0);
  const [sigma, setSigma] = useState(3);
  // eslint-disable-next-line no-unused-vars
  const [deltaGeoNu, setDeltaGeoNu] = useState(0.25);
  const [bkgnuisance, setBkgnuisance] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [deltaBkgnuisance, setDeltaBkgnuisance] = useState(0.5);
  // eslint-disable-next-line no-unused-vars
  const [deltaReactorsHighE, setDeltaReactorsHighE] = useState(0.06);
  // Use this systematic uncertainty on reactor signal less than E_thresh
  // eslint-disable-next-line no-unused-vars
  const [deltaReactorsLowE, setDeltaReactorsLowE] = useState(0.3);

  const { crossSection } = useContext(PhysicsContext);

  // Unary operator + converts true to 1 and false to 0
  const isIBD = +[XSNames.IBDSV2003, XSNames.IBDVB1999].includes(
    crossSection.crossSection
  );
  if (isIBD && ["geo_k", "geo_u5"].includes(signal)) {
    setSignal("closest");
  }
  if (isIBD && eMin < parseFloat(IBD_THRESHOLD.toFixed(1))) {
    setEMin(parseFloat(IBD_THRESHOLD.toFixed(1)));
  }

  const UIsetSelect = (event) => {
    var key = event.target.id;
    const value = event.target.value;
    const selects = {
      signal: setSignal,
      solve_for: setSolveFor,
    };
    selects[key](value);
  };

  const UIsetBkgNuisance = (event) => {
    const value = event.target.value;
    let bkg_nuisance = parseFloat(value);
    if (isNaN(bkg_nuisance)) {
      setBkgnuisance(value);
    } else {
      if (bkg_nuisance < 0) {
        bkg_nuisance = 0;
      }
      setBkgnuisance(bkg_nuisance);
    }
  };

  const UIsetEMin = (event) => {
    const value = event.target.value;
    let stateEmin = parseFloat(IBD_THRESHOLD.toFixed(1)) * isIBD;
    let e_min = parseFloat(value);
    if (isNaN(e_min)) {
      setEMin(value);
    } else {
      if (e_min < stateEmin) {
        e_min = stateEmin;
      }
      if (e_min > 10) {
        e_min = 10;
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
      if (e_max > 10) {
        e_max = 10;
      }
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
  const low_i = parseInt(IBD_THRESHOLD * 100);

  const coreList = Object.values(cores);

  const closestActiveCore = coreList
    .filter((core) => core.detectorAnySignal)
    .sort((a, b) => a.detectorDistance - b.detectorDistance)[0];

  const [closestNIU, closestLowNIU, closestHighNIU] =
    closestActiveCore !== undefined
      ? getCoreSums([closestActiveCore], min_i, max_i, low_i)
      : [0, 0, 0];

  //
  // need to separate sums for reactor antineutrino energy above and below E_thresh
  // systematic uncertainy is bigger below E_thresh than above
  // so min_i and max_i get modified
  const [totalCoreSignal, totalCoreSignalLow, totalCoreSignalHigh] =
    getCoreSums(coreList, min_i, max_i, low_i);

  // custom cores
  // need separate sums for reactor antineutrino energy above and below E_thresh
  // systematic uncertainy is bigger below E_thresh than above
  // so min_i and max_i get modified
  const customCores = coreList.filter((core) => core.custom);
  const [customTotalSignal, customTotalSignalLow, customTotalSignalHigh] =
    getCoreSums(customCores, min_i, max_i, low_i);

  const geoU238NIU = sum(spectrum.geoU238.slice(min_i, max_i)) * 0.01;
  const geoU235NIU = sum(spectrum.geoU235.slice(min_i, max_i)) * 0.01;
  const geoTh232NIU = sum(spectrum.geoTh232.slice(min_i, max_i)) * 0.01;
  const geoK40betaNIU = sum(spectrum.geoK40_beta.slice(min_i, max_i)) * 0.01;
  const geoTotalNIU = geoU238NIU + geoTh232NIU + geoK40betaNIU + geoU235NIU;

  // for now assume a flat spectrum with maximum energy of 10 MeV
  const bkgNuisanceNIU =
    (bkgnuisance * (eMax - eMin)) / (10 - IBD_THRESHOLD * isIBD);

  let UIsignal = 0;
  let UIbackground = 0;
  let UIBackgroundUncertainty = 0;

  if (signal === "all") {
    UIsignal = totalCoreSignal;
    UIbackground = geoTotalNIU + bkgNuisanceNIU;
    UIBackgroundUncertainty = Math.sqrt(
      (geoTotalNIU * deltaGeoNu) ** 2 + (bkgNuisanceNIU * deltaBkgnuisance) ** 2
    );
  }
  if (signal === "closest") {
    UIsignal = closestNIU;
    UIbackground = geoTotalNIU + bkgNuisanceNIU + totalCoreSignal - closestNIU;
    UIBackgroundUncertainty = Math.sqrt(
      (geoTotalNIU * deltaGeoNu) ** 2 +
        (bkgNuisanceNIU * deltaBkgnuisance) ** 2 +
        ((totalCoreSignalHigh - closestHighNIU) * deltaReactorsHighE) ** 2 +
        ((totalCoreSignalLow - closestLowNIU) * deltaReactorsLowE) ** 2
    );
  }
  if (signal === "custom") {
    UIsignal = customTotalSignal;
    UIbackground =
      geoTotalNIU + bkgNuisanceNIU + totalCoreSignal - customTotalSignal;
    UIBackgroundUncertainty = Math.sqrt(
      (geoTotalNIU * deltaGeoNu) ** 2 +
        (bkgNuisanceNIU * deltaBkgnuisance) ** 2 +
        ((totalCoreSignalHigh - customTotalSignalHigh) * deltaReactorsHighE) **
          2 +
        ((totalCoreSignalLow - customTotalSignalLow) * deltaReactorsLowE) ** 2
    );
  }
  if (signal === "geoneutrino") {
    UIbackground = totalCoreSignal + bkgNuisanceNIU;
    UIsignal = geoTotalNIU;
    UIBackgroundUncertainty = Math.sqrt(
      (totalCoreSignalHigh * deltaReactorsHighE) ** 2 +
        (totalCoreSignalLow * deltaReactorsLowE) ** 2 +
        (bkgNuisanceNIU * deltaBkgnuisance) ** 2
    );
  }
  if (signal === "geo_u8") {
    UIbackground = totalCoreSignal + bkgNuisanceNIU + geoTotalNIU - geoU238NIU;
    UIsignal = geoU238NIU;
    UIBackgroundUncertainty = Math.sqrt(
      ((geoTotalNIU - geoU238NIU) * deltaGeoNu) ** 2 +
        (bkgNuisanceNIU * deltaBkgnuisance) ** 2 +
        (totalCoreSignalHigh * deltaReactorsHighE) ** 2 +
        (totalCoreSignalLow * deltaReactorsLowE) ** 2
    );
  }
  if (signal === "geo_th") {
    UIbackground = totalCoreSignal + bkgNuisanceNIU + geoTotalNIU - geoTh232NIU;
    UIsignal = geoTh232NIU;
    UIBackgroundUncertainty = Math.sqrt(
      ((geoTotalNIU - geoTh232NIU) * deltaGeoNu) ** 2 +
        (bkgNuisanceNIU * deltaBkgnuisance) ** 2 +
        (totalCoreSignalHigh * deltaReactorsHighE) ** 2 +
        (totalCoreSignalLow * deltaReactorsLowE) ** 2
    );
  }
  if (signal === "geo_k") {
    UIbackground =
      totalCoreSignal + bkgNuisanceNIU + geoTotalNIU - geoK40betaNIU;
    UIsignal = geoK40betaNIU;
    UIBackgroundUncertainty = Math.sqrt(
      ((geoTotalNIU - geoK40betaNIU) * deltaGeoNu) ** 2 +
        (bkgNuisanceNIU * deltaBkgnuisance) ** 2 +
        (totalCoreSignalHigh * deltaReactorsHighE) ** 2 +
        (totalCoreSignalLow * deltaReactorsLowE) ** 2
    );
  }
  if (signal === "geo_u5") {
    UIbackground = totalCoreSignal + bkgNuisanceNIU + geoTotalNIU - geoU235NIU;
    UIsignal = geoU235NIU;
    UIBackgroundUncertainty = Math.sqrt(
      ((geoTotalNIU - geoU235NIU) * deltaGeoNu) ** 2 +
        (bkgNuisanceNIU * deltaBkgnuisance) ** 2 +
        (totalCoreSignalHigh * deltaReactorsHighE) ** 2 +
        (totalCoreSignalLow * deltaReactorsLowE) ** 2
    );
  }

  let UITime = time;
  let UISigma = sigma;
  let UIExposureNever = false;
  let UITotalUnderTwo = false;

  if (solveFor === "exposure") {
    UITime =
      (sigma ** 2 * (UIsignal + UIbackground)) /
      (UIsignal ** 2 - sigma ** 2 * UIBackgroundUncertainty ** 2);
    if (sigma * UIBackgroundUncertainty >= UIsignal) {
      UIExposureNever = true;
    }
    if (UITime >= 0 && (UIsignal + UIbackground) * UITime < 2) {
      UITotalUnderTwo = true;
    }
    UITime = UITime.toFixed(4);
  }

  if (solveFor === "significance") {
    UISigma =
      (UIsignal * time) /
      Math.sqrt(
        (UIsignal + UIbackground) * time + (UIBackgroundUncertainty * time) ** 2
      );
    if ((UIsignal + UIbackground) * time < 2) {
      UISigma = 0;
      UITotalUnderTwo = true;
    }
    UISigma = UISigma.toFixed(3);
  }

  return (
    <Card>
      <Card.Header>Significance/Exposure Calculator</Card.Header>
      <Card.Body>
        <Provider>
          <Form noValidate>
            <Form.Group controlId="signal">
              <Form.Label>Signal (background)</Form.Label>
              <Form.Control as="select" onChange={UIsetSelect} value={signal}>
                <option value="closest">
                  Closest Core (geoneutrinos + other reactors)
                </option>
                <option value="custom">
                  Custom Core (geoneutrinos + other reactors)
                </option>
                <option value="all">All Cores (geoneutrinos)</option>
                <option value="geoneutrino">Geoneutrino (reactors)</option>
                <option value="geo_u8">
                  Geoneutrino U238 (reactors + other geoneutrino isotopes)
                </option>
                <option value="geo_th">
                  Geoneutrino Th232 (reactors + other geoneutrino isotopes)
                </option>
                <option value="geo_k" disabled={isIBD}>
                  Geoneutrino K40 (reactors + other geoneutrino isotopes)
                </option>
                <option value="geo_u5" disabled={isIBD}>
                  Geoneutrino U235 (reactors + other geoneutrino isotopes)
                </option>
              </Form.Control>
              <small>{crossSection.crossSection}</small>
            </Form.Group>
            <Form.Group controlId="solve_for">
              <Form.Label>Solve For</Form.Label>
              <Form.Control as="select" onChange={UIsetSelect} value={solveFor}>
                <option value="exposure">Exposure</option>
                <option value="significance">Significance</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="bkg_nuisance">
              <Form.Label>Nuisance Background</Form.Label>
              <InputGroup>
                <Form.Control
                  onChange={UIsetBkgNuisance}
                  type="number"
                  value={bkgnuisance}
                />
                <InputGroup.Append>
                  <InputGroup.Text>NIU</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="e_min">
              <Form.Label>
                Antineutrino <i>E</i><sub>min</sub>
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
                Antineutrino <i>E</i><sub>max</sub>
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
              <Form.Label>Exposure</Form.Label>
              <InputGroup>
                <Form.Control
                  isInvalid={UIExposureNever}
                  onChange={UIsetTime}
                  type={UIExposureNever ? "text" : "number"}
                  step="0.1"
                  value={UIExposureNever ? "Infinite" : UITime}
                />
                <InputGroup.Append>
                  <InputGroup.Text>
                    <span>
                      10<sup>32</sup> target-years
                    </span>
                  </InputGroup.Text>
                </InputGroup.Append>
                <Form.Control.Feedback type="invalid">
                  Product of N<sub>σ</sub> and Background Uncertainty exceeds
                  Signal
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="sigma">
              <Form.Label>
                N<sub>σ</sub>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  isInvalid={UITotalUnderTwo}
                  onChange={UIsetSigma}
                  type="number"
                  step="0.1"
                  value={UISigma}
                />
                <Form.Control.Feedback type="invalid">
                  Total number of events is less than 2
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Form>
          <div>
            <Node>{String.raw`N_{\sigma} = \frac{ s * \xi }{\sqrt{(s + b) * \xi + (\delta b * \xi )^2}}`}</Node>{" "}
            <Node inline>{String.raw`s`}</Node> is the signal rate,{" "}
            <Node inline>{String.raw`b`}</Node> is the background rate,{" "}
            <Node inline>{String.raw`\delta b`}</Node> is the systematic
            uncertainty of the background rate, and{" "}
            <Node inline>{String.raw`\xi`}</Node> is the exposure. For rates in
            NIU, exposure is in <Node inline>{`10^{32}`}</Node> target-years.
            The fractional systematic uncetainties of the estimated reactor
            rates are 0.06 (0.30) for antineutrino energy above (below) IBD
            threshold, while those for the estimated geoneutrino and nuisance
            background rates are 0.25 and 0.50, respectively. The spectral shape
            of the nuisance background is flat.
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};
