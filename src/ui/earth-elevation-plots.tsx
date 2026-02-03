import { range, chunk, reverse } from "lodash";
import Plot from "react-plotly.js";
import { memo } from "react";

import earthElevationOrtho from "../elevation/elevation_ortho.json";
import earthElevationGeoid from "../elevation/elevation_geoid.json";
import earthElevationEllip from "../elevation/elevation_ellip.json";

export const EarthElevationOrtho = memo(() => {
  // The origin of a plotly plot is the lower left corner
  const lats = range(-89.5, 90.5, 1);
  const lons = range(-179.5, 180.5, 1);
  const crustU = reverse(chunk(earthElevationOrtho, 360))

  const data = [
    {
      x: lons,
      y: lats,
      z: crustU,
      name: "ortho",
      type: "heatmap",
    },
  ];
  const layout = {
    title: "Earth Orthometric Elevation (m)",
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
      filename: "earth_elevation_ortho",
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

export const EarthElevationGeoid = memo(() => {
  // The origin of a plotly plot is the lower left corner
  const lats = range(-89.5, 90.5, 1);
  const lons = range(-179.5, 180.5, 1);
  const crustU = reverse(chunk(earthElevationGeoid, 360))

  const data = [
    {
      x: lons,
      y: lats,
      z: crustU,
      name: "geoid",
      type: "heatmap",
    },
  ];
  const layout = {
    title: "Earth Geoidal Elevation (m)",
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
      filename: "earth_elevation_geoid",
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

export const EarthElevationEllip = memo(() => {
  // The origin of a plotly plot is the lower left corner
  const lats = range(-89.5, 90.5, 1);
  const lons = range(-179.5, 180.5, 1);
  const crustU = reverse(chunk(earthElevationEllip, 360))

  const data = [
    {
      x: lons,
      y: lats,
      z: crustU,
      name: "ellip",
      type: "heatmap",
    },
  ];
  const layout = {
    title: "Earth Ellipsoidal Elevation (m)",
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
      filename: "earth_elevation_ellip",
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
