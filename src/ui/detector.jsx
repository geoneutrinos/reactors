import React from 'react';
import * as d3 from 'd3';

export class StatsPanel extends React.Component {
    render = () => {
        const data = {
            total_tnu: d3.sum(this.props.spectrum.total) * 0.01,
            total_tnu_geo: d3.sum(this.props.spectrum.total.slice(0, 326)) * 0.01,
            closest_tnu: d3.sum(this.props.spectrum.closest) * 0.01,
            closest_distance: this.props.distances.closestIAEA,
            custom_distance: this.props.distances.closestUser,
            custom_tnu: d3.sum(this.props.spectrum.custom) * 0.01,
            geo_tnu: (d3.sum(this.props.spectrum.geoU) + d3.sum(this.props.spectrum.geoTh)) * 0.01,
            geo_u_tnu: d3.sum(this.props.spectrum.geoU) * 0.01,
            geo_th_tnu: d3.sum(this.props.spectrum.geoTh) * 0.01,
            geo_k_tnu: d3.sum(this.props.spectrum.geoK) * 0.01,
            reactors_tnu: (d3.sum(this.props.spectrum.iaea) + d3.sum(this.props.spectrum.custom)) * 0.01,
            geo_r: (d3.sum(this.props.spectrum.geoTh) / d3.sum(this.props.spectrum.geoU)) / 0.066,
        }
        function userDisplay(rate) {
            if (rate > 0) {
                return "inline";
            } else {
                return "none";
            }
        };
        const unit = "NIU";
        return (
            <div>
                <i>R</i><sub>total</sub> = {data.total_tnu.toFixed(1)} {unit}<br />
                <i>R</i><sub>reac</sub> = {data.reactors_tnu.toFixed(1)} {unit}<br />
                <i>R</i><sub>closest</sub> = {data.closest_tnu.toFixed(1)} {unit} ({(data.closest_tnu / data.total_tnu * 100).toFixed(1)} % of total)<br />
                <i>D</i><sub>closest</sub> = {data.closest_distance.toFixed(2)} km<br />
                <span style={{ "display": userDisplay(data.custom_tnu) }}><i>D</i><sub>user</sub> = {data.custom_distance.toFixed(3)} km<br /></span>
                <span style={{ "display": userDisplay(data.custom_tnu) }}><i>R</i><sub>user</sub> = {data.custom_tnu.toFixed(1)} {unit}<br /></span>
                <i>R</i><sub>E &lt; 3.275 MeV</sub> = {data.total_tnu_geo.toFixed(1)} {unit}<br />
                <i>R</i><sub>geo</sub> = {data.geo_tnu.toFixed(1)} {unit} (U = {data.geo_u_tnu.toFixed(1)}, Th = {data.geo_th_tnu.toFixed(1)}, K = {data.geo_k_tnu.toFixed(1)})<br />
                <i>Th/U</i><sub>geo</sub> = {data.geo_r.toFixed(1)}<br />
                <small>NIU = Neutrino interaction unit</small><br />
                <small>1 {unit} = 1 interaction/10<sup>32</sup> targets/year</small><br />
                <small>1 kT H<sub>2</sub>O contains 0.668559x10<sup>32</sup> free protons</small>
            </div>
        );
    }
}
