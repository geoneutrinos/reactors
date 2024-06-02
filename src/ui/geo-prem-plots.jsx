import { memo } from "react";
import {layerDensity,
        layerDensityAK135F,
        layerMasses,
        layerMassesAK135F,
        layerGeoResponse,
        layerGeoResponseAK135F,
        geoIntegral,
        bins,
        } from "../mantle/PREM";
import {lunarDensity,
        lunarMasses,
        } from "../mantle/lunar";
import { Card } from "react-bootstrap";
import Plot from "react-plotly.js";

export const GeoDensityPlot = memo(() => {
    const data = [
      {
        y: layerDensity,
        x: bins,
        name: "PREM",
        type: "scatter",
        mode: "lines",
        fill: "none",
        marker: { color: "purple" },
      },
      {
        y: layerDensityAK135F,
        x: bins,
        name: "AK135F",
        type: "scatter",
        mode: "lines",
        fill: "none",
        marker: { color: "orange" },
      },
      {
        y: lunarDensity,
        x: bins,
        name: "Briaud et al.",
        type: "scatter",
        mode: "lines",
        fill: "none",
        marker: { color: "blue" },
      },
    ]
    const layout = {
      title: "Density Profiles",
      yaxis: {
        title: { text: `Density (g/cm<sup>3</sup>)` },
        autorange: true
      },
      xaxis: {
        title: { text: `Radius (km)` },
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
        filename: 'Model_density'
      }
    };
    return (
      <Card>
        <Card.Header>Model Density</Card.Header>
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
  })

export const GeoMassPlot = memo(() => {
    const data = [
      {
        y: layerMasses,
        x: bins,
        name: "PREM",
        type: "scatter",
        mode: "lines",
        fill: "none",
        marker: { color: "green" },
      },
      {
        y: layerMassesAK135F,
        x: bins,
        name: "AK135F",
        type: "scatter",
        mode: "lines",
        fill: "none",
        marker: { color: "yellow" },
      },
      {
        y: lunarMasses,
        x: bins,
        name: "Briaud et al.",
        type: "scatter",
        mode: "lines",
        fill: "none",
        marker: { color: "blue" },
      },
    ]
    const layout = {
      title: "Mass Profiles",
      yaxis: {
        title: { text: `Mass (g)` },
        autorange: true
      },
      xaxis: {
        title: { text: `Radius (km)` },
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
        filename: 'Model_mass'
      }
    };
    return (
      <Card>
        <Card.Header>Model Mass</Card.Header>
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
  })

export const GeoIntegralPlot = memo(() => {
    const data = [
      {
        y: geoIntegral,
        x: bins,
        name: "Geo Integral",
        type: "scatter",
        mode: "lines",
        fill: "none",
        marker: { color: "blue" },
      },
    ]
    const layout = {
      title: "Geo Signal Factor",
      yaxis: {
        title: { text: `Signal Factor` },
        autorange: true
      },
      xaxis: {
        title: { text: `Radius (km)` },
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
        filename: 'Geo_integral'
      }
    };
    return (
      <Card>
        <Card.Header>Geo Signal Factor</Card.Header>
        <Card.Body>
          <Plot
            useResizeHandler={true}
            style={{ width: "100%" }}
            data={data} 
            layout={layout}
            config={config}
          />
        <p><small>Following L.M. Krauss, S.L. Glashow, and D.N. Schramm (1984) Nature 310, 191-198. </small></p>
        </Card.Body>
      </Card>
    );
  })

export const GeophysicalResponsePlot = memo(() => {
    const data = [
      {
        y: layerGeoResponse,
        x: bins,
        name: "PREM",
        type: "scatter",
        mode: "lines",
        fill: "none",
        marker: { color: "grey" },
      },
      {
        y: layerGeoResponseAK135F,
        x: bins,
        name: "AK135F",
        type: "scatter",
        mode: "lines",
        fill: "none",
        marker: { color: "turquoise" },
      },
    ]
    const layout = {
      title: "Geophysical Response Profiles",
      yaxis: {
        title: { text: `Response (kg/cm<sup>2</sup>)` },
        autorange: true
      },
      xaxis: {
        title: { text: `Radius (km)` },
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
        filename: 'Geophysical_response'
      }
    };
    return (
      <Card>
        <Card.Header>Model Geophysical Response</Card.Header>
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
  })
