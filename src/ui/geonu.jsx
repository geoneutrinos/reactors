import React from "react";
import { rawAntineutrinoSpectrum } from "../antineutrino-spectrum";

import { Card, Form, InputGroup } from "react-bootstrap";
import { Num } from ".";

import {Elements} from './elements'

import Plot from "react-plotly.js";

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
          A pre-computed model of the crust fluxes, kindly provided by W.F.
          McDonough, is described in Y. Huang <i>et al.</i>, "A reference Earth model
          for the heat producing elements and associated geoneutrino flux,"
          Geochem., Geophys., Geosyst. 14, 2003 (2013).
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
            {U238} Mantle Flux: {geoFluxRatios.U238flux.toExponential(1)} cm
            <sup>-2</sup>s<sup>-1</sup>
            {" "}
            <small>({U238} plus {U235}: <Num v={heating.U238 + heating.U235} p={2} func={(v) => v / 1e12}/> TW)</small>
          </Form.Label>
          <Form.Control
            value={geoFluxRatios.U238flux}
            type="range"
            step={100000}
            min={0}
            max={5000000}
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
            <small>({K40}<sub>β</sub>: <Num v={heating.K40Beta} p={2} func={(v) => v / 1e12}/> TW)</small>
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
        Total Mantle Radiogenic Heating: <Num v={heating.U238 + heating.U235 + heating.Th232 + heating.K40Beta} p={2} func={(v) => v / 1e12}/> TW
        <br /> <small>Assumes homogeneous element concentrations, PREM mantle mass and geophysical response</small>
        <br /> <small>Flux values shown do not include neutrino oscillations</small>
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
