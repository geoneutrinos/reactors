import React, { useState, useContext } from "react";
import { Card, Form, InputGroup, Table, Row, Col } from "react-bootstrap";
import { sum } from "lodash";
import { Node, Provider } from "@nteract/mathjax";
import { PhysicsContext } from "../state";
import { XSNames } from "../physics/neutrino-cross-section";
import { IBD_THRESHOLD } from "../physics/derived";
import { Num, Visible } from ".";
import bins from "../physics/bins";
import Plot from "react-plotly.js"

const getCoreSums = (cores, min_i, max_i, low_i) => {
  const lowSum = sum(
    cores.map((core) => sum(core.detectorSignal.slice(min_i, Math.min(low_i, max_i))) * 0.01)
  );
  const highSum = sum(
    cores.map((core) => sum(core.detectorSignal.slice(Math.max(low_i, min_i), max_i)) * 0.01)
  );
  return [lowSum + highSum, lowSum, highSum];
};

const getCoreUncertainties = (cores, min_i, max_i, low_i) => {
  const lowSum = sum(
    cores.map((core) => sum(core.detectorUncertainty.slice(min_i, Math.min(low_i, max_i))) * 0.01)
  );
  const highSum = sum(
    cores.map((core) => sum(core.detectorUncertainty.slice(Math.max(low_i, min_i), max_i)) * 0.01)
  );
  return [lowSum + highSum, lowSum, highSum];
};

const effFunc = (eV, Emax, rampUp, turnOn) => {
  return Emax / (1 + Math.exp(-rampUp * (eV - turnOn)))
}

const detectorEfficiency = (
  Emax,
  rampUp,
  turnOn,
  spectrum,
  perfect = false
) => {
  if (perfect) {
    return spectrum;
  }
  return bins.map(
    (eV, i) =>
    effFunc(eV, Emax, rampUp, turnOn) * spectrum[i]
  );
};

export const CalculatorPanel = ({ cores, geo }) => {
  const [signal, setSignal] = useState("selected");
  const [solveFor, setSolveFor] = useState("significance");
  const [eMin, setEMin] = useState(0.0);
  const [eMax, setEMax] = useState(10.0);
  const [time, setTime] = useState(1.0);
  const [sigma, setSigma] = useState(3.0);
  // eslint-disable-next-line no-unused-vars
  const [bkgnuisance, setBkgnuisance] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [deltaBkgnuisance, setDeltaBkgnuisance] = useState(0.5);
  // eslint-disable-next-line no-unused-vars
  //const [deltaReactorsHighE, setDeltaReactorsHighE] = useState(0.06);
  // Use this systematic uncertainty on reactor signal less than E_thresh
  // eslint-disable-next-line no-unused-vars
  //const [deltaReactorsLowE, setDeltaReactorsLowE] = useState(0.3);
  // detection efficiency function parameters
  const [effMax, setEffMax] = useState(1.0);
  const [enerStart, setEnerStart] = useState(
    parseFloat(IBD_THRESHOLD.toFixed(1))
  );
  const [rampUp, setRampUp] = useState(1000);

  const { crossSection } = useContext(PhysicsContext);

  // plot config

  const plotData = [
    {
      y: bins.map((eV) => effFunc(eV, effMax, rampUp, enerStart)),
      x: bins,
      name: "Eff Curve",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "Black" },
    },
  ]
  
  var layout = {
    title: "IBD Detection Efficiency",
    yaxis: {
      title: { text: `Efficiency` },
      range: [0, 1.05]
    },
    xaxis: {
      title: { text: `Antineutrino Energy (MeV)` },
      range: [0, 10]
    },
    autosize: true,
    legend: {
      x: 1,
      xanchor: "right",
      y: 0,
    },
    annotations: [
      {
        showarrow: false,
        text: "geoneutrinos.org",
        x: 1.1,
        xref: "paper",
        y: -0.15,
        yref: "paper",
      },
    ],
  };
  var config = {
    toImageButtonOptions: {
      filename: 'Detection-efficiency'
    }
  };

  // Unary operator + converts true to 1 and false to 0
  const isIBD = +[XSNames.IBDSV2003, XSNames.IBDVB1999].includes(
    crossSection.crossSection
  );
  if (isIBD && ["geo_k", "geo_u5"].includes(signal)) {
    setSignal("closest");
  }
  if (isIBD && eMin < parseFloat(IBD_THRESHOLD.toFixed(1))) {
    setEMin(parseFloat(IBD_THRESHOLD.toFixed(3)));
  }
  if (!isIBD && eMin === parseFloat(IBD_THRESHOLD.toFixed(3))) {
    setEMin(0);
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
      if (e_max > 10) {
        e_max = 10.0;
      }
      if (e_max < eMin) {
        e_max = eMin;
      }
      setEMax(e_max);
    }
  };

  const UIsetEffMax = (event) => {
    const value = event.target.value;
    let eff_max = parseFloat(value);
    if (isNaN(eff_max)) {
      setEffMax(value);
    } else {
      if (eff_max < 0) {
        eff_max = 0;
      }
      if (eff_max > 1.0) {
        eff_max = 1.0;
      }
      setEffMax(eff_max);
    }
  };

  const UIsetEnerStart = (event) => {
    const value = event.target.value;
    let stateEnerstart = parseFloat(IBD_THRESHOLD.toFixed(1)) * isIBD;
    let ener_start = parseFloat(value);
    if (isNaN(ener_start)) {
      setEnerStart(value);
    } else {
      if (ener_start < stateEnerstart) {
        ener_start = stateEnerstart;
      }
      if (eMax < ener_start) {
        ener_start = eMax;
      }
      setEnerStart(ener_start);
    }
  };

  const UIsetRampUp = (event) => {
    const value = event.target.value;
    let ramp_up = parseFloat(value);
    if (isNaN(ramp_up)) {
      setRampUp(value);
    } else {
      if (ramp_up < 0) {
        ramp_up = 0;
      }
      setRampUp(ramp_up);
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

  const coreList = Object.values(cores).map((core) => {
    return {
      ...core,
      detectorSignal: detectorEfficiency(
        effMax,
        rampUp,
        enerStart,
        core.detectorSignal,
        !isIBD
      ),
    };
  });

  const closestActiveCore = coreList
    .filter((core) => core.detectorAnySignal)
    .sort((a, b) => a.detectorDistance - b.detectorDistance)[0];

  const [closestNIU, closestLowNIU, closestHighNIU] =
    closestActiveCore !== undefined
      ? getCoreSums([closestActiveCore], min_i, max_i, low_i)
      : [0, 0, 0];

  // need separate sums for reactor antineutrino energy above and below E_thresh
  // systematic uncertainy is bigger below E_thresh than above
  // so min_i and max_i get modified
  const [totalCoreSignal, totalCoreSignalLow, totalCoreSignalHigh] =
    getCoreSums(coreList, min_i, max_i, low_i);

  const [,totalCoreUncertaintyLow,totalCoreUncertaintyHigh] = 
    getCoreUncertainties(coreList, min_i, max_i, low_i);
  const deltaReactorsHighE = totalCoreSignalHigh > 0? totalCoreUncertaintyHigh / totalCoreSignalHigh: 0;
  const deltaReactorsLowE = totalCoreSignalLow > 0? totalCoreUncertaintyLow / totalCoreSignalLow :0;

  const selectedCores = coreList.filter(core => core.outputSignal)
  const [selectedCoreSignal, selectedCoreSignalLow, selectedCoreSignalHigh] =
    getCoreSums(selectedCores, min_i, max_i, low_i);

  // custom cores
  // need separate sums for reactor antineutrino energy above and below E_thresh
  // systematic uncertainy is bigger below E_thresh than above
  // so min_i and max_i get modified
  const customCores = coreList.filter((core) => core.custom);
  const [customTotalSignal, customTotalSignalLow, customTotalSignalHigh] =
    getCoreSums(customCores, min_i, max_i, low_i);

  const geoU238NIU =
    sum(
      detectorEfficiency(effMax, rampUp, enerStart, geo.total.U238.spectrum, !isIBD).slice(
        min_i,
        max_i
      )
    ) * 0.01;
  const geoU235NIU =
    sum(
      detectorEfficiency(effMax, rampUp, enerStart, geo.total.U235.spectrum, !isIBD).slice(
        min_i,
        max_i
      )
    ) * 0.01;
  const geoTh232NIU =
    sum(
      detectorEfficiency(effMax, rampUp, enerStart, geo.total.Th232.spectrum, !isIBD).slice(
        min_i,
        max_i
      )
    ) * 0.01;
  const geoK40betaNIU =
    sum(
      detectorEfficiency(effMax, rampUp, enerStart, geo.total.K40Beta.spectrum, !isIBD).slice(
        min_i,
        max_i
      )
    ) * 0.01;
  const geoTotalNIU = geoU238NIU + geoTh232NIU + geoK40betaNIU + geoU235NIU;

  // for now assume a flat spectrum with maximum energy of 10 MeV
  const bkgNuisanceNIU =
    (bkgnuisance * (eMax - eMin)) / (10 - IBD_THRESHOLD * isIBD);

  let UIsignal = 0;
  let UIbackground = 0;
  let UIBackgroundUncertainty = 0;

  if (signal === "selected") {
    UIsignal = selectedCoreSignal;
    UIbackground = geoTotalNIU + bkgNuisanceNIU + totalCoreSignal - selectedCoreSignal;
    UIBackgroundUncertainty = Math.hypot(
      (geo.total.NIUUncertainty),
        (bkgNuisanceNIU * deltaBkgnuisance),
        ((totalCoreSignalHigh - selectedCoreSignalHigh) * deltaReactorsHighE),
        ((totalCoreSignalLow - selectedCoreSignalLow) * deltaReactorsLowE)
    );
  }
  if (signal === "all") {
    UIsignal = totalCoreSignal;
    UIbackground = geoTotalNIU + bkgNuisanceNIU;
    UIBackgroundUncertainty = Math.hypot(
      (geo.total.NIUUncertainty), 
      (bkgNuisanceNIU * deltaBkgnuisance)
    );
  }
  if (signal === "closest") {
    UIsignal = closestNIU;
    UIbackground = geoTotalNIU + bkgNuisanceNIU + totalCoreSignal - closestNIU;
    UIBackgroundUncertainty = Math.hypot(
      (geo.total.NIUUncertainty),
        (bkgNuisanceNIU * deltaBkgnuisance),
        ((totalCoreSignalHigh - closestHighNIU) * deltaReactorsHighE),
        ((totalCoreSignalLow - closestLowNIU) * deltaReactorsLowE)
    );
  }
  if (signal === "custom") {
    UIsignal = customTotalSignal;
    UIbackground =
      geoTotalNIU + bkgNuisanceNIU + totalCoreSignal - customTotalSignal;
    UIBackgroundUncertainty = Math.hypot(
      (geo.total.NIUUncertainty,
        (bkgNuisanceNIU * deltaBkgnuisance),
        ((totalCoreSignalHigh - customTotalSignalHigh) * deltaReactorsHighE),
        ((totalCoreSignalLow - customTotalSignalLow) * deltaReactorsLowE),
    );
  }
  if (signal === "geoneutrino") {
    UIbackground = totalCoreSignal + bkgNuisanceNIU;
    UIsignal = geoTotalNIU;
    UIBackgroundUncertainty = Math.hypot(
      (totalCoreSignalHigh * deltaReactorsHighE),
        (totalCoreSignalLow * deltaReactorsLowE),
        (bkgNuisanceNIU * deltaBkgnuisance),
    );
  }
  if (signal === "geo_u8") {
    UIbackground = totalCoreSignal + bkgNuisanceNIU + geoTotalNIU - geoU238NIU;
    UIsignal = geoU238NIU;
    UIBackgroundUncertainty = Math.hypot(
      (geo.total.NIUUncertainty - geo.total.U238.NIUUncertainty),
        (bkgNuisanceNIU * deltaBkgnuisance),
        (totalCoreSignalHigh * deltaReactorsHighE),
        (totalCoreSignalLow * deltaReactorsLowE),
    );
  }
  if (signal === "geo_th") {
    UIbackground = totalCoreSignal + bkgNuisanceNIU + geoTotalNIU - geoTh232NIU;
    UIsignal = geoTh232NIU;
    UIBackgroundUncertainty = Math.hypot(
      (geo.total.NIUUncertainty - geo.total.Th232.NIUUncertainty),
        (bkgNuisanceNIU * deltaBkgnuisance),
        (totalCoreSignalHigh * deltaReactorsHighE),
        (totalCoreSignalLow * deltaReactorsLowE),
    );
  }
  if (signal === "geo_k") {
    UIbackground =
      totalCoreSignal + bkgNuisanceNIU + geoTotalNIU - geoK40betaNIU;
    UIsignal = geoK40betaNIU;
    UIBackgroundUncertainty = Math.hypot(
      (geo.total.NIUUncertainty - geo.total.K40Beta.NIUUncertainty),
        (bkgNuisanceNIU * deltaBkgnuisance),
        (totalCoreSignalHigh * deltaReactorsHighE),
        (totalCoreSignalLow * deltaReactorsLowE),
    );
  }
  if (signal === "geo_u5") {
    UIbackground = totalCoreSignal + bkgNuisanceNIU + geoTotalNIU - geoU235NIU;
    UIsignal = geoU235NIU;
    UIBackgroundUncertainty = Math.hypot(
      (geo.total.NIUUncertainty - geo.total.U235.NIUUncertainty),
        (bkgNuisanceNIU * deltaBkgnuisance),
        (totalCoreSignalHigh * deltaReactorsHighE),
        (totalCoreSignalLow * deltaReactorsLowE),
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

  let UIeventsSignal = UIsignal * UITime;
  let UIeventsBackground = UIbackground * UITime;
  let UIeventsUncertainty = UIBackgroundUncertainty * UITime;

  // Should be set to infinity
  if (UIExposureNever) {
    UIeventsSignal = 0;
    UIeventsBackground = 0;
    UIeventsUncertainty = 0;
  }

  return (
    <Card>
      <Card.Header>Significance/Exposure Calculator</Card.Header>
      <Card.Body>
        <Provider>
          <div>
            <small>The numbers of detected signal <i>S</i> and background <i>B</i> events are the integrals of the respective rate spectra multiplied by the detector exposure. 
                   The currently selected cross section is {crossSection.crossSection}. 
                   If IBD, <i>S</i> is modified by the detection efficiency.
                   If ES, <i>S</i> is modified by the selected range of the scattered electron kinetic energy, which is currently from {crossSection.elasticScatteringTMin.toFixed(1)} to {crossSection.elasticScatteringTMax.toFixed(1)} MeV.</small>
            <Table>
              <tbody>
              <tr>
                <td>
                  Detected events
                </td>
                <td>
                  <i>S</i> = <Num v={UIeventsSignal} p={2} />
                </td>
                <td>
                  <i>B</i> = <Num v={UIeventsBackground} p={2} />
                </td>
                <td>
                  <i>&delta;B</i> = <Num v={UIeventsUncertainty} p={2} /> (syst)
                </td>
              </tr>
              </tbody>
            </Table>
          </div>
          <Form noValidate>
            <Form.Group controlId="signal">
              <Form.Label>Signal (background)</Form.Label>
              <Form.Control as="select" onChange={UIsetSelect} value={signal}>
                <option value="selected">
                  {selectedCores.length} Selected Cores (geoneutrinos + {coreList.length - selectedCores.length} other cores)
                </option>
                <option value="closest">
                  Closest Core (geoneutrinos + other cores)
                </option>
                <option value="custom">
                  Custom Core (geoneutrinos + IAEA cores)
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
              <small>Select cores on Reactors tab</small>
            </Form.Group>
            <Form.Group controlId="solve_for">
              <Form.Label>Solve For</Form.Label>
              <Form.Control as="select" onChange={UIsetSelect} value={solveFor}>
                <option value="exposure">Exposure</option>
                <option value="significance">Significance</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="bkg_nuisance">
              <Form.Label>Nuisance Background Rate</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text><i>b</i><sub>nuisance</sub></InputGroup.Text>
                </InputGroup.Prepend>
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

        <Row>
          <Col>
            <Form.Group controlId="e_min">
              <Form.Label>
                Antineutrino Energy Minimum
              </Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text><i>E</i><sub>min</sub></InputGroup.Text>
                </InputGroup.Prepend>
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
          </Col>
          <Col>
            <Form.Group controlId="e_max">
              <Form.Label>
                Antineutrino Energy Maximum
              </Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text><i>E</i><sub>max</sub></InputGroup.Text>
                </InputGroup.Prepend>
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
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group controlId="time">
              <Form.Label>Detector Exposure</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text><i>&xi;</i></InputGroup.Text>
                </InputGroup.Prepend>
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
                  <i>N<sub>σ</sub></i> &lowast; <i>&delta;B > S</i> 
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="sigma">
              <Form.Label>
                Significance
              </Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text><i>N<sub>σ</sub></i></InputGroup.Text>
                </InputGroup.Prepend>
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
          </Col>
        </Row>
  
        <Row>
          <Col>
            <Form.Group controlId="eff_max">
              <Form.Label>Efficiency Maximum</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text><i>&epsilon;</i><sub>max</sub></InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  onChange={UIsetEffMax}
                  type="number"
                  step="0.1"
                  value={isIBD? effMax: ""}
                  disabled={!isIBD}
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="ener_start">
              <Form.Label>Half-Maximum Energy</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text><i>E</i><sub>HM</sub></InputGroup.Text>
                </InputGroup.Prepend>
                  <Form.Control
                  onChange={UIsetEnerStart}
                  type="number"
                  step="0.1"
                  value={isIBD? enerStart : ""}
                  disabled={!isIBD}
                />
                <InputGroup.Append>
                  <InputGroup.Text>MeV</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="ramp_up">
              <Form.Label>Efficiency Ramp-up</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text><i>&rho;</i></InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  onChange={UIsetRampUp}
                  type="number"
                  step="0.1"
                  value={isIBD? rampUp : ""}
                  disabled={!isIBD}
                />
                <InputGroup.Append>
                  <InputGroup.Text>
                    MeV<sup>-1</sup>
                  </InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
  
          </Form>
            <div>
              <small>
                The parameters above modify the IBD detection efficiency. See plot and description below. 
              </small>
              <br />
            </div>
            <Visible>
            <Plot
              useResizeHandler={true}
              style={{ width: "100%" }}
              data={plotData} 
              layout={layout}
              config={config}
            />
            </Visible>
          <div>
            <br />
            <b> Significance Calculation</b><br />
            <p> The significance of the background-subtracted number of signal events <i>S</i> depends 
            on the systematic uncertainty of the estimated number of background events{" "}
            <Node inline>{String.raw`\delta B`}</Node> and
            the statistical uncertainty of the total number of candidate events{" "}
            <Node inline>{String.raw`\sqrt{S + B}.`}</Node> In terms of the detector exposure{" "}
            <Node inline>{String.raw`\xi,`}</Node> the significance is given by 
            <Node>{String.raw`N_{\sigma} = \frac{ s * \xi }{\sqrt{(s + b) * \xi + (\delta b * \xi )^2}},`}</Node>{" "}
            where <Node inline>{String.raw`s`}</Node> is the signal rate,{" "}
            <Node inline>{String.raw`b`}</Node> is the background rate, and{" "}
            <Node inline>{String.raw`\delta b`}</Node> is the systematic uncertainty of the background rate.
            The fractional systematic uncetainties of the estimated numbers of reactor antineutrino events and geoneutrino events 
            depend on the selected models. 
            The nuisance background has a fixed uncertainty of 0.5 and a flat energy spectrum.
            </p>
            <p>
            <b> IBD Detection Efficiency</b><br />
            When expressed as a function of antineutrino energy <i>E</i>, the detection efficiency is
            valid for IBD only. Here it is approximated by a sigmoid curve
            <Node>{String.raw`\varepsilon (E) = \frac {\varepsilon_\mathrm{max}} {1 + \exp(-\rho * (E - E_\mathrm{HM}))},`}</Node>{" "}
            where <Node inline>{String.raw`\varepsilon_\mathrm{max}`}</Node> is the asymptote at infinite energy 
            (maximum detection efficiency),{" "}
            <Node inline>{String.raw`E_\mathrm{HM}`}</Node> is the inflection point energy 
            (energy at one-half of the maximum efficiency), and{" "}
            <Node inline>{String.raw`\rho`}</Node> is the slope 
            (efficiency ramp-up rate). 
            For monolithic detectors of Cherenkov and/or scintillation light the values of these parameters depend on the
            photosensitive surface and the target liquid. 
            A conversion of the detection efficiency from a function of antineutrino energy to a function of scattered charged lepton kinetic energy is in the works.
            </p>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};
