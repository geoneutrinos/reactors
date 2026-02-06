import { range, chunk,reverse } from "lodash";
import Plot from "react-plotly.js";
import { memo } from "react";

import earthHeatFlux from "../crust-model/earth/crust_heat_map.json";

export const EarthHeatFLux = memo(() => {
  // The origin of a plotly plot is the lower left corner
  const lats = range(-89.5, 90.5, 1);
  const lons = range(-179.5, 180.5, 1);
  const crustU = reverse(chunk(earthHeatFlux, 360))

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
    title: "Earth Crust Heat Flux (mW/m<sup>2</sup>)",
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
      filename: "earth_crust_heatflux",
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
