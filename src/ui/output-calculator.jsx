import React, { useState, useContext } from "react";
import { Card, Form, InputGroup, Table, Row, Col } from "react-bootstrap";
import { sum } from "lodash";
import { MathJax } from "better-react-mathjax";
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

export const CalculatorPanel = ({ cores, geo, active}) => {
  const [signal, setSignal] = useState("selected");
  const [solveFor, setSolveFor] = useState("significance");
  const [eMin, setEMin] = useState(0.0);
  const [eMax, setEMax] = useState(10.0);
  const [time, setTime] = useState(1.0);
  const [sigma, setSigma] = useState(3.0);
  // eslint-disable-next-line no-unused-vars
  const [bkgnuisance, setBkgnuisance] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [evtthreshold, setEvtthreshold] = useState(10);
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

  if (!active){
    return <div>Not Active</div>
  }

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
    title: "pIBD Detection Efficiency",
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
  
  const UIsetEvtThreshold = (event) => {
    const value = event.target.value;
    let evt_threshold = parseFloat(value);
    if (isNaN(evt_threshold)) {
      setEvtthreshold(value);
    } else {
      if (evt_threshold < 2) {
        evt_threshold = 2;
      }
      setEvtthreshold(evt_threshold);
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
      detectorUncertainty: detectorEfficiency(
        effMax,
        rampUp,
        enerStart,
        core.detectorUncertainty,
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

  const geoLevels = new Set(["total", "crust", "mantle"])
  const geoIsotopes = new Set(["U238", "U235", "Th232", "K40Beta"])
  const geoCalc = {}
  for (let level of geoLevels){
    geoCalc[level] = {
      NIU: 0,
      NIUUncertainty: 0,
    }
    for (let isotope of geoIsotopes){
      geoCalc[level][isotope] = {
        NIU: sum(
      detectorEfficiency(effMax, rampUp, enerStart, geo[level][isotope].spectrum, !isIBD).slice(
        min_i,
        max_i
      )
    ) * 0.01,
    NIUUncertainty: sum(
      detectorEfficiency(effMax, rampUp, enerStart, geo[level][isotope].spectrumUncertainty, !isIBD).slice(
        min_i,
        max_i
      )
    ) * 0.01,
      }
    geoCalc[level].NIU += geoCalc[level][isotope].NIU
    geoCalc[level].NIUUncertainty += geoCalc[level][isotope].NIUUncertainty
    }
  }

  // for now assume a flat spectrum with maximum energy of 10 MeV
  const bkgNuisanceNIU =
    (bkgnuisance * (eMax - eMin)) / (10 - IBD_THRESHOLD * isIBD);

  let UIsignal = 0;
  let UIbackground = 0;
  let UIBackgroundUncertainty = 0;

  if (signal === "selected") {
    UIsignal = selectedCoreSignal;
    UIbackground = geoCalc.total.NIU + bkgNuisanceNIU + totalCoreSignal - selectedCoreSignal;
    UIBackgroundUncertainty = Math.hypot(
      (geoCalc.total.NIUUncertainty),
        (bkgNuisanceNIU * deltaBkgnuisance),
        ((totalCoreSignalHigh - selectedCoreSignalHigh) * deltaReactorsHighE),
        ((totalCoreSignalLow - selectedCoreSignalLow) * deltaReactorsLowE)
    );
  }
  if (signal === "all") {
    UIsignal = totalCoreSignal;
    UIbackground = geoCalc.total.NIU + bkgNuisanceNIU;
    UIBackgroundUncertainty = Math.hypot(
      (geoCalc.total.NIUUncertainty), 
      (bkgNuisanceNIU * deltaBkgnuisance)
    );
  }
  if (signal === "antinus") {
    UIsignal = totalCoreSignal + geoCalc.total.NIU;
    UIbackground = bkgNuisanceNIU;
    UIBackgroundUncertainty = ( 
      bkgNuisanceNIU * deltaBkgnuisance
    );
  }
  if (signal === "closest") {
    UIsignal = closestNIU;
    UIbackground = geoCalc.total.NIU + bkgNuisanceNIU + totalCoreSignal - closestNIU;
    UIBackgroundUncertainty = Math.hypot(
      (geoCalc.total.NIUUncertainty),
        (bkgNuisanceNIU * deltaBkgnuisance),
        ((totalCoreSignalHigh - closestHighNIU) * deltaReactorsHighE),
        ((totalCoreSignalLow - closestLowNIU) * deltaReactorsLowE)
    );
  }
  if (signal === "custom") {
    UIsignal = customTotalSignal;
    UIbackground =
    geoCalc.total.NIU + bkgNuisanceNIU + totalCoreSignal - customTotalSignal;
    UIBackgroundUncertainty = Math.hypot(
      (geoCalc.total.NIUUncertainty),
        (bkgNuisanceNIU * deltaBkgnuisance),
        ((totalCoreSignalHigh - customTotalSignalHigh) * deltaReactorsHighE),
        ((totalCoreSignalLow - customTotalSignalLow) * deltaReactorsLowE),
    );
  }
  if (signal === "geoneutrino") {
    UIbackground = totalCoreSignal + bkgNuisanceNIU;
    UIsignal = geoCalc.total.NIU;
    UIBackgroundUncertainty = Math.hypot(
      (totalCoreSignalHigh * deltaReactorsHighE),
        (totalCoreSignalLow * deltaReactorsLowE),
        (bkgNuisanceNIU * deltaBkgnuisance),
    );
  }
  if (signal === "geo_crust") {
    UIbackground = totalCoreSignal + bkgNuisanceNIU + geoCalc.mantle.NIU;
    UIsignal = geoCalc.crust.NIU;
    UIBackgroundUncertainty = Math.hypot(
      (geoCalc.mantle.NIUUncertainty),
      (totalCoreSignalHigh * deltaReactorsHighE),
        (totalCoreSignalLow * deltaReactorsLowE),
        (bkgNuisanceNIU * deltaBkgnuisance),
    );
  }
  if (signal === "geo_mantle") {
    UIbackground = totalCoreSignal + bkgNuisanceNIU + geoCalc.crust.NIU;
    UIsignal = geoCalc.mantle.NIU;
    UIBackgroundUncertainty = Math.hypot(
      (geoCalc.crust.NIUUncertainty),
      (totalCoreSignalHigh * deltaReactorsHighE),
        (totalCoreSignalLow * deltaReactorsLowE),
        (bkgNuisanceNIU * deltaBkgnuisance),
    );
  }
  if (signal === "geo_u8") {
    UIbackground = totalCoreSignal + bkgNuisanceNIU + geoCalc.total.NIU - geoCalc.total.U238.NIU;
    UIsignal = geoCalc.total.U238.NIU;
    UIBackgroundUncertainty = Math.hypot(
      (geoCalc.total.NIUUncertainty - geoCalc.total.U238.NIUUncertainty),
        (bkgNuisanceNIU * deltaBkgnuisance),
        (totalCoreSignalHigh * deltaReactorsHighE),
        (totalCoreSignalLow * deltaReactorsLowE),
    );
  }
  if (signal === "geo_th") {
    UIbackground = totalCoreSignal + bkgNuisanceNIU + geoCalc.total.NIU - geoCalc.total.Th232.NIU;
    UIsignal = geoCalc.total.Th232.NIU;
    UIBackgroundUncertainty = Math.hypot(
      (geoCalc.total.NIUUncertainty - geoCalc.total.Th232.NIUUncertainty),
        (bkgNuisanceNIU * deltaBkgnuisance),
        (totalCoreSignalHigh * deltaReactorsHighE),
        (totalCoreSignalLow * deltaReactorsLowE),
    );
  }
  if (signal === "geo_k") {
    UIbackground =
      totalCoreSignal + bkgNuisanceNIU + geoCalc.total.NIU - geoCalc.total.K40Beta.NIU;
    UIsignal = geoCalc.total.K40Beta.NIU;
    UIBackgroundUncertainty = Math.hypot(
      (geoCalc.total.NIUUncertainty - geoCalc.total.K40Beta.NIUUncertainty),
        (bkgNuisanceNIU * deltaBkgnuisance),
        (totalCoreSignalHigh * deltaReactorsHighE),
        (totalCoreSignalLow * deltaReactorsLowE),
    );
  }
  if (signal === "geo_u5") {
    UIbackground = totalCoreSignal + bkgNuisanceNIU + geoCalc.total.NIU - geoCalc.total.U235.NIU;
    UIsignal = geoCalc.total.U235.NIU;
    UIBackgroundUncertainty = Math.hypot(
      (geoCalc.total.NIUUncertainty - geoCalc.total.U235.NIUUncertainty),
        (bkgNuisanceNIU * deltaBkgnuisance),
        (totalCoreSignalHigh * deltaReactorsHighE),
        (totalCoreSignalLow * deltaReactorsLowE),
    );
  }

  let UITime = time;
  let UISigma = sigma;
  let UIExposureNever = false;
  let UITotalUnderThreshold = false;

  if (solveFor === "exposure") {
    UITime =
      (sigma ** 2 * (UIsignal + UIbackground)) /
      (UIsignal ** 2 - sigma ** 2 * UIBackgroundUncertainty ** 2);
    if (sigma * UIBackgroundUncertainty >= UIsignal) {
      UIExposureNever = true;
    }
    if (UITime >= 0 && (UIsignal + UIbackground) * UITime < evtthreshold) {
      UITotalUnderThreshold = true;
    }
    UITime = UITime.toFixed(4);
  }

  if (solveFor === "significance") {
    UISigma =
      (UIsignal * time) /
      Math.sqrt(
        (UIsignal + UIbackground) * time + (UIBackgroundUncertainty * time) ** 2
      );
    if ((UIsignal + UIbackground) * time < evtthreshold) {
      UISigma = 0;
      UITotalUnderThreshold = true;
    }
    UISigma = UISigma.toFixed(3);
  }
  
  if (solveFor === "exposure_h0") {
    UITime =
      (sigma ** 2 * UIbackground) /
      (UIsignal ** 2 - sigma ** 2 * UIBackgroundUncertainty ** 2);
    if (sigma * UIBackgroundUncertainty >= UIsignal) {
      UIExposureNever = true;
    }
    if (UITime >= 0 && UIbackground * UITime < evtthreshold) {
      UITotalUnderThreshold = true;
    }
    UITime = UITime.toFixed(4);
  }

  if (solveFor === "significance_h0") {
    UISigma =
      (UIsignal * time) /
      Math.sqrt(
        (UIbackground) * time + (UIBackgroundUncertainty * time) ** 2
      );
    if (UIbackground * time < evtthreshold) {
      UISigma = 0;
      UITotalUnderThreshold = true;
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
          <div>
            <small>The numbers of detected signal <i>S</i> and background <i>B</i> events are the integrals of the respective rate spectra multiplied by the detector exposure. 
                   The currently selected cross section is {crossSection.crossSection}. 
                   If pIBD, <i>S</i> is modified by the detection efficiency.
                   If eES, <i>S</i> is modified by the selected range of the scattered electron kinetic energy, which is currently from {crossSection.elasticScatteringTMin.toFixed(1)} to {crossSection.elasticScatteringTMax.toFixed(1)} MeV.</small>
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
                <option value="antinus">Antineutrinos (non-antineutrino)</option>
                <option value="geoneutrino">Geoneutrinos (reactors)</option>
                <option value="geo_crust">
                  Crust geoneutrinos (reactors + mantle geoneutrinos)
                </option>
                <option value="geo_mantle">
                  Mantle geoneutrinos (reactors + crust geoneutrinos)
                </option>
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
                <option value="exposure_h0">Exposure- Null hypothesis</option>
                <option value="significance_h0">Significance- Null hypothesis</option>
                <option value="exposure">Exposure- Alternative hypothesis</option>
                <option value="significance">Significance- Alternative hypothesis</option>
              </Form.Control>
            </Form.Group>

        <Row>
          <Col>
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
          </Col>
          <Col>
             <Form.Group controlId="evt_threshold">
              <Form.Label>Event Threshold</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text><i>N</i><sub>events</sub></InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  onChange={UIsetEvtThreshold}
                  type="number"
                  value={evtthreshold}
                />
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
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
                  <i>N<sub>σ</sub></i> &lowast; <i>&delta;B &gt; S</i> 
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
                  isInvalid={UITotalUnderThreshold}
                  onChange={UIsetSigma}
                  type="number"
                  step="0.1"
                  value={UISigma}
                />
                <Form.Control.Feedback type="invalid">
                  Events below threshold 
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
  
        <Row>
          <small>The following parameters modify the pIBD detection efficiency as plotted and described below.</small>
          <br />
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
                  step="0.05"
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
            <b> Significance Calculations</b><br />
            <p> The optional significance statistics are expressed in terms of{" "}
            <MathJax inline>{String.raw`$\xi$`}</MathJax> the detector exposure,{" "}
            <MathJax inline>{String.raw`$s\; (= S / \xi)$`}</MathJax> the signal rate,{" "}
            <MathJax inline>{String.raw`$b\; (= B / \xi)$`}</MathJax> the background rate, and{" "}
            <MathJax inline>{String.raw`$\delta b$`}</MathJax> the systematic uncertainty of the background rate. 
            Reactor antineutrinos and geoneutrinos have systematic uncertainties that depend on the selected input data.
            The nuisance background has a fixed fractional uncertainty of 0.5 and a flat energy spectrum.
            </p>
            <br /> 
            <i> Null Hypothesis- H<sub>0</sub></i><br />
            <MathJax>{String.raw`$$N_{\sigma} = \frac{ s * \xi }{\sqrt{b * \xi + (\delta b * \xi )^2}}$$`}</MathJax>{" "}
            <br />
            <i> Alternative Hypothesis- H<sub>1</sub></i><br />  
            <MathJax>{String.raw`$$N_{\sigma} = \frac{ s * \xi }{\sqrt{(s + b) * \xi + (\delta b * \xi )^2}}$$`}</MathJax>{" "}
            <br />
            <b> pIBD Detection Efficiency</b><br />
            <p> When expressed as a function of antineutrino energy <i>E</i>, the detection efficiency is
            valid for pIBD only. Here it is approximated by a sigmoid curve{" "}
            <MathJax>{String.raw`$$\varepsilon (E) = \frac {\varepsilon_\mathrm{max}} {1 + \exp\big(-\rho * (E - E_\mathrm{HM})\big)},$$`}</MathJax>{" "}
            where <MathJax inline>{String.raw`$\varepsilon_\mathrm{max}$`}</MathJax> is the asymptote at infinite energy 
            (maximum detection efficiency),{" "}
            <MathJax inline>{String.raw`$E_\mathrm{HM}$`}</MathJax> is the inflection point energy 
            (energy at one-half of the maximum efficiency), and{" "}
            <MathJax inline>{String.raw`$\rho$`}</MathJax> is the slope 
            (efficiency ramp-up rate).
            Conversion of the detection efficiency from a function of antineutrino energy to a function of scattered charged particle kinetic energy is a planned upgrade.
            </p>
          </div>
      </Card.Body>
    </Card>
  );
};
