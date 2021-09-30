import React, {useContext} from "react";

import { Card } from "react-bootstrap";
import Plot from "react-plotly.js";

import { range, sum, zip } from "lodash";

import { SECONDS_PER_YEAR } from "../physics/constants";
import { boron8Bins } from "../solar";
import { detectorSunPosition } from "../detectors";
import { crossSectionElasticScattering, NeutrinoType } from "../physics/neutrino-cross-section";

import { PhysicsContext } from "../state";


const plotDef = (cores, color) => {
  return {
    y: cores.map((v) => v.direction.elev),
    x: cores
      .map((v) => -(v.direction.phi * (Math.PI / 180)) + Math.PI / 2)
      .map((v) => (v < 0 ? v + 2 * Math.PI : v))
      .map((v) => (v * 180) / Math.PI),
    text: cores.map((core) => `${core.name} (${core.type})`),
    hoverinfo: "text",
    type: "scattergl",
    mode: "markers",
    fill: "none",
    marker: { color: color },
  };
};

const earthSunDist = (date) => {
  const JD = date.valueOf() / 86400000 - 0.5 + 2440588;
  const n = JD - 2451545;
  const g = 357.528 + 0.9856003 * n;
  const R = 1.00014 - 0.01671 * Math.cos(g * Math.PI/180) - 0.00014 * Math.cos(g * Math.PI/180) ** 2;
  return R;
}

export const AnalemmaPlot = ({ detector, cores, reactorLF}) => {
  // Some cals for filtering what times are shown
  let yearOrMore = ((reactorLF.end - reactorLF.start) >= 28857600000);
  let startMonth = (reactorLF.start.getUTCMonth() + 1).toString().padStart(2, "0")
  let endMonth = (reactorLF.end.getUTCMonth() + 2).toString().padStart(2, "0")
  let start = new Date(`2021-${startMonth}-01T00:30:00Z`);
  let end = new Date(`2021-${endMonth}-01T00:30:00Z`);
  end.setUTCDate(0);

  const times = range(0, 24).map((hour) => {
    let days = range(0, 365, 2).map((jd) => {
      let d = new Date("2021-01-01T00:30:00Z");

      d.setUTCDate(jd);
      d.setUTCHours(hour);

      if (yearOrMore) {
        return d;
      }
      if (endMonth < startMonth) {
        if ((d > end) && (d < start)){
          return undefined;
        }
      } else {
        if (d < start) {
          return undefined;
        }
        if (d > end) {
          return undefined;
        }
      }
      return d;
    })
    days.push(days[0])
    return days
  });
  const coreData = Object.values(cores);
  const PHWRcores = coreData.filter((core) => core.spectrumType === "PHWR");
  const GCRcores = coreData.filter((core) => core.spectrumType === "GCR");
  const LEUMoxCores = coreData.filter(
    (core) => core.spectrumType === "LEU_MOX"
  );
  const CustomCores = coreData.filter((core) => core.spectrumType === "custom");
  const AllOtherCores = coreData.filter(
    (core) =>
      core.spectrumType !== "LEU_MOX" &&
      core.spectrumType !== "GCR" &&
      core.spectrumType !== "PHWR" &&
      core.type !== "custom"
  );
  let data = times.map((days) => {
    let fakeDetector = { ...detector, lon: 0 };
    let ana = days.map((date) => date === undefined? date: detectorSunPosition(fakeDetector, date));
    let x = ana.map((v) => v === undefined? v: ((v.azimuth + Math.PI) * 180) / Math.PI);
    let y = ana.map((v) => v === undefined? v: (v.altitude * 180) / Math.PI);
    let z = days.map((date) => date === undefined? date: 1/(earthSunDist(date))**2);
    return {
      y: y,
      x: x,
      z: z,
      text: z.map((zv) => `${zv === undefined? zv : zv.toFixed(5)} (1/au<sup>2</sup>)`),
      hoverinfo: "text",
      name: "solar",
      type: "scattergl",
      mode: "markers",
      opacity: 0.5,
      fill: "none",
      marker: { size: 3, color: z, colorscale:'Electric', cmin:0.96, cmax: 1.04, colorbar: {thickness: 15, title: "Intensity (1/au<sup>2</sup>)" }},
    };
  });
  data.push(plotDef(AllOtherCores, "#009000"));
  data.push(plotDef(CustomCores, "#000"));
  data.push(plotDef(GCRcores, "#D69537"));
  data.push(plotDef(LEUMoxCores, "#0000ff"));
  data.push(plotDef(PHWRcores, "#ff0000"));

  var layout = {
    title: `Solar Analemma: ${
      ["custom", "follow"].includes(detector.current)
        ? "Custom Location"
        : detector.current
    } (${detector.lat.toFixed(1)}N, ${detector.lon.toFixed(
      1
    )}E, ${detector.elevation.toFixed(0)}m)`,
//    title: "Solar Analemma",
    hovermode: "closest",
    autosize: true,
    xaxis: {
      title: "Azimuth (deg)",
      range: [0, 360],
      tickmode: "array",
      tickvals: range(0, 361, 45),
    },
    yaxis: {
      title: "Altitude (deg)",
      range: [-90, 90],
      tickmode: "array",
      tickvals: range(-90, 91, 45),
    },
    showlegend: false,
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
      filename: 'Solar-Analemma'
    }
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
          config={config}
        />
      </Card.Body>
    </Card>
  );
};

export const Boron8KEPlot = ({ boron8 }) => {
  const {crossSection} = useContext(PhysicsContext)
  const esTmin = crossSection.elasticScatteringTMin
  const esSmear = (b8Rate) => {
    const eVtoK = boron8Bins.map((bin) => {
      const Tspec = boron8Bins.map((Tbin) =>
        Tbin < esTmin? 0: 
        crossSectionElasticScattering(
          bin,
          NeutrinoType.electronNeutrino,
          Tbin - 0.05,
          Tbin + 0.05
        )
      );
      const totalT = sum(Tspec);
      return Tspec.map((v) => totalT === 0? 0: v / totalT);
    });
    const newRates = b8Rate.map((v,i) => eVtoK[i].map(v2 => v * v2))
    return zip(...newRates).map(v => sum(v))
  };

  const y = esSmear(boron8.boron8Rate).map((x) => x * 1e1 * SECONDS_PER_YEAR * 1e32)

  const data = [
    {
      y: y,
      x: boron8Bins,
      name: "Boron 8",
      type: "scattergl",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
  ];
  var layout = {
    title: "Kinetic Energy Spectrum",
    yaxis: {
      title: { text: `dR/dT (NIU/MeV)` },
      autorange: true,
    },
    xaxis: {
      title: { text: `Kinetic Energy (MeV)` },
    },
    autosize: true,
    legend: {
      x: 1,
      xanchor: "right",
      y: 0,
    },
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
      filename: 'Solar-8B-ES-KT-Spectrum'
    }
  };
  return (
    <Card>
      <Card.Header>
        <sup>8</sup>B Solar Neutrinos- Scattered Electron Kinetic Energy
      </Card.Header>
      <Card.Body>
        <Plot
          useResizeHandler={true}
          style={{ width: "100%" }}
          data={data}
          layout={layout}
          config={config}
        />
      </Card.Body>
    </Card>
  );
};

export const Boron8SpectraPlot = ({ boron8 }) => {
  const data = [
    {
      y: boron8.boron8Rate.map((x) => x * 1e1 * SECONDS_PER_YEAR * 1e32),
      x: boron8Bins,
      name: "Boron 8",
      type: "scattergl",
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
      filename: 'Solar-8B-ES-Rate-Spectrum'
    }
  };
  return (
    <Card>
      <Card.Header>
        <sup>8</sup>B Solar Neutrinos- Interaction Rate Spectrum
      </Card.Header>
      <Card.Body>
        <p>
          R<sub>sol</sub> = {boron8.boron8NIU.toFixed(2)} NIU
        </p>
        <p>
          <sup>8</sup>B decay spectrum from:
          <br />
          W. T. Winter et al., "The <sup>8</sup>B neutrino spectrum," Phys. Rev.
          C 73, 025503 (2006).
        </p>

        <p>
          <sup>8</sup>B decay solar neutrino flux (2.345x10<sup>6</sup> cm
          <sup>-2</sup>s<sup>-1</sup>) from:
          <br />
          K. Abe et al., "Solar neutrino measurements in Super-Kamiokande-IV,"
          Phys. Rev. D 94, 052010 (2016).
        </p>
  
        <p>
          Plotted data assume the flux is entirely electron neutrinos.
        </p>
        <Plot
          useResizeHandler={true}
          style={{ width: "100%" }}
          data={data}
          layout={layout}
          config={config}
        />
      </Card.Body>
    </Card>
  );
};
