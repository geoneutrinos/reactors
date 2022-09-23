import { piecewise, scaleLinear } from "d3";
import nuebar from "./nuebarIBDxsec.json";
import nue from "./nueIBDxsec.json";

export const crossSection16OElectronNeutrino = (Ev: number): number => {
  const energy = nue.energy.map(Math.log10);
  const scale = scaleLinear()
    .domain([energy[0], energy[energy.length - 1]])
    .clamp(true);
  const interpolator = piecewise(nue.crossSection);
  return interpolator(scale(Math.log10(Ev)));
};
export const crossSection16OElectronAntineutrino = (Ev: number): number => {
  const energy = nuebar.energy.map(Math.log10);
  const scale = scaleLinear()
    .domain([energy[0], energy[energy.length - 1]])
    .clamp(true);
  const interpolator = piecewise(nuebar.crossSection);
  return interpolator(scale(Math.log10(Ev)));
};
