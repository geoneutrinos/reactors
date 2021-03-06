import React, { useContext } from "react";
import { sum } from "lodash";
import { Card, Table } from "react-bootstrap";

import { Elements } from "./elements";

import {
  rateToFlux232Th,
  rateToFlux238U,
  rateToFlux40K,
} from "../antineutrino-spectrum";
import { ISOTOPIC_NEUTRINO_LUMINOSITY } from "../physics/derived";
import { ISOTOPIC_NATURAL_ABUNDANCE } from "../physics/constants";
import {PhysicsContext} from "../state"

import { Num } from '.'

const { U238, Th232, K40 } = Elements;



const geoThURatio = (R232Th, R238U, crossSection) => {
  const R = R232Th / R238U;
  const C = rateToFlux232Th[crossSection] / rateToFlux238U[crossSection];
  const l =
    ISOTOPIC_NEUTRINO_LUMINOSITY.U238 / ISOTOPIC_NEUTRINO_LUMINOSITY.TH232;
  const NA = ISOTOPIC_NATURAL_ABUNDANCE.U238 / ISOTOPIC_NATURAL_ABUNDANCE.TH232;

  return R * C * l * NA;
};

const geoKURatio = (R40K, R238U, crossSection) => {
  const R = R40K / R238U;
  const C = rateToFlux40K[crossSection] / rateToFlux238U[crossSection];
  const l =
    ISOTOPIC_NEUTRINO_LUMINOSITY.U238 / ISOTOPIC_NEUTRINO_LUMINOSITY.K40;
  const NA = ISOTOPIC_NATURAL_ABUNDANCE.U238 / ISOTOPIC_NATURAL_ABUNDANCE.K40;

  return R * C * l * NA;
};

export function StatsPanel({ cores, spectrum, reactorLF}) {
  const {crossSection} = useContext(PhysicsContext)
  const NIU = <span title="Neutrino Interaction Unit">NIU</span>;

  const coreList = Object.values(cores);
  const closestActiveCore = coreList
    .filter((core) => core.detectorAnySignal)
    .filter((core) => !core.custom)
    .sort((a, b) => a.detectorDistance - b.detectorDistance)[0];

  const customCores = coreList.filter((core) => core.custom);
  const closestCustomCore = customCores.sort(
    (a, b) => a.detectorDistance - b.detectorDistance
  )[0];
  // Close Things
  const closestName = closestActiveCore?.name || "";
  const closestNIU = closestActiveCore?.detectorNIU || 0;
  const closestDistace = closestActiveCore?.detectorDistance || 1000000;

  const totalCoreSignal = sum(coreList.map((core) => core.detectorNIU));

  const iaeaCoreSignal = sum(coreList.filter(core => !core.custom).map(core => core.detectorNIU))

  // custom cores
  const customClosestName = closestCustomCore?.name || "";
  const customClosestNIU = closestCustomCore?.detectorNIU || 0;
  const customClosestDistance = closestCustomCore?.detectorDistance || 1000000;
  const customTotalSignal = sum(customCores.map((core) => core.detectorNIU));

  const customDisplay = customTotalSignal > 0 ? "block" : "none";

  // geo thigns
  const geoUNIU = sum(spectrum.geoU) * 0.01;
  const geoThNIU = sum(spectrum.geoTh) * 0.01;
  const geoKNIU = sum(spectrum.geoK) * 0.01;

  const geoThU = geoThURatio(geoThNIU, geoUNIU, crossSection.crossSection);
  const geoKU = geoKURatio(geoKNIU, geoUNIU, crossSection.crossSection);

  const geoKUVald = isNaN(geoKU) ? "none" : "auto";

  const geoTotalNIU = geoUNIU + geoThNIU + geoKNIU;

  // finally
  const totalNIU = totalCoreSignal + geoTotalNIU;

  const tableProps = { style: { width: "auto" }, borderless: true, size: "sm" };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Spectrum Stats <small>({crossSection.crossSection}. See IBD/ES tab.)</small></Card.Title>

        <Table {...tableProps}>
          <tbody>
            <tr>
              <td>
                <i>R</i>
                <sub>total</sub>
              </td>
              <td>=</td>
              <td>
                {totalNIU.toFixed(1)} {NIU}
              </td>
            </tr>
          </tbody>
        </Table>

        <hr />
        <h6>IAEA Cores <small>({reactorLF.start.toISOString().slice(0, 7)} through {reactorLF.end.toISOString().slice(0, 7)} avg Load Factor. See Reactors tab.)</small></h6>
        <Table {...tableProps}>
          <tbody>
            <tr>
              <td>
                <i>R</i>
                <sub>reac</sub>
              </td>
              <td>=</td>
              <td>
                {iaeaCoreSignal.toFixed(1)} {NIU}
              </td>
            </tr>
            <tr>
              <td>
                <i>R</i>
                <sub>closest</sub>
              </td>
              <td>=</td>
              <td>
                {closestNIU.toFixed(1)} {NIU} (
                {((closestNIU / totalNIU) * 100).toFixed(1)} % of total)
              </td>
            </tr>
            <tr>
              <td>
                <i>D</i>
                <sub>closest</sub>
              </td>
              <td>=</td>
              <td>
                {closestDistace > 100000 ? "N/A" : Math.round(closestDistace) === closestDistace? closestDistace.toFixed(0): closestDistace.toFixed(2)} km
                ({closestName})
              </td>
            </tr>
          </tbody>
        </Table>

        <div style={{ display: customDisplay }}>
          <hr />
          <h6>Custom Cores</h6>
          <Table {...tableProps}>
            <tbody>
              <tr>
                <td>
                  <i>R</i>
                  <sub>custom</sub>
                </td>
              <td>=</td>
                <td>
                  {customTotalSignal.toFixed(1)} {NIU}
                </td>
              </tr>
              <tr>
                <td>
                  <i>R</i>
                  <sub>closest</sub>
                </td>
              <td>=</td>
                <td>
                  {customClosestNIU.toFixed(1)} {NIU}{" ("}
                  {((customClosestNIU / totalNIU) * 100).toFixed(1)} % of total)
                </td>
              </tr>
              <tr>
                <td>
                  <i>D</i>
                  <sub>closest</sub>
                </td>
              <td>=</td>
                <td>
                  {Math.round(customClosestDistance) === customClosestDistance? customClosestDistance.toFixed(0): customClosestDistance.toFixed(2)} km ({customClosestName})
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div>
          <hr />
          <h6>Geoneutrinos <small>(Crust prediction plus user-defined Mantle model. See GeoNu tab.)</small></h6>
          <Table {...tableProps}>
            <tbody>
              <tr>
                <td>
                  <i>R</i>
                  <sub>geo</sub>
                </td>
              <td>=</td>
                <td>
                  <Num v={geoTotalNIU} p={1} /> {NIU}
                </td>
                <td>
                  (
                  <Num v={geoUNIU} p={1} /> {U238}, <Num v={geoThNIU} p={1} />{" "}
                  {Th232}
                  <span style={{ display: geoKUVald }}>
                    , <Num v={geoKNIU} p={1} /> {K40}
                  </span>
                  )
                </td>
              </tr>
              <tr>
                <td>
                  <i>(Th/U)</i>
                  <sub>geo</sub>
                </td>
              <td>=</td>
                <td>
                  <Num v={geoThU} p={2} />
                </td>
              </tr>
              <tr style={{ display: geoKUVald }}>
                <td>
                  <i>(K/U)</i>
                  <sub>geo</sub>
                </td>
              <td>=</td>
                <td>
                  <Num
                    v={geoKU}
                    p={0}
                    func={(v) => Math.round(v / 100) * 100}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <hr />
        <div>
          <small>
            1 {NIU} (Neutrino Interaction Unit) = 1 interaction/10<sup>32</sup>{" "}
            targets/year
          </small>
          <br />
          <small>
            1 kT H<sub>2</sub>O contains 6.686x10<sup>31</sup> free proton and
            3.343x10<sup>32</sup> electron targets
          </small>
        </div>
      </Card.Body>
    </Card>
  );
}
