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

export function StatsPanel({ cores, geo, reactorLF}) {
  const {crossSection, reactorAntineutrinoModel} = useContext(PhysicsContext)
  
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
  const closestNIUUncertainty = closestActiveCore?.detectorNIUUncertainty || 0;
  const closestDistace = closestActiveCore?.detectorDistance || 1000000;

  const totalCoreSignal = sum(coreList.map((core) => core.detectorNIU));

  const iaeaCoreSignal = sum(coreList.filter(core => !core.custom).map(core => core.detectorNIU))
  const iaeaCoreSignalUncertainty = sum(coreList.filter(core => !core.custom).map(core => core.detectorNIUUncertainty))

  // custom cores
  const customClosestName = closestCustomCore?.name || "";
  const customClosestNIU = closestCustomCore?.detectorNIU || 0;
  const customClosestNIUUncertainty = closestCustomCore?.detectorNIUUncertainty || 0;
  const customClosestDistance = closestCustomCore?.detectorDistance || 1000000;
  const customTotalSignal = sum(customCores.map((core) => core.detectorNIU));
  const customTotalSignalUncertainty = sum(customCores.map((core) => core.detectorNIUUncertainty));

  const customDisplay = customTotalSignal > 0 ? "block" : "none";

  // geo things
  const geoThU = geoThURatio(geo.total.Th232.NIU, geo.total.U238.NIU, crossSection.crossSection);
  const geoKU = geoKURatio(geo.total.K40Beta.NIU, geo.total.U238.NIU, crossSection.crossSection);

  const geoKUVald = isNaN(geoKU) ? "none" : "auto";

  // finally
  const leptonTVald = isIBD ? "none" : "auto";
  
  const totalNIU = totalCoreSignal + geo.total.NIU;
  const totalNIUUncertainty = Math.hypot(iaeaCoreSignalUncertainty + customTotalSignalUncertainty, geo.total.NIUUncertainty)

  const tableProps = { style: { width: "auto" }, borderless: true, size: "sm" };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Spectrum Stats- <small>{crossSection.crossSection}</small></Card.Title>

       <Card.Subtitle>
           <span style={{ display: leptonTVald }}>
                <small>Scattered electron kinetic energy range: {crossSection.elasticScatteringTMin.toFixed(1)} &lt; T &lt; {crossSection.elasticScatteringTMax.toFixed(1)} MeV</small>
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
                <Num v={totalNIU} u={totalNIUUncertainty} p={1} /> {NIU}
              </td>
            </tr>
          </tbody>
        </Table>

        <hr />
        <h6>IAEA Cores- <small>{reactorAntineutrinoModel.modelName}; {reactorLF.start.toISOString().slice(0, 7)} thru {reactorLF.end.toISOString().slice(0, 7)}</small></h6>
        <Table {...tableProps}>
          <tbody>
            <tr>
              <td>
                <i>R</i>
                <sub>reac</sub>
              </td>
              <td>=</td>
              <td>
                <Num v={iaeaCoreSignal} u={iaeaCoreSignalUncertainty} p={1} /> {NIU}
              </td>
            </tr>
            <tr>
              <td>
                <i>R</i>
                <sub>closest</sub>
              </td>
              <td>=</td>
              <td>
                <Num v={closestNIU} u={closestNIUUncertainty} p={1} /> {NIU} <small> (
                <Num v={((closestNIU / iaeaCoreSignal) * 100)} p={1} /> % of <i>R</i><sub>reac</sub>) </small>
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
                  <Num v={customTotalSignal} u={customTotalSignalUncertainty} p={1} /> {NIU}
                </td>
              </tr>
              <tr>
                <td>
                  <i>R</i>
                  <sub>closest</sub>
                </td>
              <td>=</td>
                <td>
                  <Num v={customClosestNIU} u={customClosestNIUUncertainty} p={1} /> {NIU} <small> {" ("}
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
          <h6>Geoneutrinos- <small>Pre-computed crust fluxes; User-defined mantle fluxes; Avg <i>P</i><sub>ee</sub></small></h6>
          <Table {...tableProps}>
            <tbody>
              <tr>
                <td>
                  <i>R</i>
                  <sub>geo</sub>
                </td>
              <td>=</td>
                <td>
                  <Num v={geo.total.NIU} u={geo.total.NIUUncertainty} p={1} /> {NIU}
                </td>
                <td>
                  <small> (
                  <Num v={geo.total.U238.NIU} p={1} /> {U238}{", "}
                  <span style={{ display: geoKUVald }}>
                    <Num v={geo.total.U235.NIU} p={1} /> {U235}{", "}
                  </span>
                  <Num v={geo.total.Th232.NIU} p={1} /> {Th232}
                  <span style={{ display: geoKUVald }}>
                    , <Num v={geo.total.K40Beta.NIU} p={1} /> {K40}<sub>β<sup>-</sup></sub>
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
                  <Num v={geo.crust.NIU} u={geo.crust.NIUUncertainty} p={1} /> {NIU} <small> (
                  <Num v={((geo.crust.NIU / geo.total.NIU) * 100)} p={1} /> % of <i>R</i><sub>geo</sub>) </small>
                </td>
                <td>
                  <small> (
                  <Num v={geo.crust.U238.NIU} p={1} /> {U238}{", "}
                  <span style={{ display: geoKUVald }}>
                    <Num v={geo.crust.U235.NIU} p={1} /> {U235}{", "}
                  </span>
                  <Num v={geo.crust.Th232.NIU} p={1} /> {Th232}
                  <span style={{ display: geoKUVald }}>
                    , <Num v={geo.crust.K40Beta.NIU} p={1} /> {K40}<sub>β<sup>-</sup></sub>
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
                  <Num v={geo.mantle.NIU} u={geo.mantle.NIUUncertainty} p={1} /> {NIU} <small> (
                  <Num v={((geo.mantle.NIU / geo.total.NIU) * 100)} p={1} /> % of <i>R</i><sub>geo</sub>) </small>
                </td>
                <td>
                  <small> (
                  <Num v={geo.mantle.U238.NIU} p={1} /> {U238}{", "}
                  <span style={{ display: geoKUVald }}>
                    <Num v={geo.mantle.U235.NIU} p={1} /> {U235}{", "}
                  </span>
                  <Num v={geo.mantle.Th232.NIU} p={1} /> {Th232}
                  <span style={{ display: geoKUVald }}>
                    , <Num v={geo.mantle.K40Beta.NIU} p={1} /> {K40}<sub>β<sup>-</sup></sub>
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
            Double click on, or hover pointer over, values to display more decimal places
          </small>
          <br />
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
