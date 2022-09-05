import React, { useContext } from "react";

import { Card } from "react-bootstrap";
import Plot from "react-plotly.js";

import { range } from "lodash";

import { Num } from ".";
import { SECONDS_PER_YEAR } from "../physics/constants";
import { boron8Bins, earthSunDistances, times } from "../solar";
import { detectorSunPosition } from "../detectors";
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

export const AnalemmaPlot = ({ detector, cores, reactorLF, boron8 }) => {
  // Some cals for filtering what times are shown
  let yearOrMore = reactorLF.end - reactorLF.start >= 28857600000;
  let startMonth = (reactorLF.start.getUTCMonth() + 1)
    .toString()
    .padStart(2, "0");
  let endMonth = (reactorLF.end.getUTCMonth() + 2).toString().padStart(2, "0");
  let start = new Date(`2021-${startMonth}-01T00:30:00Z`);
  let end = new Date(`2021-${endMonth}-01T00:30:00Z`);
  end.setUTCDate(0);

  const reducedTimes = times.map((d) => {
    if (yearOrMore) {
      return d;
    }
    if (endMonth < startMonth) {
      if (d > end && d < start) {
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
  // TODO Fix this hacks
  // needed just to set the lon to 0
  const fakeDetector = { ...detector, lon: 0 };
  const ana = reducedTimes.map((date) =>
    date === undefined ? date : detectorSunPosition(fakeDetector, date)
  );
  const x = ana.map((v) =>
    v === undefined ? v : ((v.azimuth + Math.PI) * 180) / Math.PI
  );
  const y = ana.map((v) =>
    v === undefined ? v : (v.altitude * 180) / Math.PI
  );
  const z = reducedTimes.map((date, i) =>
    date === undefined ? date : 1 / earthSunDistances[i] ** 2
  );
  const data = [
    {
      y: y,
      x: x,
      z: z,
      text: z.map(
        (zv) => `${zv === undefined ? zv : zv.toFixed(5)} (1/au<sup>2</sup>)`
      ),
      hoverinfo: "text",
      name: "solar",
      type: "scattergl",
      mode: "markers",
      opacity: 0.5,
      fill: "none",
      marker: {
        size: 3,
        color: z,
        colorscale: "Electric",
        cmin: 0.96,
        cmax: 1.04,
        colorbar: { thickness: 15, title: "Intensity (1/au<sup>2</sup>)" },
      },
    },
  ];
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
    )}E, ${detector.elevation.toFixed(0)}m) <br /><sub>(${reactorLF.start
      .toISOString()
      .slice(0, 7)} through ${reactorLF.end
      .toISOString()
      .slice(0, 7)}, mean solar distance ${boron8.averageSolarDistance.toFixed(
      4
    )} AU)</sub>`,
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
      filename: "Solar-Analemma",
    },
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
  const { crossSection } = useContext(PhysicsContext);
  const data = [
    {
      y: boron8.boron8Ke,
      x: boron8Bins,
      name: "Boron 8",
      type: "scattergl",
      mode: "lines",
      fill: "none",
      marker: { color: "blue" },
    },
  ];
  var layout = {
    title: `<sup>8</sup>B- Scattered Electron Kinetic Energy Spectrum<br /><sub>${
      "(" +
      crossSection.elasticScatteringTMin.toFixed(1) +
      " < T < " +
      crossSection.elasticScatteringTMax.toFixed(1) +
      " MeV)"
    }</sub>`,
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
      filename: `Solar-8B-ES-KE-Spectrum_Tmin${crossSection.elasticScatteringTMin.toFixed(
        1
      )}_to_Tmax${crossSection.elasticScatteringTMax.toFixed(1)}`,
    },
  };
  return (
    <Card>
      <Card.Header>
        <sup>8</sup>B Solar ν<sub>e</sub>- Scattered Electron Kinetic Energy Spectrum
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

export const Boron8SpectraPlot = ({ boron8, reactorLF }) => {
  const { crossSection } = useContext(PhysicsContext);
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
    title: `<sup>8</sup>B Solar ν<sub>e</sub>- Interaction Rate Spectrum<br /><sub>${
      "(" +
      crossSection.elasticScatteringTMin.toFixed(1) +
      " < T < " +
      crossSection.elasticScatteringTMax.toFixed(1) +
      " MeV)"
    }</sub>`,
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
      filename: `Solar-8B-ES-Rate-Spectrum_Tmin${crossSection.elasticScatteringTMin.toFixed(
        1
      )}_to_Tmax${crossSection.elasticScatteringTMax.toFixed(1)}`,
    },
  };
  return (
    <Card>
      <Card.Header>
        <sup>8</sup>B Solar ν<sub>e</sub>- Interaction Rate Spectrum
      </Card.Header>
      <Card.Body>
        <Card.Text>
          <i>R</i>
          <sub>sol</sub> ={" "}
          <Num v={boron8.boron8NIU} u={boron8.boron8NIUU} p={2} /> NIU
          <br />
          <small>
            Rate from scattered electron kinetic energies {" "}
            {crossSection.elasticScatteringTMin.toFixed(1)} &lt; T &lt;{" "}
            {crossSection.elasticScatteringTMax.toFixed(1)} MeV{" "}
            and averaged over {reactorLF.start.toISOString().slice(0, 7)} through{" "}
            {reactorLF.end.toISOString().slice(0, 7)}, giving mean solar distance{" "}
            {boron8.averageSolarDistance.toFixed(4)} AU.
          </small>
        </Card.Text>
        <p>
          <sup>8</sup>B decay spectrum is from:
          <br />
          W. T. Winter et al., "The <sup>8</sup>B neutrino spectrum," Phys. Rev.
          C 73, 025503 (2006).
        </p>

        <p>
          <sup>8</sup>B decay solar neutrino flux- (2.345 ± 0.014(stat) ±
          0.036(syst)) x 10<sup>6</sup> cm
          <sup>-2</sup>s<sup>-1</sup>- is from:
          <br />
          K. Abe et al., "Solar neutrino measurements in Super-Kamiokande-IV,"
          Phys. Rev. D 94, 052010 (2016).
        </p>

        <p>Results herein assume the flux is entirely electron neutrinos.</p>
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
