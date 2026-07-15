import React, {useContext, memo} from 'react';

import { Card, Table } from "react-bootstrap";
import { MathJax } from "better-react-mathjax";
import Plot from "react-plotly.js";

export const GeoneutrinoRates = memo(() => {
  const data= [
    {
      name: `Reality Line`,
      type: "scatter",
      mode: "lines",
      x: [0., 50.],
      y: [0., 80.],
      line: {
        color: "brown",
        width: 2,
        dash: "dask"
      },
    },
    {
      name: `JUNO`,
      type: "scatter",
      mode: "markers",
      x: [40.4],
      y: [73],
      marker: {
        symbol: ["circle"],
        color: "black",
        size: 6
      },
      error_y: {
        type: "data",
        array: [11.0],
        visible: true,
        color: "black"
      },
      error_x: {
        type: "data",
        array: [5.6],
        arrayminus: [5.0],
        visible: true,
        color: "black"
     },
    },
    {
      name: `SNO+`,
      type: "scatter",
      mode: "markers",
      x: [34.2],
      y: [49],
      marker: {
        symbol: ["circle"],
        color: "red",
        size: 6
      },
      error_y: {
        type: "data",
        symmetric: false,
        array: [13.0],
        arrayminus: [12.0],
        visible: true,
        color: "red"
      },
      error_x: {
        type: "data",
        array: [9.2],
        arrayminus: [5.3],
        visible: true,
        color: "red"
     },
    },
    {
      name: `Borexino`,
      type: "scatter",
      mode: "markers",
      x: [25.9],
      y: [47.0],
      marker: {
        symbol: ["circle"],
        color: "green",
        size: 6
      },
      error_y: {
        type: "data",
        symmetric: false,
        array: [8.6],
        arrayminus: [8.1],
        visible: true,
        color: "green"
      },
      error_x: {
        type: "data",
        array: [4.9],
        arrayminus: [4.1],
        visible: true,
        color: "green"
     },
    },
    {
      name: `KamLAND`,
      type: "scatter",
      mode: "markers",
      x: [25.1],
      y: [28.6],
      marker: {
        symbol: ["circle"],
        color: "blue",
        size: 6
      },
      error_y: {
        type: "data",
        symmetric: false,
        array: [5.1],
        arrayminus: [4.8],
        visible: true,
        color: "blue"
      },
      error_x: {
        type: "data",
        array: [5.3],
        arrayminus: [5.3],
        visible: true,
        color: "blue"
     },
    },
  ];
  
  var layout = {
    title: `Geo-neutrino Observations as of 2026`,
    yaxis: {
      title: { text: `Total Rate (TNU)` },
      rangemode: "tozero",
    },
    xaxis: {
      title: { text: `Lithosphere Rate (TNU)` },
      rangemode: "tozero",
    },
    autosize: true,
    legend: {
      x: 0.4,
      xanchor: "right",
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
      filename: 'Geonu-rates'
    }
  };
  return (
    <Card>
      <Card.Header>Geo-neutrino Results 2026</Card.Header>
      <Card.Body>
        <p>
          The reported geo-neutrino observations as of 2026 are plotted as total rate versus lithosphere rate.
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
});
    
export const GeoneutrinoResults = memo(() => {
  const data= [
    {
      name: `JUNO`,
      type: "scatter",
      mode: "markers",
      x: [6.8],
      y: [73],
      marker: {
        symbol: ["circle"],
        color: "black",
        size: 6
      },
      error_y: {
        type: "data",
        array: [11.0],
        visible: true,
        color: "black"
      },
      error_x: {
        type: "data",
        array: [0.1],
        visible: true,
        color: "black"
     },
    },
    {
      name: `SNO+`,
      type: "scatter",
      mode: "markers",
      x: [0.877],
      y: [49],
      marker: {
        symbol: ["circle"],
        color: "red",
        size: 6
      },
      error_y: {
        type: "data",
        symmetric: false,
        array: [13.0],
        arrayminus: [12.0],
        visible: true,
        color: "red"
      },
      error_x: {
        type: "data",
        array: [0.1],
        visible: true,
        color: "red"
     },
    },
    {
      name: `Borexino`,
      type: "scatter",
      mode: "markers",
      x: [1.29],
      y: [47.0],
      marker: {
        symbol: ["circle"],
        color: "green",
        size: 6
      },
      error_y: {
        type: "data",
        symmetric: false,
        array: [8.6],
        arrayminus: [8.1],
        visible: true,
        color: "green"
      },
      error_x: {
        type: "data",
        array: [0.05],
        visible: true,
        color: "green"
     },
    },
    {
      name: `KamLAND`,
      type: "scatter",
      mode: "markers",
      x: [6.39],
      y: [28.6],
      marker: {
        symbol: ["circle"],
        color: "blue",
        size: 6
      },
      error_y: {
        type: "data",
        symmetric: false,
        array: [5.1],
        arrayminus: [4.8],
        visible: true,
        color: "blue"
      },
      error_x: {
        type: "data",
        array: [0.14],
        visible: true,
        color: "blue"
     },
    },
  ];
  
  var layout = {
    title: `Geo-neutrino Observations as of 2026`,
    yaxis: {
      title: { text: `Rate (TNU)` },
      rangemode: "tozero",
    },
    xaxis: {
      title: { text: `Exposure (1/TNU)` },
      autorange: true,
    },
    autosize: true,
    legend: {
      x: 0.6,
      xanchor: "right",
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
      filename: 'Geonu-results'
    }
  };
  return (
    <Card>
      <Card.Header>Geo-neutrino Results 2026</Card.Header>
      <Card.Body>
        <p>
          The reported geo-neutrino observations as of 2026 are plotted as measured rate (TNU) versus detector exposure (TNU<sup>-1</sup>). Black marks the measurement by <a href="https://sites.uci.edu/neutrino2026/">JUNO</a> at Jiangmen, China. Red marks the measurement by <a href="https://arxiv.org/pdf/2604.05746">SNO+</a> at SNOLAB. 
          (The plotted exposures for JUNO and SNO+ are estimated from the reported livetimes, 207.2 and 685 days, respectively, assuming 20 kT and 780 tonnes of LS with 6x10<sup>28</sup> free-protons per tonne, repsectively,
          and assigning an arbitrary uncertainty of 0.1 TNU<sup>-1</sup>).
          Green marks the measurement by <a href="https://doi.org/10.1103/PhysRevD.101.012009">Borexino</a> at Gran Sasso (LNGS), 
          and blue marks the measurement by <a href="https://doi.org/10.1029/2022GL099566">KamLAND</a> at Kamioka.
       </p>
        <Plot
          useResizeHandler={true}
          style={{ width: "100%" }}
          data={data}
          layout={layout}
          config={config}
        />
        <div>
          <Table>
            <thead>
              <tr>
                <th>Rate<sub>U</sub> / Rate<sub>Th</sub> </th>
                <th>Borexino</th>
                <th>JUNO</th>
                <th>KamLAND</th>
                <th>SNO+</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Observation Constraint</td>
                <td>3.70<sup>[1]</sup></td>
                <td>3.4<sup>[2]</sup></td>
                <td>3.72<sup>[3]</sup></td>
                <td>3.29<sup>[4]</sup></td>
              </tr>
              <tr>
                <td>Crust Prediction</td>
                <td>3.45<sup>[1]</sup></td>
                <td>3.3<sup>[5]</sup></td>
                <td>3.78<sup>[3]</sup></td>
                <td>3.31<sup>[6]</sup></td>
              </tr>
              <tr>
                <td>Mantle</td>
                <td>3.85</td>
                <td>3.5</td>
                <td>3.52</td>
                <td>3.24</td>
              </tr>
            </tbody>
          </Table>
          <Table>
            <thead>
              <tr>
                <th>Reported Rate (TNU) </th>
                <th>Borexino<sup>[1]</sup></th>
                <th>JUNO<sup>[2]</sup></th>
                <th>KamLAND<sup>[3]</sup></th>
                <th>SNO+<sup>[4]</sup></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>U + Th</td>
                <td>47.0</td>
                <td>73</td>
                <td>30.7</td>
                <td>49</td>
              </tr>
              <tr>
                <td>U + Th Range</td>
                <td>38.9 - 55.6</td>
                <td>62 - 84</td>
                <td>26.0 - 35.5</td>
                <td>37 - 62</td>
              </tr>
              <tr>
                <td>U</td>
                <td>36.3</td>
                <td>56.4</td>
                <td>24.2</td>
                <td>37.6</td>
              </tr>
              <tr>
                <td>Th</td>
                <td>10.5</td>
                <td>16.6</td>
                <td>6.5</td>
                <td>11.4</td>
              </tr>
            </tbody>
          </Table>
          <Table>
            <thead>
              <tr>
                <th>Crust Rate (TNU) </th>
                <th>Borexino<sup>[1]</sup></th>
                <th>JUNO<sup>[5]</sup></th>
                <th>KamLAND<sup>[3]</sup></th>
                <th>SNO+<sup>[7]</sup></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>U + Th</td>
                <td>25.9</td>
                <td>40.4</td>
                <td>25.1</td>
                <td>34.2</td>
              </tr>
              <tr>
                <td>U + Th Range</td>
                <td>21.8 - 30.8</td>
                <td>35.4 - 46.0</td>
                <td>19.8 - 30.4</td>
                <td>28.9 - 43.4</td>
              </tr>
              <tr>
                <td>U</td>
                <td>19.8</td>
                <td>30.3</td>
                <td>19.5</td>
                <td>26.3</td>
              </tr>
              <tr>
                <td>Th</td>
                <td>5.8</td>
                <td>9.2</td>
                <td>5.6</td>
                <td>7.9</td>
              </tr>
            </tbody>
          </Table>
          <Table>
            <thead>
              <tr>
                <th>Mantle Rate (TNU) </th>
                <th>Borexino<sup>[1]</sup></th>
                <th>JUNO</th>
                <th>KamLAND<sup>[3]</sup></th>
                <th>SNO+</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>U + Th</td>
                <td>21.2</td>
                <td>32.6</td>
                <td>5.6</td>
                <td>14.8</td>
              </tr>
              <tr>
                <td>U</td>
                <td>16.8</td>
                <td>26.1</td>
                <td>4.7</td>
                <td>9.8</td>
              </tr>
              <tr>
                <td>Th</td>
                <td>4.4</td>
                <td>7.4</td>
                <td>0.9</td>
                <td>3.0</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div>
          <small>
          [1] M. Agostini et al. (2020), <i>Comprehensive geoneutrino analysis with Borexino</i>, Phys. Rev. D 101, 012009. <br />
          [2] Y. Wang et al. (2026), <i>JUNO Experiment</i>, talk at Neutrino 2026. <br />
          [3] S. Abe et al. (2022), <i>Abundances of Uranium and Thorium Elements in Earth Estimated by Geoneutrino Spectroscopy</i>, Geophys. Res. Lett. 49, e2022GL099566. <br />
          [4] W. Parker (2026), <i>Reactor Antineutrino Oscillations and Geoneutrinos in SNO+</i>, arXiv:2604.05746v1. <br />
          [5] R. Gao et al. (2019), <i>JULOC: A local 3-D high-resolution crustal model in South China for forecasting geoneutrino measurements at JUNO</i>, PEPI 299, 106409. <br />
          [6] Y. Huang et al. (2013), <i>A reference Earth model for the heat producing elements and associated geoneutrino flux</i>, Geochem., Geophys., Geosyst. 14, 2003-2029. <br />
          [7] V. Strati et al. (2017), <i>Perceiving the Crust in 3-D: A Model Integrating Geological, Geochemical, and Geophysical Data</i>, Geochem., Geophys., Geosyst. 18, 4326-4341. <br />
          </small>
        </div>
      </Card.Body>
    </Card>
  );
});
