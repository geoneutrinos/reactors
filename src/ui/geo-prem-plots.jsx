import {rho,geoIntegrate,volumeRatio,layers,maxRadius,binWidth,offset,bins,preFactor,innerCoreMass,outerCoreMass,mantleMass,lowerCrustMass,upperCrustMass,earthMass,mantleGeophysicalResponse} from "../mantle/PREM";
import { Card } from "react-bootstrap";
import Plot from "react-plotly.js";

export const GeoDensityPlot = () => {
    const data = [
      {
        y: bins.map(bin => rho(bin)),
        x: bins,
        name: "Density",
        type: "scatter",
        mode: "lines",
        fill: "none",
        marker: { color: "orange" },
      },
    ]
    const layout = {
      title: "PREM Density",
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
        filename: 'PREM_density'
      }
    };
    return (
      <Card>
        <Card.Header>PREM Density</Card.Header>
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
  }

export const GeoMassPlot = () => {
    const data = [
      {
        y: bins.map(bin => rho(bin) * preFactor * ((bin + offset)**3 - (bin - offset)**3)),
        x: bins,
        name: "Mass",
        type: "scatter",
        mode: "lines",
        fill: "none",
        marker: { color: "green" },
      },
    ]
    const layout = {
      title: "PREM Mass",
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
        filename: 'PREM_mass'
      }
    };
    return (
      <Card>
        <Card.Header>PREM Mass</Card.Header>
        <Card.Body>
          <Plot
            useResizeHandler={true}
            style={{ width: "100%" }}
            data={data} 
            layout={layout}
            config={config}
          />
          <p>Initial results for PREM inner core mass { innerCoreMass }, outer core mass { outerCoreMass }, mantle mass { mantleMass }, lower crust mass { lowerCrustMass }, upper crust mass { upperCrustMass }, earth mass { earthMass }.</p>
        </Card.Body>
      </Card>
    );
  }

export const GeoIntegralPlot = () => {
    const data = [
      {
        y: bins.map(bin => geoIntegrate(bin) * 1.5 / volumeRatio(bin)),
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
        title: { text: ` ` },
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
        filename: 'PREM_geo_integral'
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
        </Card.Body>
      </Card>
    );
  }

export const GeophysicalResponsePlot = () => {
    const data = [
      {
        y: bins.map(bin => geoIntegrate(bin) * rho(bin) * maxRadius * 100 / 2),
        x: bins,
        name: "Geo Integral",
        type: "scatter",
        mode: "lines",
        fill: "none",
        marker: { color: "red" },
      },
    ]
    const layout = {
      title: "Geophysical Response",
      yaxis: {
        title: { text: `(kg/cm<sup>2</sup>)` },
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
        filename: 'PREM_geophysical_response'
      }
    };
    return (
      <Card>
        <Card.Header>PREM Geophysical Response</Card.Header>
        <Card.Body>
          <Plot
            useResizeHandler={true}
            style={{ width: "100%" }}
            data={data} 
            layout={layout}
            config={config}
          />
        <p>Initial results for PREM mantle geophysical response { mantleGeophysicalResponse } kg/cm<sup>2</sup>.</p>
        </Card.Body>
      </Card>
    );
  }
