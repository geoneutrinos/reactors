import React from 'react';
import Plot from 'react-plotly.js';

export function NuSpectrumPlot({distances, spectrum, detector}){
    const evBins = (new Float64Array(1000)).map((v, i) => i * 0.01 + 0.005)
    return (
            <Plot
              data={[
                {
                  x: evBins,
                  y: spectrum.geoK,
                  name: 'GeoK',
                  type: 'scatter',
                  mode: 'lines',
                  fill: 'tozerox',
                  marker: { color: 'yellow' },
                },
                {
                  x: evBins,
                  y: spectrum.geoU,
                  name: 'GeoU',
                  type: 'scatter',
                  mode: 'lines',
                  fill: 'tozerox',
                  marker: { color: 'blue' },
                },
                {
                  x: evBins,
                  y: spectrum.geoTh,
                  name: 'GeoTh',
                  type: 'scatter',
                  mode: 'lines',
                  fill: 'tozerox',
                  marker: { color: 'red' },
                },
                {
                  x: evBins,
                  y: spectrum.iaea,
                  name: 'Reactor Cores',
                  type: 'scatter',
                  mode: 'lines',
                  fill: 'tozerox',
                  marker: { color: 'green' },
                },
                {
                  x: evBins,
                  y: spectrum.closest,
                  name: `Closest IAEA Core\n (${distances.closestIAEAName})`,
                  type: 'scatter',
                  mode: 'lines',
                  marker: { dash:'dot'},
                },
              ]}
              layout={{ 
                title: `Antineutrino Spectrum: ${["custom", "follow"].includes(detector.current) ? "Custom Location" : detector.current} (${detector.lat.toFixed(1)}N, ${detector.lon.toFixed(1)}E)`,
                showlegend: true,
                legend: {
                  x: 1,
                  xanchor: 'right',
                  y: 1
                },
                autosize:true, 
                xaxis: {
                  title: {text: "Antineutrino Energy E (MeV)"}
                },
                yaxis: {
                  rangemode: 'nonnegative',
                  autorange: true,
                  title: {text:"Rate dR/dE (NIU/MeV)"}
                }
              }}
              useResizeHandler={true}
              style={{width: "100%"}}
              config={{toImageButtonOptions:{width: 900, height: 500, scale:2}}}
            />
        );
}