import React from 'react';
import * as d3 from 'd3';

/**
 * I don't remember exactly what this is doing
 * TODO: replace with lodash?
 * @param {*} two_d_array 
 */
function squish_array(two_d_array){
  let output = new Array(two_d_array[0].length);
  for (let i=0; i < output.length; i++){
    output[i] = 0;
  }

  for (let i=0; i < two_d_array.length; i++){
    for (let ii=0; ii < output.length; ii++){
      output[ii] += two_d_array[i][ii];
    }
  }
  return output;
}

export class NuSpectrumPlot extends React.Component {
  componentDidUpdate(props){
    this.updateLines()
  }
  resize = () => {
    // update width
    var width = parseInt(d3.select(this._div).style('width'), 10);
    width = width - this._margin.left - this._margin.right;

    // reset x range
    this._x.range([0, width]);

    // do the actual resize...
    d3.select(this._svg.node().parentNode)
      .style('width', (width + this._margin.left + this._margin.right) + 'px');

    this._svg.selectAll('.x.label')
      .attr('x', width);

    this._svg.select(".x.axis")
      .call(this._xAxis);

    this._svg.selectAll('rect.background')
      .attr('width', width);
    this._le.attr("transform", "translate(" + (width - 40) + ",0)");

    // redraw the spectrum so it is accurate
    this.updateLines();

  }
  updateLines = () => {
    function for_plot(arr){
      arr = [...arr];
      arr = arr.slice(100,899);
      arr.push(0);
      return arr;
    }

    this._x.domain([0, d3.max(this.props.spectrum.total, function(d, i) { return i; })- 200]);
    this._y.domain([0, d3.max(this.props.spectrum.total, function(d) { return d; })]);
    this._svg.select(".reac")
      .attr("d", this._valueline(for_plot(this.props.spectrum.custom)));
    this._svg.select(".c_reac")
      .attr("d", this._valueline(for_plot(this.props.spectrum.closest)));
    this._svg.select(".geo_u")
      .attr("d", this._valueline(this.props.spectrum.geoU.slice(100,900)));
    this._svg.select(".geo_th")
      .attr("d", this._valueline(this.props.spectrum.geoTh.slice(100,900)));
    this._svg.select(".total")
      .attr("d", this._valueline(for_plot(this.props.spectrum.total)));
    this._svg.select(".iaea")
      .attr("d", this._valueline(for_plot(squish_array([this.props.spectrum.iaea, this.props.spectrum.custom]))));
    this._svg.select("#yaxis")
      .call(this._yAxis);
    this._svg.select(".x.axis")
      .call(this._xAxis);
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("spectrumUpdate", this.updateLines);
  }

  componentDidMount = () => {
    window.addEventListener("resize", this.resize);
    window.addEventListener("spectrumUpdate", this.updateLines);
    // Set the dimensions of the graph
    this._margin = {top: 30, right: 20, bottom: 40, left: 50};
    this._width = parseInt(d3.select(this._div).style('width'), 10) - this._margin.left - this._margin.right;
    this._height = 270 - this._margin.top - this._margin.bottom;
    
    // Set the ranges
    this._x = d3.scaleLinear().range([0, this._width]);
    this._y = d3.scaleLinear().range([this._height, 0]);
    
    // Define the axes
    this._xAxis = d3.axisBottom(this._x)
      .ticks(8).tickFormat(function(d) {return ((d/100)+1).toFixed(0)});
    
    this._yAxis = d3.axisLeft(this._y)
      .ticks(5).tickFormat(function(d) {return (d)});
    
      // Define the line
    var x = this._x;
    var y = this._y;
    this._valueline = d3.line()
      .x(function(d, i) { return x(i); })
      .y(function(d) { return y(d); });
    
      // Adds the svg canvas
      this._svg = d3.select(this._div)
      .append("svg")
      .attr("width", this._width + this._margin.left + this._margin.right)
      .attr("height", this._height + this._margin.top + this._margin.bottom)
      .append("g")
      .attr("transform", 
          "translate(" + this._margin.left + "," + this._margin.top + ")");
    
    this._svg.append("path")
    .attr("class", "total line");
    
    this._svg.append("path")
    .attr("class", "iaea line");
    
    this._svg.append("path")
    .attr("class", "c_reac line");
    
    this._svg.append("path")
    .attr("class", "geo_u line");
    this._svg.append("path")
    .attr("class", "geo_th line");
    
    this._svg.append("path")
    .attr("class", "reac line");
    
    
    // Add the X Axis
    this._svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + this._height + ")")
    .call(this._xAxis);
    
    // Add the Y Axis
    this._svg.append("g")
    .attr("class", "y axis")
    .attr("id", "yaxis")
    .call(this._yAxis);
    
    // Add the axis labels
    this._svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .style("font-size", "15px")
    .attr("y", -50)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Rate dR/dE (TNU/MeV)");

    this._svg.append("text")
    .attr("class", "x label")
    .attr("stroke", "none")
    .attr("fill", "grey")
    .attr("text-anchor", "end")
    .style("font-size", "10px")
    .attr("x", this._width)
    .attr("y", this._height - 4)
    .text("geoneutrinos.org");

    this._svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .style("font-size", "15px")
    .attr("x", this._width)
    .attr("y", this._height + 33)
    .text("Antineutrino Energy E (MeV)");

    
    this._le = this._svg.append("g")
    .attr("transform", "translate(" + (this._width - 0) + ",0)");

    var le = this._le;
    
    
    le.append("text")
    .attr("text-anchor", "end")
    .attr("x", "-2.1em")
    .attr("y", "0.3em")
    .text("Total");
    le.append("text")
    .attr("text-anchor", "end")
    .attr("x", "-2.1em")
    .attr("y", "2.5em")
    .text("Closest Core");
    le.append("text")
    .attr("text-anchor", "end")
    .attr("x", "-2.1em")
    .attr("y", "1.5em")
    .text("Reactor Cores");
    le.append("text")
    .attr("text-anchor", "end")
    .attr("x", "-2.1em")
    .attr("y", "3.5em")
    .text("Geoneutrinos");
    le.append("text")
    .attr("text-anchor", "end")
    .attr("x", "-2.1em")
    .attr("y", "4.5em")
    .text("Uranium");
    le.append("text")
    .attr("text-anchor", "end")
    .attr("x", "-2.1em")
    .attr("y", "5.5em")
    .text("Thorium");
    le.append("text")
    .attr("text-anchor", "end")
    .attr("class", "reac")
    .attr("x", "-2.1em")
    .attr("y", "6.6em")
    .style("display", "none")
    .text("User Reactor");
    
    le.append("line")
    .attr("x1", "-1.9em")
    .attr("x2", "0")
    .attr("y1", "0")
    .attr("y2", "0")
    .attr("stroke-width", 2)
    .style("stroke", "#000");
    le.append("line")
    .attr("x1", "-1.9em")
    .attr("x2", "0")
    .attr("y1", "5.2em")
    .attr("y2", "5.2em")
    .attr("stroke-width", 2)
    .style("stroke", "red");
    le.append("line")
    .attr("x1", "-1.9em")
    .attr("x2", "0")
    .attr("y1", "4.2em")
    .attr("y2", "4.2em")
    .attr("stroke-width", 2)
    .style("stroke", "blue");
    
    le.append("rect")
    .attr("width", "1.9em")
    .attr("height", "1em")
    .attr("x", "-1.9em")
    .attr("y", "0.5em")
    .style("fill", "green");
    le.append("rect")
    .attr("width", "1.9em")
    .attr("height", "1em")
    .attr("x", "-1.9em")
    .attr("y", "1.5em")
    .style("fill", "#999");
    le.append("rect")
    .attr("width", "1.9em")
    .attr("height", "1em")
    .attr("x", "-1.9em")
    .attr("y", "2.5em")
    .style("fill", "yellow");
    
    le.append("line")
    .attr("x1", "-1.9em")
    .attr("x2", "0")
    .attr("y1", "6.3em")
    .attr("y2", "6.3em")
    .attr("stroke-width", 2)
    .style("stroke", "#000")
    .style("stroke-dasharray", "2,1")
    .attr("class", "reac")
    .style("display", "none");
  } 

  render(){
    return (
        <div ref={(c) => this._div = c} className="Plot"></div>
        );
  }
}