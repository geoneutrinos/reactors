import React, {useContext, memo} from 'react';

import { Card, Table } from "react-bootstrap";
import { MathJax } from "better-react-mathjax";
import Plot from "react-plotly.js";

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
    title: `Geo-neutrino Results 2026`,
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
          Plot shows the results of geo-neutrino observations as of 2026. Black marks the measurement by <a href="https://sites.uci.edu/neutrino2026/">JUNO</a> at Jiangmen, China. Red marks the measurement by <a href="https://arxiv.org/pdf/2604.05746">SNO+</a> at SNOLAB. 
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
                <td>3.7</td>
                <td>3.4</td>
                <td>3.7</td>
                <td>3.3</td>
              </tr>
              <tr>
                <td>Crust Prediction</td>
                <td>3.1<sup>[1]</sup></td>
                <td>3.3<sup>[2]</sup></td>
                <td>3.5<sup>[1]</sup></td>
                <td>3.3<sup>[1]</sup></td>
              </tr>
              <tr>
                <td>Allowed Mantle</td>
                <td>5.6</td>
                <td>3.5</td>
                <td>4.5</td>
                <td>3.3</td>
              </tr>
            </tbody>
          </Table>
          <Table>
            <thead>
              <tr>
                <th>Rate (TNU) </th>
                <th>Borexino</th>
                <th>JUNO</th>
                <th>KamLAND</th>
                <th>SNO+</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Observed</td>
                <td>47</td>
                <td>73</td>
                <td>28.6</td>
                <td>49</td>
              </tr>
              <tr>
                <td>U Observed</td>
                <td>37.0</td>
                <td>56.4</td>
                <td>22.5</td>
                <td>37.6</td>
              </tr>
              <tr>
                <td>Th Observed</td>
                <td>10.0</td>
                <td>16.6</td>
                <td>6.1</td>
                <td>11.4</td>
              </tr>
              <tr>
                <td>Predicted Crust</td>
                <td>31.9<sup>[1]</sup></td>
                <td>40.4<sup>[2]</sup></td>
                <td>22.7<sup>[1]</sup></td>
                <td>36.7<sup>[1]</sup></td>
              </tr>
              <tr>
                <td>U Predicted Crust</td>
                <td>23.6<sup>[1]</sup></td>
                <td>30.3<sup>[2]</sup></td>
                <td>17.5<sup>[1]</sup></td>
                <td>27.8<sup>[1]</sup></td>
              </tr>
              <tr>
                <td>Th Predicted Crust</td>
                <td>7.6<sup>[1]</sup></td>
                <td>9.2<sup>[2]</sup></td>
                <td>5.0<sup>[1]</sup></td>
                <td>8.4<sup>[1]</sup></td>
              </tr>
              <tr>
                <td>Allowed Mantle</td>
                <td>15.1</td>
                <td>32.6</td>
                <td>5.9</td>
                <td>12.3</td>
              </tr>
              <tr>
                <td>U Allowed Mantle</td>
                <td>13.4</td>
                <td>26.1</td>
                <td>5.0</td>
                <td>9.8</td>
              </tr>
              <tr>
                <td>Th Allowed Mantle</td>
                <td>2.4</td>
                <td>7.4</td>
                <td>1.1</td>
                <td>3.0</td>
              </tr>
              <tr>
                <td>Observed Range</td>
                <td>38.9 - 55.6</td>
                <td>62 - 84</td>
                <td>23.8 - 33.7</td>
                <td>37 - 62</td>
              </tr>
              <tr>
                <td>Predicted Crust Range</td>
                <td>26.1 - 39.2<sup>[1]</sup></td>
                <td>35.4 - 46.0<sup>[2]</sup></td>
                <td>18.6 - 27.6<sup>[1]</sup></td>
                <td>30.4 - 44.2<sup>[1]</sup></td>
              </tr>
              <tr>
                <td>Allowed Mantle Range</td>
                <td>-0.3 - 29.5</td>
                <td>16.0 - 48.6</td>
                <td>-3.8 - 15.1</td>
                <td>-7.2 - 31.6</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div>
          [1] Y. Huang et al. (2013), <i>A reference Earth model for the heat producing elements and associated geoneutrino flux</i>, Geochem., Geophys., Geosyst. 14, 2003-2029. <br />
          [2] R. Gao et al. (2019), <i>JULOC: A local 3-D high-resolution crustal model in South China for forecasting geoneutrino measurements at JUNO</i>, PEPI 299, 106409.
        </div>
      </Card.Body>
    </Card>
  );
});
