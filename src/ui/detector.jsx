import React from 'react';
import {sum} from 'lodash'

function Num({v, p}){
    return <span title={v}>{v.toFixed(p)}</span>
}

export function StatsPanel({cores, spectrum}) {
    const unit = "NIU";

    const coreList = Object.values(cores)
    const closestActiveCore = coreList.filter((core) => core.detectorAnySignal).sort((a, b) => a.detectorDistance - b.detectorDistance)[0]

    const customCores = coreList.filter((core) => core.custom)
    const closestCustomCore = customCores.sort((a, b) => a.detectorDistance - b.detectorDistance)[0]
    // Close Things
    const closestNIU = closestActiveCore?.detectorNIU || 0;
    const closestDistace = closestActiveCore?.detectorDistance || 1000000;

    const totalCoreSignal = sum(coreList.map((core) => core.detectorNIU))

    // custom cores
    const customClosestNIU = closestCustomCore?.detectorNIU || 0;
    const customClosestDistance =  closestCustomCore?.detectorDistance || 1000000;
    const customTotalSignal = sum(customCores.map((core) => core.detectorNIU));

    const customDisplay = customTotalSignal > 0 ? "inline" : "none";

    // geo thigns
    const geoUNIU = sum(spectrum.geoU) * 0.01;
    const geoThNIU = sum(spectrum.geoTh) * 0.01;
    const geoKNIU = sum(spectrum.geoK) * 0.01
    
    const geoTotalNIU = geoUNIU + geoThNIU + geoKNIU;

    // finally
    const totalNIU = totalCoreSignal + geoTotalNIU;

    return (
        <div>
            <i>R</i><sub>total</sub> = {totalNIU.toFixed(1)} {unit}<br />
            <i>R</i><sub>reac</sub> = {totalCoreSignal.toFixed(1)} {unit}<br />
            <i>R</i><sub>closest</sub> = {closestNIU.toFixed(1)} {unit} ({(closestNIU / totalNIU * 100).toFixed(1)} % of total)<br />
            <i>D</i><sub>closest</sub> = {closestDistace > 100000? "N/A": closestDistace.toFixed(2)} km<br />
            <span style={{ "display": customDisplay}}><i>D</i><sub>user</sub> = {customClosestDistance.toFixed(3)} km<br /></span>
            <span style={{ "display": customDisplay}}><i>R</i><sub>user</sub> = {customClosestNIU.toFixed(1)} {unit}<br /></span>
            <i>R</i><sub>geo</sub> = <Num v={geoTotalNIU} p={1}/> {unit} (U = <Num v={geoUNIU} p={1}/>, Th = <Num v={geoThNIU} p={1}/>, K = <Num v={geoKNIU} p={1}/>)<br />
            <small>NIU = Neutrino interaction unit</small><br />
            <small>1 {unit} = 1 interaction/10<sup>32</sup> targets/year</small><br />
            <small>1 kT H<sub>2</sub>O contains 0.668559x10<sup>32</sup> free protons</small>
        </div>
    );
}
