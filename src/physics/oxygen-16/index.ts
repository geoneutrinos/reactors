import { piecewise, scaleLinear } from "d3";
import nuebar from "./nuebarIBDxsec.json";
import nue from "./nueIBDxsec.json";

import { memoize } from "lodash";

export const crossSection16OElectronNeutrino = memoize((Ev: number): number => {
  const energy = nue.energy.map(Math.log10);
  const scale = scaleLinear()
    .domain([energy[0], energy[energy.length - 1]])
    .clamp(true);
  const interpolator = piecewise(nue.crossSection);
  return interpolator(scale(Math.log10(Ev)));
});

export const crossSection16OElectronAntineutrino = memoize((Ev: number): number => {
  const energy = nuebar.energy.map(Math.log10);
  const scale = scaleLinear()
    .domain([energy[0], energy[energy.length - 1]])
    .clamp(true);
  const interpolator = piecewise(nuebar.crossSection);
  return interpolator(scale(Math.log10(Ev)));
});

const firstNonZero = (energy:number[], area:number[]):number => {
  for (let i = 0; i < area.length; i++){
    if (area[i] > 0){
      return energy[i]
    }
  }
  return 0
}

export const electronAntineutrino16OThresholdEnergy = firstNonZero(nuebar.energy, nuebar.crossSection)
export const electronNeutrino16OThresholdEnergy = firstNonZero(nue.energy, nue.crossSection)