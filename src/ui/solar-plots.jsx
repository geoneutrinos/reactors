import React from "react";

import { Card } from "react-bootstrap";
import Plot from "react-plotly.js";

import {range} from 'lodash';

import {SECONDS_PER_YEAR} from "../physics/constants"
import { boron8Bins } from "../solar";
import {detectorSunPosition} from '../detectors'


const times = range(0, 24).map((hour) => {
  return range(0,365, 5).map((jd) => {
    let d = new Date("2021-01-01T00:00:00Z")
    d.setUTCDate(jd)
    d.setUTCHours(hour)
    return d
  })
})

export const AnalemmaPlot = ({detector, cores}) => {
  //const ana = times[1].map((date) => detectorSunPosition(detector, date))
  //const data = [
  //  {
  //    y: ana.map(v => v.altitude),
  //    x: ana.map(v => v.azimuth),
  //    name: "solar",
  //    type: "scatter",
  //    mode: "lines",
  //    fill: "none",
  //    marker: { color: "blue" },
  //  },
  //];
  let data = times.map(days => {
    let ana = days.map(date => detectorSunPosition(detector, date))
    return {
      y: ana.map(v => v.altitude),
      x: ana.map(v => v.azimuth),
      name: "solar",
      type: "scatter",
      mode: "markers",
      fill: "none",
      marker: { color: "blue" },
    }
  })
  console.log({
    y: Object.values(cores).map(v => v.elevation),
    x: Object.values(cores).map(v => v.phi),
    name: "cores",
    type: "scatter",
    mode: "markers",
    fill: "none",
    marker: { color: "green" },
})
  data.push({
      y: Object.values(cores).map(v => v.direction.elev * (Math.PI/180)),
      x: Object.values(cores).map(v => -v.direction.phi * (Math.PI/180)),
      name: "cores",
      type: "scatter",
      mode: "markers",
      fill: "none",
      marker: { color: "green" },
  })
  var layout = {
    title: "Solar Analemma",
    autosize: true,
    //xaxis: {
    //  range: [ -Math.PI, Math.PI ]
    //},
    //yaxis: {
    //  range: [ -Math.PI/2, Math.PI/2 ]
    //},
    showlegend: false
   // legend: {
   //   x: 1,
   //   xanchor: "right",
   //   y: 0,
   // },
  };
  return (
    <Card>
      <Card.Header>Solar Analemma</Card.Header>
      <Card.Body>
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

export const Boron8SpectraPlot = ({boron8}) => {
  const data = [
    {
      y: boron8.boron8Rate.map((x) => x * 1e1 * SECONDS_PER_YEAR * 1e32),
      x: boron8Bins,
      name: "Boron 8",
      type: "scatter",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
  ];
  var layout = {
    title: "<sup>8</sup>B Decay ES Rate Spectrum",
    yaxis: {
      title: { text: `dR/dE (NIU/MeV)` },
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
      <Card.Header><sup>8</sup>B Solar Neutrinos</Card.Header>
      <Card.Body>
        <p>
          R<sub>sol</sub> = {boron8.boron8NIU.toFixed(2)} NIU
        </p>
        <p>
          <sup>8</sup>B decay spectrum from:
          <br />
          W. T. Winter et al., "The <sup>8</sup>B neutrino spectrum," Phys. Rev. C 73,
          025503 (2006).
        </p>

        <p>
          <sup>8</sup>B decay solar neutrino flux (2.345x10<sup>6</sup> cm<sup>-2</sup>s<sup>-1</sup>) from:
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
