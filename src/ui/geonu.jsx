import React from "react";
import { rawAntineutrinoSpectrum } from "../antineutrino-spectrum";

import { Card, Form, InputGroup } from "react-bootstrap";
import { Num } from ".";

import { Node, Provider } from "@nteract/mathjax";

import {Elements} from './elements'

import Plot from "react-plotly.js";

import { averageSurvivalProbabilityNormal } from "../physics/neutrino-oscillation";

import { MANTLE_GEOPHYSICAL_RESPONSE, MANTLE_MASS } from "../mantle/geophysics";

const {K40, Th232, U235, U238} = Elements

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
          A pre-computed (1°x1°) model of the crust fluxes from <sup>238</sup>U, <sup>232</sup>Th, and <sup>40</sup>K, kindly provided by W.F.
          McDonough, is described in Y. Huang <i>et al.</i> (2013), <i>A reference Earth model
          for the heat producing elements and associated geoneutrino flux</i>,
          Geochem., Geophys., Geosyst. 14, 2003-2029.
        </small>
      </Card.Body>
    </Card>
  );
};

export const MantleFlux = ({ geoFluxRatios, setGeoFluxRatios, geo}) => {
  const {heating} = geo;
  return (
    <Card>
      <Card.Header>Mantle Fluxes <small>(Radiogenic Heating)</small></Card.Header>
      <Card.Body>
        <Form.Group controlId="U238flux">
          <Form.Label>
            {U238} Mantle Flux: {geoFluxRatios.U238flux.toExponential(2)} cm
            <sup>-2</sup>s<sup>-1</sup>
            {" "}
            <small>({U238} plus {U235}: <Num v={heating.U238 + heating.U235} p={2} func={(v) => v / 1e12}/> TW)</small>
          </Form.Label>
          <Form.Control
            value={geoFluxRatios.U238flux}
            type="range"
            step={20000}
            min={0}
            max={3000000}
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
              Th/U Ratio {geoFluxRatios.ThURatio.toFixed(1)}
            {" "}
            <small>({Th232}: <Num v={heating.Th232} p={2} func={(v) => v / 1e12}/> TW)</small>
            </Form.Label>
            <Form.Control
              value={geoFluxRatios.ThURatio}
              type="range"
              step={0.1}
              min={0.1}
              max={8}
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
              K/U Ratio {geoFluxRatios.KURatio.toExponential(1)}
            {" "}
            <small>({K40}<sub>β</sub> plus {K40}<sub>ec</sub>: <Num v={heating.K40Beta + heating.K40Ec} p={2} func={(v) => v / 1e12}/> TW)</small>
            </Form.Label>
            <Form.Control
              value={geoFluxRatios.KURatio}
              type="range"
              step={1e3}
              min={1e3}
              max={3e4}
              onChange={(event) =>
                setGeoFluxRatios({
                  ...geoFluxRatios,
                  KURatio: parseFloat(event.target.value),
                })
              }
            />
          </InputGroup>
        </Form.Group>
        Total Mantle Radiogenic Heating: <Num v={heating.U238 + heating.U235 + heating.Th232 + heating.K40Beta + heating.K40Ec} p={2} func={(v) => v / 1e12}/> TW
        <br /> •<small>Assumes homogeneous element concentrations, PREM mantle mass ({MANTLE_MASS} kg) and geophysical response ({MANTLE_GEOPHYSICAL_RESPONSE} kg cm<sup>-2</sup>)</small>
        <br /> •<small>A. M. Dziewonski and D. L. Anderson (1981), <i>Preliminary Reference Earth Model (PREM)</i>, Phys. Earth Planet. Inter. 25, 297-356</small>
        <br /> •<small>The settable <sup>238</sup>U mantle flux does not include the average oscillation survival probability ({averageSurvivalProbabilityNormal.toFixed(3)}) </small>
      </Card.Body>
    </Card>
  );
};

export const GeoNuSpectrumSource = ({ includeCrust, setIncludeCrust }) => {
  const x_values = new Float32Array(4500).map((v, i) => i / 1000);
  const data = [
    {
      y: [...rawAntineutrinoSpectrum["238U"], 0].map((x) => x * 1000),
      x: x_values,
      name: "<sup>238</sup>U",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
    {
      y: [...rawAntineutrinoSpectrum["235U"], 0].map((x) => x * 1000),
      x: x_values,
      name: "<sup>235</sup>U",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "purple" },
    },
    {
      y: [...rawAntineutrinoSpectrum["232Th"], 0].map((x) => x * 1000),
      x: x_values,
      name: "<sup>232</sup>Th",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "red" },
    },
    {
      y: [...rawAntineutrinoSpectrum["40K"], 0].map((x) => x * 1000),
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
      <Card.Header>Geoneutrino Spectra</Card.Header>
      <Card.Body>
        <Plot
          useResizeHandler={true}
          style={{ width: "100%" }}
          data={data}
          layout={layout}
          config={config}
        />
        <p>
          <small>Geoneutrino spectra for {U238}, {U235},{" "}
          {Th232}, and {K40}<sub>β</sub> are from{" "}
          <a href="https://www.awa.tohoku.ac.jp/~sanshiro/research/geoneutrino/spectrum/">
            Enomoto Sanshiro
          </a>
          .</small>
        </p>
      </Card.Body>
    </Card>
  );
};

export const GeoNusPane = () => {
  return (
    <Card>
      <Card.Header>Antineutrinos from the Earth</Card.Header>
      <Card.Body>
        <Provider>
          <div>
            <p>
              Antineutrinos from long-lived natural radioactivity within the rocky layers of the Earth are commonly known as geo-neutrinos. 
              Geo-neutrinos from isotopes of uranium, thorium, and potassium have energy spectra extending above 1 MeV, facilitating their detection.
              Through a series of decays leading to stable isotopes of lead, <sup>238</sup>U, <sup>235</sup>U, and <sup>232</sup>Th, each
              emit 6, 4, and 4 antineutrinos, respectively. The potassium isotope <sup>40</sup>K emits either a single antineutrino 
              through beta decay to calcium (<sup>40</sup>Ca) or a single neutrino through electron capture to argon (<sup>40</sup>Ar). 
              All of these isotopes have lifetimes comparable to the age of the Earth, allowing ample abundances for producing observable geo-neutrino 
              fluxes. Significant spatial variation of the geo-neutrino fluxes at the surface of the Earth is mandated by a correlation between crust 
              thickness and isotope concentrations, forecasting higher fluxes on continental crust and lower fluxes on oceanic crust.
            </p>
            <p>
              The geo-neutrino model herein uses pre-computed crust fluxes, spatially resolved on a grid of 1° 
              latitude x 1° longitude, and user-defined mantle fluxes from uniform isotope concentrations in concentric isodensity shells. Fluxes 
              from the metallic outer and inner core of the Earth are assumed to be negligible. Model outputs are the reaction rates on free proton 
              (pIBD) or atomic electron (eES) targets and the radiogenic power of the user-defined mantle.
            </p>
          </div>
          </Provider>
      </Card.Body>
    </Card>
  );
};

