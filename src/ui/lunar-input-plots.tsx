import { getCrustFlux } from "../crust-model";
import { range, chunk,reverse } from "lodash";
import Plot from "react-plotly.js";
import { memo } from "react";

import lunarThickness from "../crust-model/lunar/GMavg_thickness.json";
import lunarHeatFlux from "../crust-model/lunar/GMavg_heatflux.json";

export const LunarHeatFLux = memo(() => {
  // The origin of a plotly plot is the lower left corner
  const lats = range(-89.5, 90.5, 1);
  const lons = range(-179.5, 180.5, 1);
  const crustU = reverse(chunk(lunarHeatFlux, 360))

  const data = [
    {
      x: lons,
      y: lats,
      z: crustU,
      name: "thickness",
      type: "heatmap",
    },
  ];
  const layout = {
    title: "Lunar Crust Heat FLux (W/m<sup>2</sup>)",
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
      filename: "lunar_heatflux",
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

export const LunarThickness = memo(() => {
  // The origin of a plotly plot is the lower left corner
  const lats = range(-89.5, 90.5, 1);
  const lons = range(-179.5, 180.5, 1);
  const crustU = reverse(chunk(lunarThickness, 360))

  const data = [
    {
      x: lons,
      y: lats,
      z: crustU,
      name: "thickness",
      type: "heatmap",
    },
  ];
  const layout = {
    title: "Lunar Crust Thickness (km)",
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
      filename: "lunar_thickness",
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

export const Lunar238UFlux = memo(() => {
  // The origin of a plotly plot is the lower left corner
  const lats = range(-89.5, 90.5, 1);
  const lons = range(-179.5, 180.5, 1);
  const crustU = lats.map((lat) => {
    return lons.map((lon) => getCrustFlux(lon, lat, "moon")["u"]);
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
    title: "Lunar Crust <sup>238</sup>U Flux (/cm<sup>2</sup>/us)",
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
      filename: "lunar_238u_flux",
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

export const Lunar232ThFlux = memo(() => {
  // The origin of a plotly plot is the lower left corner
  const lats = range(-89.5, 90.5, 1);
  const lons = range(-179.5, 180.5, 1);
  const crustU = lats.map((lat) => {
    return lons.map((lon) => getCrustFlux(lon, lat, "moon")["th"]);
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
    title: "Lunar Crust <sup>232</sup>Th Flux (/cm<sup>2</sup>/us)",
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
      filename: "lunar_232th_flux",
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

export const Lunar40KFlux = memo(() => {
  // The origin of a plotly plot is the lower left corner
  const lats = range(-89.5, 90.5, 1);
  const lons = range(-179.5, 180.5, 1);
  const crustU = lats.map((lat) => {
    return lons.map((lon) => getCrustFlux(lon, lat, "moon")["k"]);
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
    title: "Lunar Crust <sup>40</sup>K<sub>β</sub> Flux (/cm<sup>2</sup>/us)",
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
      filename: "lunar_40k_flux",
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
