import React, { useState, useContext } from "react";
import { Card, Form, InputGroup, Table, Row, Col } from "react-bootstrap";
import { sum } from "lodash";
import { Node, Provider } from "@nteract/mathjax";
import { PhysicsContext } from "../state";
import { XSNames } from "../physics/neutrino-cross-section";
import { IBD_THRESHOLD } from "../physics/derived";
import { Num } from ".";
import { bins } from "../physics/neutrino-oscillation";
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

const effFunc = (eV, Emax, rampUp, turnOn) => {
  return Emax / (1 + Math.exp(-rampUp * (eV - turnOn)))
}

const detectorEfficiency = (
  Emax,
  rampUp,
  halfMax,
  spectrum,
  perfect = false
) => {
  if (perfect) {
    return spectrum;
  }
  return bins.map(
    (eV, i) =>
    effFunc(eV, Emax, rampUp, halfMax) * spectrum[i]
  );
};

export const CalculatorPanel = ({ cores, spectrum }) => {
  const [signal, setSignal] = useState("selected");
  const [solveFor, setSolveFor] = useState("significance");
  const [eMin, setEMin] = useState(0.0);
  const [eMax, setEMax] = useState(10.0);
  const [time, setTime] = useState(1.0);
  const [sigma, setSigma] = useState(3.0);
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
  // detection efficiency function parameters
  const [effMax, setEffMax] = useState(1.0);
  const [enerHalfmax, setEnerHalfmax] = useState(
    parseFloat(IBD_THRESHOLD.toFixed(1))
  );
  const [rampUp, setRampUp] = useState(300);

  const { crossSection } = useContext(PhysicsContext);

  // plot config

  const plotData = [
    {
      y: bins.map((eV) => effFunc(eV, effMax, rampUp, enerHalfmax)),
      x: bins,
      name: "Eff Curve",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "Black" },
    },
  ]
  
  var layout = {
    title: "IBD Detector Efficiency",
    yaxis: {
      title: { text: `Detector Efficiency` },
      range: [0, 1.05]
    },
    xaxis: {
      title: { text: `Neutrino Energy (MeV)` },
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

  const UIsetEnerHalfmax = (event) => {
    const value = event.target.value;
    let stateEnerhalfmax = parseFloat(IBD_THRESHOLD.toFixed(1)) * isIBD;
    let ener_halfmax = parseFloat(value);
    if (isNaN(ener_halfmax)) {
      setEnerHalfmax(value);
    } else {
      if (ener_halfmax < stateEnerhalfmax) {
        ener_halfmax = stateEnerhalfmax;
      }
      if (eMax < ener_halfmax) {
        ener_halfmax = eMax;
      }
      setEnerHalfmax(ener_halfmax);
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
      detectorEfficiency(effMax, rampUp, enerStart, spectrum.geoU238, !isIBD).slice(
        min_i,
        max_i
      )
    ) * 0.01;
  const geoU235NIU =
    sum(
      detectorEfficiency(effMax, rampUp, enerStart, spectrum.geoU235, !isIBD).slice(
        min_i,
        max_i
      )
    ) * 0.01;
  const geoTh232NIU =
    sum(
      detectorEfficiency(effMax, rampUp, enerStart, spectrum.geoTh232, !isIBD).slice(
        min_i,
        max_i
      )
    ) * 0.01;
  const geoK40betaNIU =
    sum(
      detectorEfficiency(effMax, rampUp, enerStart, spectrum.geoK40_beta, !isIBD).slice(
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
    UIBackgroundUncertainty = Math.sqrt(
      (geoTotalNIU * deltaGeoNu) ** 2 +
        (bkgNuisanceNIU * deltaBkgnuisance) ** 2 +
        ((totalCoreSignalHigh - selectedCoreSignalHigh) * deltaReactorsHighE) ** 2 +
        ((totalCoreSignalLow - selectedCoreSignalLow) * deltaReactorsLowE) ** 2
    );
  }
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
            <small>Detected events = efficiency fn (below) x interaction spectrum- {crossSection.crossSection}</small>
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
            <Form.Group controlId="ener_half">
              <Form.Label>Efficiency Half-Maximum</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text><i>E</i><sub>HM</sub></InputGroup.Text>
                </InputGroup.Prepend>
                  <Form.Control
                  onChange={UIsetEnerHalfMax}
                  type="number"
                  step="0.1"
                  value={isIBD? enerHalfmax : ""}
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
            </Form>
            <div>
              <small>
                1 NIU (Neutrino Interaction Unit) = 1 interaction/10<sup>32</sup>{" "}
                targets/year
              </small>
              <br />
              <small>
                1 kT H<sub>2</sub>O contains 6.686x10<sup>31</sup> free proton and
                3.343x10<sup>32</sup> electron targets
              </small>
              <br />
            </div>
          <div>
            <Plot
              useResizeHandler={true}
              style={{ width: "100%" }}
              data={plotData} 
              layout={layout}
              config={config}
            />
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
            The fractional systematic uncetainty of the estimated reactor rate is 
            0.06 (0.3) for antineutrino energy above (below) the IBD threshold, while for the 
            estimated geoneutrino rate and nuisance background rate it is 0.25 and 0.5, respectively. 
            The nuisance background energy spectrum is flat.
            </p>
            <p>
            <b> Detection Efficiency Function</b><br />
            Detection efficiency expressed as a function of antineutrino energy <i>E</i> is
            valid for IBD only. Here it is approximated by
            <Node>{String.raw`\varepsilon (E) = \frac {\varepsilon_\mathrm{max}} {1 + \exp(-\rho * (E - E_\mathrm{HM}))},`}</Node>{" "}
            where <Node inline>{String.raw`\varepsilon_\mathrm{max}`}</Node> sets
            the maximum detection efficiency,{" "}
            <Node inline>{String.raw`E_\mathrm{HM}`}</Node> is
            the energy of the efficiency half-maximum, and{" "}
            <Node inline>{String.raw`\rho`}</Node> controls
            the rate the efficiency ramps up. 
            For monolithic detectors of Cherenkov and/or scintillation light the values of these parameters depend on the
            photosensitive surface and the target liquid. (Try {" "}
            <Node inline>{String.raw`\rho = 3.5, E_\mathrm{HM} = 3.8`}</Node> MeV to 
            approximate the curve on the slide from Marc.)
            </p>
          </div>
        </Provider>
      </Card.Body>
    </Card>
  );
};
