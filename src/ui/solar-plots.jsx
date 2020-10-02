import React from "react";

import { Card } from "react-bootstrap";
import Plot from "react-plotly.js";

import { boron8, BORON_8_NIU } from "../solar";

export const Boron8SpectraPlot = () => {
  const data = [
    {
      y: boron8.map((x) => x[1]),
      x: boron8.map((x) => x[0]),
      name: "Boron 8",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
  ];
  var layout = {
    title: "<sup>8</sup>B Decay Spectrum",
    yaxis: {
      title: { text: `Intensity (1/MeV/decay)` },
      autorange: true,
    },
    xaxis: {
      title: { text: `Neutrino Energy (MeV)` },
    },
    autosize: true,
    legend: {
      x: 1,
      xanchor: "right",
      y: 0,
    },
  };
  return (
    <Card>
      <Card.Header><sup>8</sup>B Decay Spectrum, Flux, Rate</Card.Header>
      <Card.Body>
        <p>
          R<sub>sol</sub> = {BORON_8_NIU} NIU (preliminary, do not use)
        </p>
        <p>
          <sup>8</sup>B decay spectrum from:
          <br />
          W. T. Winter et al., "The 8B neutrino spectrum," Phys. Rev. C 73,
          025503 (2006).
        </p>

        <p>
          <sup>8</sup>B decay solar neutrino flux (2.345x106 cm-2s-1) from:
          <br />
          K. Abe et al., "Solar neutrino measurements in Super-Kamiokande-IV,"
          Phys. Rev. D 94, 052010 (2016).
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
