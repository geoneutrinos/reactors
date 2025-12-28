import { useState, memo } from "react";
import { sum } from "lodash";
import { rawAntineutrinoSpectrum } from "../antineutrino-spectrum";

import { Card, Form, InputGroup, Table, Row, Col } from "react-bootstrap";
import { Num } from ".";
import { NeutrinoType } from "../physics/neutrino-cross-section";
import { getTargetParamsCEvNS } from "../supernova";
import { crossSectionElasticScattering, NeutrinoTarget } from "../physics/neutrino-cross-section";
import bins, {binWidth} from "../physics/bins"

import {Elements as ElementsUI} from './elements'

import Plot from "react-plotly.js";
import elements, {Element} from '../elements';

import {
  ISOTOPIC_NATURAL_ABUNDANCE,
  ISOTOPIC_NEUTRINOS_PER_DECAY,
  K40_BRANCH_RATIO,
} from '../physics/constants';

import { averageSurvivalProbabilityNormal } from "../physics/neutrino-oscillation";

import { 
  MANTLE_GEOPHYSICAL_RESPONSE, 
  MANTLE_MASS,
  LUNAR_MANTLE_GEOPHYSICAL_RESPONSE, 
  LUNAR_MANTLE_MASS,
} from "../mantle/geophysics";

import {
  layerMasses,
  layerGeoResponse,
} from "../mantle/PREM";

const massFunc = (radBot, radTop) => {
  return layerMasses.slice( radBot * 10, radTop * 10 ).reduce((massSum, currentMass)=>massSum + currentMass, 0)
}

const geoResponseFunc = (radBot, radTop) => {
  return layerGeoResponse.slice( radBot * 10, radTop * 10 ).reduce((responseSum, currentResponse)=>responseSum + currentResponse, 0)
}

const {K40, Th232, U235, U238} = ElementsUI

interface GeoElements {
  K40: number;
  Th232: number;
  U235: number;
  U238: number;
}

type ElementalRecord = Record<keyof typeof elements, GeoElements>

export const CEvNSEventsElemental = (element: Element, TMin:number, fluxSpectrums:any): ElementalRecord => {
  const isotopes = Object.values(elements).filter(isotope => isotope.atomic_number === element.atomic_number)
  const totals: GeoElements = {
    K40: 0,
    Th232: 0, 
    U235:0,
    U238:0,
  }
  const enteries = isotopes.map(isotope => {
    const events = CEvNSEvents(isotope, TMin, fluxSpectrums)

    totals.K40 += events.K40
    totals.Th232 += events.Th232
    totals.U235 += events.U235
    totals.U238 += events.U238

    return [isotope.key, events]
  })
  const records: ElementalRecord = Object.fromEntries(enteries)
  records["total"] = totals
  return records
}

export const CEvNSEvents = (element: Element, TMin:number, fluxSpectrums:any): GeoElements => {
  let targetParams = {tMin: TMin, ...getTargetParamsCEvNS(element)};
  let xsectionCEvNS = bins.map((ev) => crossSectionElasticScattering(ev, NeutrinoType.electronNeutrino, targetParams.tMin, undefined, NeutrinoTarget.nucleus, targetParams.targetMass, targetParams.protonTargets, targetParams.neutronTargets));
  let eventSpectrumCEvNSK40 = fluxSpectrums.K40.map(
    (v, i) => v * xsectionCEvNS[i] * targetParams.nuclearTargets
  );
  let eventSpectrumCEvNSTh232 = fluxSpectrums.Th232.map(
    (v, i) => v * xsectionCEvNS[i] * targetParams.nuclearTargets
  );
  let eventSpectrumCEvNSU235 = fluxSpectrums.U235.map(
    (v, i) => v * xsectionCEvNS[i] * targetParams.nuclearTargets
  );
  let eventSpectrumCEvNSU238 = fluxSpectrums.U238.map(
    (v, i) => v * xsectionCEvNS[i] * targetParams.nuclearTargets
  );
  return {
    K40: sum(eventSpectrumCEvNSK40) * binWidth,
    Th232: sum(eventSpectrumCEvNSTh232) * binWidth,
    U235: sum(eventSpectrumCEvNSU235) * binWidth,
    U238: sum(eventSpectrumCEvNSU238) * binWidth,
  };
};

const GeoNusCEvNS = ({ nucleus, setNucleus, tESnMin, setTESnMin, fluxSpectrums }) => {

  const events = (CEvNSEventsElemental(elements[nucleus], tESnMin/1000, fluxSpectrums))

  const isotopicContributions = Object.entries(events).filter(([key, _value]) => key !== "total").map(([isotope, value]) => {
    return (
      <tr key={isotope}>
      <td>{ElementsUI[isotope]}</td>
      <td>
        <Num v={value.K40} p={2} />
      </td>
      <td>
        <Num v={value.Th232} p={2} />
      </td>
      <td>
        <Num v={value.U235} p={2} />
      </td>
      <td>
        <Num v={value.U238} p={2} />
      </td>
      <td>
        <Num v={value.K40+ value.Th232 + value.U235 + value.U238} p={2} />
      </td>
    </tr> 
    )
  })

  return (
    <Card>
      <Card.Header>
        CEvNS Events (/1000 kg/year)
      </Card.Header>
      <Card.Body>
          <div>
            <Table>
              <tbody>
                <tr>
                  <th></th>
                  <th>{K40}</th>
                  <th>{Th232}</th>
                  <th>{U235}</th>
                  <th>{U238}</th>
                  <th>Total</th>
                </tr>
                <tr>
                  <td>{elements[nucleus].atomic_symbol} Events</td>
                  <td>
                    <Num v={events.total.K40} p={2} />
                  </td>
                  <td>
                    <Num v={events.total.Th232} p={2} />
                  </td>
                  <td>
                    <Num v={events.total.U235} p={2} />
                  </td>
                  <td>
                    <Num v={events.total.U238} p={2} />
                  </td>
                  <td>
                    <Num v={events.total.K40+ events.total.Th232 + events.total.U235 + events.total.U238} p={2} />
                  </td>
                </tr>
              </tbody>
            </Table>
          <details>
            <summary>Events by Isotope</summary>
            <Table>
              <thead>
                <tr>
                  <th></th>
                  <th>{K40}</th>
                  <th>{Th232}</th>
                  <th>{U235}</th>
                  <th>{U238}</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {isotopicContributions}
                </tbody>
                </Table>
                </details>
              <br />
          </div>
          <Form noValidate>
            <Form.Group controlId="set_nucleus">
              <Form.Label>Target Element (increasing atomic number)</Form.Label>
              <Form.Control as="select" onChange={(event) => setNucleus(event.target.value)} value={nucleus}>
                <option value={elements.Ar40.key}>Argon</option>
                <option value={elements.Ge76.key}>Germanium</option>
                <option value={elements.Te130.key}>Tellurium</option>
                <option value={elements.I127.key}>Iodine</option>
                <option value={elements.Xe132.key}>Xenon</option>
                <option value={elements.Cs133.key}>Cesium</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="tn_min">
              <Form.Label>
                Nucleus T<sub>min</sub> = {tESnMin * 1000} eV
              </Form.Label>
              <InputGroup>
                <Form.Control
                  value={tESnMin}
                  type="range"
                  step={.001}
                  min={0}
                  max={0.1}
                  onChange={(event) => setTESnMin(parseFloat(event.target.value))}
                />
              </InputGroup>
            </Form.Group>
          </Form>
      </Card.Body>
    </Card>
  );
};

export const GeoCEvNS = ({GeoCEvNSFlux}) =>{
  const [nucleus, setNucleus] = useState(elements.Xe132.key);
  const [tESnMin, setTESnMin] = useState(0.0);
  const fluxSpectrums = {
    K40: GeoCEvNSFlux.total.K40Beta.spectrum,
    Th232: GeoCEvNSFlux.total.Th232.spectrum,
    U235: GeoCEvNSFlux.total.U235.spectrum, 
    U238: GeoCEvNSFlux.total.U238.spectrum,
  }

  return <GeoNusCEvNS 
        nucleus={nucleus}
        setNucleus={setNucleus}
        tESnMin={tESnMin}
        setTESnMin={setTESnMin}
        fluxSpectrums={fluxSpectrums}
  />
}

export const CrustFlux = ({ includeCrust, setIncludeCrust }) => {
  return (
    <Card>
      <Card.Header>Crust Fluxes</Card.Header>
      <Card.Body>
        <Form.Check
          checked={includeCrust}
          id="crustSignalSlider"
          type="switch"
          label="Include Crust Fluxes"
          onChange={(event) => setIncludeCrust(event.target.checked)}
        />
        <small>
          Uses pre-computed (1°x1°) models of the crust fluxes from <sup>238</sup>U, <sup>232</sup>Th, and <sup>40</sup>K. 
          <br /> • The Earth crust flux model, kindly provided by W.F.
          McDonough, is described in Y. Huang <i>et al.</i> (2013), <i>A reference Earth model
          for the heat producing elements and associated geoneutrino flux</i>,
          Geochem., Geophys., Geosyst. 14, 2003-2029. 
          <br /> • The Moon crust flux model is described in S.T. Dye and A.M. Barna (2024), <i>Lunar 
          antineutrinos and heat: Fluxes from primordial radioactivity</i> arXiv:2406.00882.
        </small>
      </Card.Body>
    </Card>
  );
};

export const MantleFlux = ({ geoFluxRatios, setGeoFluxRatios, geo, celestialBody}) => {
  
  const {abundance} = geo;
  const {heating} = geo;

  const uRangeParams = {
    step: 1e4,
    min: 0,
    max: 3e6,
  }
  const thRangeParams = {
    step:0.01,
    min:0,
    max:6,
  }
  const kRangeParams = {
    step:1e2,
    min:0,
    max:3e4,
  }
  if (celestialBody === "moon"){
    kRangeParams.step = 1e2
    kRangeParams.min = 0
    kRangeParams.max = 6e3
  }

  return (
    <Card>
      <Card.Header>Mantle Fluxes <small>(Nuclide Abundance; Radiogenic Heating)</small></Card.Header>
      <Card.Body>
        <Form.Group controlId="U238flux">
          <Form.Label>
            {U238} Mantle Flux: {geoFluxRatios.U238flux.toExponential(2)} cm
            <sup>-2</sup>s<sup>-1</sup>
            {" "}
          </Form.Label>
          <Form.Control
            value={geoFluxRatios.U238flux}
            type="range"
            {...uRangeParams}
            onChange={(event) =>
              setGeoFluxRatios({
                ...geoFluxRatios,
                U238flux: parseFloat(event.target.value),
              })
            }
          />
        </Form.Group>
        <Form.Group controlId="ThURatio">
          <InputGroup>
            <Form.Label>
              Th/U Ratio {geoFluxRatios.ThURatio.toFixed(2)}
            </Form.Label>
            <Form.Control
              value={geoFluxRatios.ThURatio}
              type="range"
              {...thRangeParams}
              onChange={(event) =>
                setGeoFluxRatios({
                  ...geoFluxRatios,
                  ThURatio: parseFloat(event.target.value),
                })
              }
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="KURatio">
          <InputGroup>
            <Form.Label>
              K/U Ratio {geoFluxRatios.KURatio.toExponential(2)}
            </Form.Label>
            <Form.Control
              value={geoFluxRatios.KURatio}
              type="range"
              {...kRangeParams}
              onChange={(event) =>
                setGeoFluxRatios({
                  ...geoFluxRatios,
                  KURatio: parseFloat(event.target.value),
                })
              }
            />
          </InputGroup>
        </Form.Group>
          <Table>
            <thead>
              <tr>
                <th>Element</th>
                <th>Abundance (ng/g)</th>
                <th>Radiogenic Heating (TW)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Uranium</td>
                <td>
                  <Num v={abundance.U238 / ISOTOPIC_NATURAL_ABUNDANCE.U238} p={2} func={(v) => v * 1e11} />
                </td>
                <td>
                  <Num v={heating.U238 + heating.U235} p={3} func={(v) => v / 1e12} />
                </td>
              </tr>
              <tr>
                <td>Thorium</td>
                <td>
                  <Num v={abundance.Th232 / ISOTOPIC_NATURAL_ABUNDANCE.TH232} p={2} func={(v) => v * 1e11} />
                </td>
                <td>
                  <Num v={heating.Th232} p={3} func={(v) => v / 1e12} />
                </td>
              </tr>
              <tr>
                <td>Potassium</td>
                <td>
                  <Num v={abundance.K40beta / ISOTOPIC_NATURAL_ABUNDANCE.K40} p={0} func={(v) => v * 1e11} />
                </td>
                <td>
                  <Num v={heating.K40Beta + heating.K40Ec} p={3} func={(v) => v / 1e12} />
                </td>
              </tr>
            </tbody>
          </Table>
          <Table>
            <thead>
              <tr>
                <th>Nuclide</th>
                <th>Abundance (ng/g)</th>
                <th>Radiogenic Heating (TW)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{U238}</td>
                <td>
                  <Num v={abundance.U238} p={2} func={(v) => v * 1e9} />
                </td>
                <td>
                  <Num v={heating.U238} p={3} func={(v) => v / 1e12} />
                </td>
              </tr>
              <tr>
                <td>{U235}</td>
                <td>
                  <Num v={abundance.U235} p={3} func={(v) => v * 1e9} />
                </td>
                <td>
                  <Num v={heating.U235} p={3} func={(v) => v / 1e12} />
                </td>
              </tr>
              <tr>
                <td>{Th232}</td>
                <td>
                  <Num v={abundance.Th232} p={2} func={(v) => v * 1e9} />
                </td>
                <td>
                  <Num v={heating.Th232} p={3} func={(v) => v / 1e12} />
                </td>
              </tr>
              <tr>
                <td>{K40}<sub>β</sub></td>
                <td>
                  <Num v={abundance.K40beta} p={2} func={(v) => v * 1e9} />
                </td>
                <td>
                  <Num v={heating.K40Beta} p={3} func={(v) => v / 1e12} />
                </td>
              </tr>
              <tr>
                <td>{K40}<sub>ec</sub></td>
                <td>
                  <Num v={abundance.K40ec} p={2} func={(v) => v * 1e9} />
                </td>
                <td>
                  <Num v={heating.K40Ec} p={3} func={(v) => v / 1e12} />
                </td>
              </tr>
            </tbody>
          </Table>
        Mantle Radiogenic Heating: <Num v={heating.U238 + heating.U235 + heating.Th232 + heating.K40Beta + heating.K40Ec} p={3} func={(v) => v / 1e12}/> TW assumes homogeneous element concentrations
        <br /> •<small>Earth mantle mass (<Num v={MANTLE_MASS} p={4} func={(v) => v * 1e-24} /> x10<sup>24</sup> kg) and geophysical response (<Num v={MANTLE_GEOPHYSICAL_RESPONSE} p={4} func={(v) => v * 1e-3} /> x10<sup>3</sup> kg cm<sup>-2</sup>)</small>
        <br /> <small>A. M. Dziewonski and D. L. Anderson (1981), <i>Preliminary Reference Earth Model (PREM)</i>, Phys. Earth Planet. Inter. 25, 297-356</small>
        <br /> •<small>Moon mantle mass (<Num v={LUNAR_MANTLE_MASS} p={4} func={(v) => v * 1e-22} /> x10<sup>22</sup> kg) and geophysical response (<Num v={LUNAR_MANTLE_GEOPHYSICAL_RESPONSE} p={4} func={(v) => v * 1e-3} /> x10<sup>3</sup> kg cm<sup>-2</sup>)</small>
        <br /> <small>A. Briaud <i>et al.</i> (2023), <i>The lunar solid inner core and the mantle overturn</i>, Nature 617, 743-746</small>
        <br /> •<small>The settable <sup>238</sup>U mantle flux does not include the average oscillation survival probability ({averageSurvivalProbabilityNormal.toFixed(3)}) </small>
        <br />
      </Card.Body>
    </Card>
  );
};

export const LayeredMantleFlux = () => {
  
  const [layerThickness, setThickness] = useState(0.1);
  const [residualFraction, setResidual] = useState(1.0);

  const bottomMantleRadius = 3480;
  const topMantleRadius = 6291;
  const uniformMantleMass = massFunc(bottomMantleRadius, topMantleRadius);
  const uniformMantleGeoResponse = geoResponseFunc(bottomMantleRadius, topMantleRadius);
  const maxThickness = topMantleRadius - bottomMantleRadius;
  const minThickness = 0.1;
  const maxFraction = 1;
  const minFraction = 0;
  
  const UIsetThickness = (event) => {
    const value = event.target.value;
    const cleanValue = value.replace(/[^0-9.]/g, '');
    let layer_thickness = parseFloat(cleanValue);
    if (!isNaN(layer_thickness) && !isNaN(parseFloat(layer_thickness))) {
      if (layer_thickness > maxThickness) {
        layer_thickness = maxThickness;
      }
      if (layer_thickness < minThickness) {
        layer_thickness = minThickness;
      }
      setThickness(layer_thickness);
    }
  };

  const UIsetResidual = (event) => {
    const newValue = event.target.value;
    let residual_fraction = newValue.replace(/[^0-9.]/g, '');
    if (!isNaN(residual_fraction) && !isNaN(parseFloat(residual_fraction))) {
      if (residual_fraction > maxFraction) {
        residual_fraction = maxFraction;
      }
      if (residual_fraction < minFraction) {
        residual_fraction = minFraction;
      }
      setResidual(residual_fraction);
    }
  };

  let boundaryRadius = bottomMantleRadius + layerThickness;
  let enrichedMantleMass = massFunc(bottomMantleRadius, boundaryRadius);
  let depletedMantleMass = massFunc(boundaryRadius, topMantleRadius);
  let enrichedMantleGeoResponse = geoResponseFunc(bottomMantleRadius, boundaryRadius);
  let depletedMantleGeoResponse = geoResponseFunc(boundaryRadius, topMantleRadius);
  let enrichedMantleMassFraction = enrichedMantleMass / uniformMantleMass;
  let enrichedMantleGeoResponseFraction = enrichedMantleGeoResponse / uniformMantleGeoResponse;
  let enrichmentFactor = (uniformMantleMass - (depletedMantleMass * residualFraction)) / enrichedMantleMass;
  let relativeSignal = (enrichedMantleGeoResponse * enrichmentFactor + depletedMantleGeoResponse * residualFraction) / uniformMantleGeoResponse;

  return (
    <Card>
      <Card.Header>Layered Mantle Fluxes <small>(Enriched Basement Layer)</small></Card.Header>
      <Card.Body>
        <Form noValidate>
          <Row>
            <Col>
              <Form.Group controlId="layer_thickness">
                <Form.Label>
                  Enriched Layer Thickness
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    value={layerThickness}
                    onChange={UIsetThickness}
                    min={minThickness}
                    max={maxThickness}
                    step="10"
                  />
                  <InputGroup.Append>
                    <InputGroup.Text>km</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="residual_fraction">
                <Form.Label>
                  Residual Fraction
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    value={residualFraction}
                    onChange={UIsetResidual}
                    min="0"
                    max="1"
                    step="0.01"
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
        </Form>
        <Table>
          <thead>
            <tr>
              <th>Reservoir</th>
              <th>Mass (10<sup>24</sup> kg)</th>
              <th>Geological Response (10<sup>3</sup> kg cm<sup>-2</sup>)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Uniform Mantle</td>
              <td>
                <Num v={uniformMantleMass} p={3} func={(v) => v * 1e-27} />
              </td>
              <td>
                <Num v={uniformMantleGeoResponse} p={1} func={(v) => v * 1e-3} />
              </td>
            </tr>
            <tr>
              <td>Depleted Mantle (DM)</td>
              <td>
                <Num v={depletedMantleMass} p={3} func={(v) => v * 1e-27} />
              </td>
              <td>
                <Num v={depletedMantleGeoResponse} p={1} func={(v) => v * 1e-3} />
              </td>
            </tr>
            <tr>
              <td>Enriched Mantle (EM)</td>
              <td>
                <Num v={enrichedMantleMass} p={3} func={(v) => v * 1e-27} />
              </td>
              <td>
                <Num v={enrichedMantleGeoResponse} p={1} func={(v) => v * 1e-3} />
              </td>
            </tr>
          </tbody>
        </Table>
        <Table>
          <caption>Vary the thickness of a spherical shell (EM) at the base of the mantle, and vary the fraction of a given nuclide (i.e. {U238}, {Th232}, or {K40}) leftover in the overlying mantle (DM), to calculate the surface signal of the layered mantle (DM plus EM) relative to the uniform mantle. The enrichment of the nuclide in the basement layer follows mass balance. Enriching a basement layer always decreases the surface signal relative to a uniform mantle.</caption>
          <thead>
            <tr>
              <th>EM Mass Fraction</th>
              <th>Enrichment Factor</th>
              <th>Relative Signal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Num v={enrichedMantleMassFraction} p={3} />
              </td>
              <td>
                <Num v={enrichmentFactor} p={3} />
              </td>
              <td>
                <Num v={relativeSignal} p={3} />
              </td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export const GeoNuSpectrumSource = memo(() => {
  const x_values = new Float32Array(4500).map((_v, i) => i / 1000);
  const data = [
    {
      y: [...rawAntineutrinoSpectrum["238U"], 0].map((x) => x * 1000 * ISOTOPIC_NEUTRINOS_PER_DECAY.U238),
      x: x_values,
      name: "<sup>238</sup>U",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: [...rawAntineutrinoSpectrum["235U"], 0].map((x) => x * 1000 * ISOTOPIC_NEUTRINOS_PER_DECAY.U235),
      x: x_values,
      name: "<sup>235</sup>U",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "purple" },
    },
    {
      y: [...rawAntineutrinoSpectrum["232Th"], 0].map((x) => x * 1000 * ISOTOPIC_NEUTRINOS_PER_DECAY.TH232),
      x: x_values,
      name: "<sup>232</sup>Th",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: [...rawAntineutrinoSpectrum["40K"], 0].map((x) => x * 1000 * K40_BRANCH_RATIO.beta),
      x: x_values,
      name: "<sup>40</sup>K<sub>β</sub>",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "yellow" },
    },
  ];
  var layout = {
    yaxis: {
      title: { text: `Intensity (/MeV/decay)` },
      type: "log",
      autorange: true,
    },
    xaxis: {
      title: { text: `Antineutrino Energy (MeV)` },
    },
    autosize: true,
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
      filename: 'GeoNu-Spectra'
    }
  };
  return (
    <Card>
      <Card.Header>Geo-neutrino Nuclide Spectra</Card.Header>
      <Card.Body>
        <Plot
          useResizeHandler={true}
          style={{ width: "100%" }}
          data={data}
          layout={layout}
          config={config}
        />
        <p>
          <small>Geo-neutrino spectra for {U238}, {U235},{" "}
          {Th232}, and {K40}<sub>β</sub> are from{" "}
          <a href="https://www.awa.tohoku.ac.jp/~sanshiro/research/geoneutrino/spectrum/">
            Enomoto Sanshiro
          </a>
          .</small>
        </p>
      </Card.Body>
    </Card>
  );
});

export const GeoNusPane = memo(() => {
  return (
    <Card>
      <Card.Header>Antineutrinos from the Earth and the Moon</Card.Header>
      <Card.Body>
        <div>
          <p>
            Antineutrinos from long-lived natural radioactivity within the rocky layers of planetary bodies are commonly called geo-neutrinos. 
            Geo-neutrinos from uranium, thorium, and potassium nuclides have energy spectra extending above 1 MeV, facilitating their detection.
            Through a series of decays leading to stable isotopes of lead, <sup>238</sup>U, <sup>235</sup>U, and <sup>232</sup>Th, each
            emit 6, 4, and 4 antineutrinos, respectively. The potassium nuclide <sup>40</sup>K emits either a single antineutrino 
            through beta decay to calcium (<sup>40</sup>Ca, ~89%) or a single neutrino through electron capture to argon (<sup>40</sup>Ar, ~11%). 
            All of the parent nuclides have lifetimes comparable to the age of the solar system, allowing ample abundances for producing observable geo-neutrino 
            fluxes. Surface variation of the geo-neutrino fluxes is predicted for both the Earth and the Moon. On the Earth continental crust is both thicker 
            and more radioactive than oceanic crust. On the Moon gamma ray measurements by orbiting spacecraft find higher surface nuclide concentrations 
            for the Procellarum KREEP Terrane and the South Pole-Aitken Terrane than for the Feldspathic Highlands Terrane.
          </p>
          <p>
            The geo-neutrino model presented here uses pre-computed crust fluxes, spatially resolved on a grid of 1° 
            latitude x 1° longitude, and user-defined mantle fluxes from uniform nuclide concentrations in concentric isodensity shells. Fluxes 
            from the metallic outer and inner core of the Earth and Moon are assumed to be negligible. Model outputs are the neutrino reaction rates 
            and the radiogenic power of the user-defined mantle.
          </p>
        </div>
      </Card.Body>
    </Card>
  );
});

