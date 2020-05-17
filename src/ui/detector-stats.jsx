import React from "react";
import { sum } from "lodash";
import { Card } from 'react-bootstrap';

import { rateToFlux232Th, rateToFlux238U, rateToFlux40K } from '../antineutrino-spectrum'
import { ISOTOPIC_NEUTRINO_LUMINOSITY } from '../physics/derived'
import { ISOTOPIC_NATURAL_ABUNDANCE } from '../physics/constants'

function Num({ v, p, func}) {
  if (func===undefined){
    func = (v) => v
  }
  return <span title={v.toString()}>{func(v).toFixed(p)}</span>;
}

const geoThURatio = (R232Th, R238U, crossSection) => {
  const R = R232Th / R238U;
  const C = rateToFlux232Th[crossSection] / rateToFlux238U[crossSection]
  const l = ISOTOPIC_NEUTRINO_LUMINOSITY.U238 / ISOTOPIC_NEUTRINO_LUMINOSITY.TH232
  const NA = ISOTOPIC_NATURAL_ABUNDANCE.U238 / ISOTOPIC_NATURAL_ABUNDANCE.TH232

  return R * C * l * NA
}

const geoKURatio = (R40K, R238U, crossSection) => {
  const R = R40K / R238U;
  const C = rateToFlux40K[crossSection] / rateToFlux238U[crossSection]
  const l = ISOTOPIC_NEUTRINO_LUMINOSITY.U238 / ISOTOPIC_NEUTRINO_LUMINOSITY.K40
  const NA = ISOTOPIC_NATURAL_ABUNDANCE.U238 / ISOTOPIC_NATURAL_ABUNDANCE.K40

  return R * C * l * NA
}

export function StatsPanel({ cores, spectrum, crossSection }) {
  const NIU = <span title="Neutrino Interaction Unit">NIU</span>;

  const coreList = Object.values(cores);
  const closestActiveCore = coreList
    .filter((core) => core.detectorAnySignal)
    .sort((a, b) => a.detectorDistance - b.detectorDistance)[0];

  const customCores = coreList.filter((core) => core.custom);
  const closestCustomCore = customCores.sort(
    (a, b) => a.detectorDistance - b.detectorDistance
  )[0];
  // Close Things
  const closestNIU = closestActiveCore?.detectorNIU || 0;
  const closestDistace = closestActiveCore?.detectorDistance || 1000000;

  const totalCoreSignal = sum(coreList.map((core) => core.detectorNIU));

  // custom cores
  const customClosestNIU = closestCustomCore?.detectorNIU || 0;
  const customClosestDistance = closestCustomCore?.detectorDistance || 1000000;
  const customTotalSignal = sum(customCores.map((core) => core.detectorNIU));

  const customDisplay = customTotalSignal > 0 ? "inline" : "none";

  // geo thigns
  const geoUNIU = sum(spectrum.geoU) * 0.01;
  const geoThNIU = sum(spectrum.geoTh) * 0.01;
  const geoKNIU = sum(spectrum.geoK) * 0.01;

  const geoThU = geoThURatio(geoThNIU, geoUNIU, crossSection)
  const geoKU = geoKURatio(geoKNIU, geoUNIU, crossSection)

  const geoKUVald = isNaN(geoKU) ? "none" : "inline"

  const geoTotalNIU = geoUNIU + geoThNIU + geoKNIU;

  // finally
  const totalNIU = totalCoreSignal + geoTotalNIU;

  return (
    <Card>
      <Card.Body>
        <Card.Title>Spectrum Stats</Card.Title>
        <i>R</i>
        <sub>total</sub> = {totalNIU.toFixed(1)} {NIU}
        <br />
        <i>R</i>
        <sub>reac</sub> = {totalCoreSignal.toFixed(1)} {NIU}
        <br />
        <i>R</i>
        <sub>closest</sub> = {closestNIU.toFixed(1)} {NIU} (
        {((closestNIU / totalNIU) * 100).toFixed(1)} % of total)
        <br />
        <i>D</i>
        <sub>closest</sub> ={" "}
        {closestDistace > 100000 ? "N/A" : closestDistace.toFixed(2)} km
        <br />
        <span style={{ display: customDisplay }}>
          <i>D</i>
          <sub>user</sub> = {customClosestDistance.toFixed(3)} km
          <br />
        </span>
        <span style={{ display: customDisplay }}>
          <i>R</i>
          <sub>user</sub> = {customClosestNIU.toFixed(1)} {NIU}
          <br />
        </span>
        <i>R</i>
        <sub>geo</sub> = <Num v={geoTotalNIU} p={1} /> {NIU} (U ={" "}
        <Num v={geoUNIU} p={1} />, Th = <Num v={geoThNIU} p={1} />
        <span style={{ display: geoKUVald }}>
          ,{" "}K = <Num v={geoKNIU} p={1} />
        </span>
        )<br />
        Th/U<sub>geo</sub> = <Num v={geoThU} p={2} /><br />
        <span style={{ display: geoKUVald }}>
          K/U<sub>geo</sub> = <Num v={geoKU} p={0} func={(v) => Math.round(v/100) * 100}/><br />
        </span>
        <small>
          1 {NIU} (Neutrino Interaction Unit) = 1 interaction/10<sup>32</sup>{" "}
          targets/year
        </small>
        <br />
        <small>
          1 kT H<sub>2</sub>O contains 6.68x10<sup>31</sup> free proton and
          33.4x10<sup>31</sup> electron targets
        </small>
        <br />
      </Card.Body>
    </Card>
  );
}
