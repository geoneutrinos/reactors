import React from 'react';
import * as d3 from 'd3';

export class StatsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total_tnu: d3.sum(this.props.spectrum.total) * 0.01,
            total_tnu_geo: d3.sum(this.props.spectrum.total.slice(0, 326)) * 0.01,
            closest_tnu: d3.sum(this.props.spectrum.closest) * 0.01,
            closest_distance: this.props.distances.closestIAEA,
            custom_distance: this.props.distances.closestUser,
            custom_tnu: d3.sum(this.props.spectrum.custom) * 0.01,
            geo_tnu: (d3.sum(this.props.spectrum.geoU) + d3.sum(this.props.spectrum.geoTh)) * 0.01,
            geo_u_tnu: d3.sum(this.props.spectrum.geoU) * 0.01,
            geo_th_tnu: d3.sum(this.props.spectrum.geoTh) * 0.01,
            reactors_tnu: (d3.sum(this.props.spectrum.iaea) + d3.sum(this.props.spectrum.custom)) * 0.01,
            geo_r: (d3.sum(this.props.spectrum.geoTh) / d3.sum(this.props.spectrum.geoU)) / 0.066,
        }
    }
    render = () => {
        function userDisplay(rate) {
            if (rate > 0) {
                return "inline";
            } else {
                return "none";
            }
        };
        return (
            <div>
                <i>R</i><sub>total</sub> = {this.state.total_tnu.toFixed(1)} TNU<br />
                <i>R</i><sub>reac</sub> = {this.state.reactors_tnu.toFixed(1)} TNU<br />
                <i>R</i><sub>closest</sub> = {this.state.closest_tnu.toFixed(1)} TNU ({(this.state.closest_tnu / this.state.total_tnu * 100).toFixed(1)} % of total)<br />
                <i>D</i><sub>closest</sub> = {this.state.closest_distance.toFixed(2)} km<br />
                <span style={{ "display": userDisplay(this.state.custom_tnu) }}><i>D</i><sub>user</sub> = {this.state.custom_distance.toFixed(3)} km<br /></span>
                <span style={{ "display": userDisplay(this.state.custom_tnu) }}><i>R</i><sub>user</sub> = {this.state.custom_tnu.toFixed(1)} TNU<br /></span>
                <i>R</i><sub>E &lt; 3.275 MeV</sub> = {this.state.total_tnu_geo.toFixed(1)} TNU<br />
                <i>R</i><sub>geo</sub> = {this.state.geo_tnu.toFixed(1)} TNU (U = {this.state.geo_u_tnu.toFixed(1)}, Th = {this.state.geo_th_tnu.toFixed(1)})<br />
                <i>Th/U</i><sub>geo</sub> = {this.state.geo_r.toFixed(1)}<br />
                <small>1 TNU = 1 event/10<sup>32</sup> free protons/year</small><br />
                <small>1 kT H<sub>2</sub>O contains 0.668559x10<sup>32</sup> free protons</small>
            </div>
        );
    }
}
