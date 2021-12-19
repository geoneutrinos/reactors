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
import { binWidth } from "../physics/bins";
import { XSNames } from "../physics/neutrino-cross-section";

import { Num } from '.'

const { U238, U235, Th232, K40 } = Elements;


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
  
  // Unary operator + converts true to 1 and false to 0
  const isIBD = +[XSNames.IBDSV2003, XSNames.IBDVB1999].includes(
    crossSection.crossSection
  );
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

  // geo things
  const geo_crustU238NIU = sum(spectrum.geo_crustU238) * binWidth;
  const geo_mantleU238NIU = sum(spectrum.geo_mantleU238) * binWidth;
  const geoU238NIU = geo_crustU238NIU + geo_mantleU238NIU;
  const geo_crustTh232NIU = sum(spectrum.geo_crustTh232) * binWidth;
  const geo_mantleTh232NIU = sum(spectrum.geo_mantleTh232) * binWidth;
  const geoTh232NIU = geo_crustTh232NIU + geo_mantleTh232NIU;
  const geo_crustU235NIU = sum(spectrum.geo_crustU235) * binWidth;
  const geo_mantleU235NIU = sum(spectrum.geo_mantleU235) * binWidth;
  const geoU235NIU = geo_crustU235NIU + geo_mantleU235NIU;
  const geo_crustK40betaNIU = sum(spectrum.geo_crustK40_beta) * binWidth;
  const geo_mantleK40betaNIU = sum(spectrum.geo_mantleK40_beta) * binWidth;
  const geoK40betaNIU = geo_crustK40betaNIU + geo_mantleK40betaNIU

  const geoThU = geoThURatio(geoTh232NIU, geoU238NIU, crossSection.crossSection);
  const geoKU = geoKURatio(geoK40betaNIU, geoU238NIU, crossSection.crossSection);

  const geoKUVald = isNaN(geoKU) ? "none" : "auto";

  const geoTotalNIU = geoU238NIU + geoU235NIU + geoTh232NIU + geoK40betaNIU;
  const geo_crustNIU = geo_crustU238NIU + geo_crustU235NIU + geo_crustTh232NIU + geo_crustK40betaNIU;
  const geo_mantleNIU = geo_mantleU238NIU + geo_mantleU235NIU + geo_mantleTh232NIU + geo_mantleK40betaNIU;

  // finally
  const leptonTVald = isIBD ? "none" : "auto";
  
  const totalNIU = totalCoreSignal + geoTotalNIU;

  const tableProps = { style: { width: "auto" }, borderless: true, size: "sm" };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Spectrum Stats <small>({crossSection.crossSection}- IBD/ES tab.)</small></Card.Title>

       <Card.Subtitle>
           <span style={{ display: leptonTVald }}>
                <small>Scattered charged lepton kinetic energy range: {crossSection.elasticScatteringTMin.toFixed(1)} &lt; T &lt; {crossSection.elasticScatteringTMax.toFixed(1)} MeV</small>
           </span>
       </Card.Subtitle>
    
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
        <h6>IAEA Cores <small>({reactorLF.start.toISOString().slice(0, 7)} through {reactorLF.end.toISOString().slice(0, 7)} avg Load Factor- Reactors tab.)</small></h6>
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
                {closestNIU.toFixed(1)} {NIU} <small> (
                {((closestNIU / iaeaCoreSignal) * 100).toFixed(1)} % of <i>R</i><sub>reac</sub>) </small>
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
                <small> ({closestName}) </small>
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
                  {customClosestNIU.toFixed(1)} {NIU} <small> {" ("}
                  {((customClosestNIU / totalCoreSignal) * 100).toFixed(1)} % of <i>R</i><sub>reac</sub> + <i>R</i><sub>custom</sub>) </small>
                </td>
              </tr>
              <tr>
                <td>
                  <i>D</i>
                  <sub>closest</sub>
                </td>
              <td>=</td>
                <td>
                  {Math.round(customClosestDistance) === customClosestDistance? customClosestDistance.toFixed(0): customClosestDistance.toFixed(2)} km 
                  <small> ({customClosestName}) </small>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div>
          <hr />
          <h6>Geoneutrinos <small>(Predicted crust + user-defined mantle flux- GeoNu tab. Avg P<sub>ee</sub>- Input tab)</small></h6>
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
                  <small> (
                  <Num v={geoU238NIU} p={1} /> {U238}{", "}
                  <span style={{ display: geoKUVald }}>
                    <Num v={geoU235NIU} p={1} /> {U235}{", "}
                  </span>
                  <Num v={geoTh232NIU} p={1} /> {Th232}
                  <span style={{ display: geoKUVald }}>
                    , <Num v={geoK40betaNIU} p={1} /> {K40}<sub>β<sup>-</sup></sub>
                  </span>
                  ) </small>
                </td>
              </tr>
              <tr>
                <td>
                  <i>R</i>
                  <sub>crust</sub>
                </td>
              <td>=</td>
                <td>
                  <Num v={geo_crustNIU} p={1} /> {NIU} <small> (
                {((geo_crustNIU / geoTotalNIU) * 100).toFixed(1)} % of <i>R</i><sub>geo</sub>) </small>
                </td>
                <td>
                  <small> (
                  <Num v={geo_crustU238NIU} p={1} /> {U238}{", "}
                  <span style={{ display: geoKUVald }}>
                    <Num v={geo_crustU235NIU} p={1} /> {U235}{", "}
                  </span>
                  <Num v={geo_crustTh232NIU} p={1} /> {Th232}
                  <span style={{ display: geoKUVald }}>
                    , <Num v={geo_crustK40betaNIU} p={1} /> {K40}<sub>β<sup>-</sup></sub>
                  </span>
                  ) </small>
                </td>
              </tr>
              <tr>
                <td>
                  <i>R</i>
                  <sub>mantle</sub>
                </td>
              <td>=</td>
                <td>
                  <Num v={geo_mantleNIU} p={1} /> {NIU} <small> (
                {((geo_mantleNIU / geoTotalNIU) * 100).toFixed(1)} % of <i>R</i><sub>geo</sub>) </small>
                </td>
                <td>
                  <small> (
                  <Num v={geo_mantleU238NIU} p={1} /> {U238}{", "}
                  <span style={{ display: geoKUVald }}>
                    <Num v={geo_mantleU235NIU} p={1} /> {U235}{", "}
                  </span>
                  <Num v={geo_mantleTh232NIU} p={1} /> {Th232}
                  <span style={{ display: geoKUVald }}>
                    , <Num v={geo_mantleK40betaNIU} p={1} /> {K40}<sub>β<sup>-</sup></sub>
                  </span>
                  ) </small>
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
