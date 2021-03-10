import React from "react";
import { rawAntineutrinoSpectrum } from "../antineutrino-spectrum";

import { Card, Form, InputGroup } from "react-bootstrap";

import Plot from "react-plotly.js";

export const CrustFlux = ({ includeCrust, setIncludeCrust }) => {
  return (
    <Card>
      <Card.Header>Crust Flux</Card.Header>
      <Card.Body>
        <Form.Check
          checked={includeCrust}
          id="crustSignalSlider"
          type="switch"
          label="Include Crust Signal"
          onChange={(event) => setIncludeCrust(event.target.checked)}
        />
        <small>
          A pre-computed model of the crust flux, which was provided by W.F.
          McDonough, is described in Y. Huang et al., "A reference Earth model
          for the heat producing elements and associated geoneutrino flux,"
          Geochem., Geophys., Geosyst. 14, 2003 (2013).
        </small>
      </Card.Body>
    </Card>
  );
};

export const MantleFlux = ({ geoFluxRatios, setGeoFluxRatios }) => {
  return (
    <Card>
      <Card.Header>Mantle Flux Inputs</Card.Header>
      <Card.Body>
        <Form.Group controlId="U238flux">
          <Form.Label>
            <sup>238</sup>U Mantle Flux: {geoFluxRatios.U238flux.toFixed(0)} cm
            <sup>-2</sup>s<sup>-1</sup>
          </Form.Label>
          <Form.Control
            value={geoFluxRatios.U238flux}
            type="range"
            step={100000}
            min={0}
            max={10000000}
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
            </Form.Label>
            <Form.Control
              value={geoFluxRatios.ThURatio}
              type="range"
              step={0.1}
              min={0.1}
              max={10}
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
              K/U Ratio {geoFluxRatios.KURatio.toFixed(0)}
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
      name: "<sup>40</sup>K",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "yellow" },
    },
  ];
  var layout = {
    title: "Geoneutrino Spectra: \u03B2<sup>+</sup>-decays ",
    yaxis: {
      title: { text: `Intensity (1/MeV/decay)` },
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
  return (
    <Card>
      <Card.Header>Geoneutrino Spectra</Card.Header>
      <Card.Body>
        <p>
          Geoneutrino spectra for <sup>238</sup>U, <sup>235</sup>U,{" "}
          <sup>232</sup>Th, and <sup>40</sup>K from{" "}
          <a href="https://www.awa.tohoku.ac.jp/~sanshiro/research/geoneutrino/spectrum/">
            Enomoto Sanshiro
          </a>
          .
        </p>
        <Plot
          useResizeHandler={true}
          style={{ width: "100%" }}
          data={data}
          layout={layout}
        />
      </Card.Body>
    </Card>
  );
};
