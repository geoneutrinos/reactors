import { getCrustFlux } from "../crust-model";
import { range, chunk, reverse } from "lodash";
import Plot from "react-plotly.js";
import { memo } from "react";

export const EarthCrust40KFlux = memo(() => {
  // The origin of a plotly plot is the lower left corner
  const lats = range(-89.5, 90.5, 1);
  const lons = range(-179.5, 180.5, 1);
  const crustU = lats.map((lat) => {
    return lons.map((lon) => getCrustFlux(lon, lat, "earth")["k"]);
  });

  const data = [
    {
      x: lons,
      y: lats,
      z: crustU,
      name: "flux",
      type: "heatmap",
    },
  ];
  const layout = {
    title: "Earth Crust <sup>40</sup>K<sub>β</sub> ν̅ Flux (/cm<sup>2</sup>/µs)<br /><sub>(no oscillations)</sub>",
    yaxis: {
      title: { text: `Latitude` },
      autorange: true,
    },
    xaxis: {
      title: { text: `Longitude` },
    },
    autosize: true,
    legend: {
      x: 1,
      xanchor: "left",
      y: 1,
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
      filename: "earth_crust_40k_flux",
    },
  };
  return (
    <Plot
      useResizeHandler={true}
      style={{ width: "100%" }}
      data={data}
      layout={layout}
      config={config}
    />
  );
});

export const EarthCrust232ThFlux = memo(() => {
  // The origin of a plotly plot is the lower left corner
  const lats = range(-89.5, 90.5, 1);
  const lons = range(-179.5, 180.5, 1);
  const crustU = lats.map((lat) => {
    return lons.map((lon) => getCrustFlux(lon, lat, "earth")["th"]);
  });

  const data = [
    {
      x: lons,
      y: lats,
      z: crustU,
      name: "flux",
      type: "heatmap",
    },
  ];
  const layout = {
    title: "Earth Crust <sup>232</sup>Th ν̅ Flux (/cm<sup>2</sup>/µs)<br /><sub>(no oscillations)</sub>",
    yaxis: {
      title: { text: `Latitude` },
      autorange: true,
    },
    xaxis: {
      title: { text: `Longitude` },
    },
    autosize: true,
    legend: {
      x: 1,
      xanchor: "left",
      y: 1,
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
      filename: "earth_crust_232th_flux",
    },
  };
  return (
    <Plot
      useResizeHandler={true}
      style={{ width: "100%" }}
      data={data}
      layout={layout}
      config={config}
    />
  );
});

export const EarthCrust238UFlux = memo(() => {
  // The origin of a plotly plot is the lower left corner
  const lats = range(-89.5, 90.5, 1);
  const lons = range(-179.5, 180.5, 1);
  const crustU = lats.map((lat) => {
    return lons.map((lon) => getCrustFlux(lon, lat, "earth")["u"]);
  });

  const data = [
    {
      x: lons,
      y: lats,
      z: crustU,
      name: "flux",
      type: "heatmap",
    },
  ];
  const layout = {
    title: "Earth Crust <sup>238</sup>U ν̅ Flux (/cm<sup>2</sup>/µs)<br /><sub>(no oscillations)</sub>",
    yaxis: {
      title: { text: `Latitude` },
      autorange: true,
    },
    xaxis: {
      title: { text: `Longitude` },
    },
    autosize: true,
    legend: {
      x: 1,
      xanchor: "left",
      y: 1,
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
      filename: "earth_crust_238u_flux",
    },
  };
  return (
    <Plot
      useResizeHandler={true}
      style={{ width: "100%" }}
      data={data}
      layout={layout}
      config={config}
    />
  );
});
