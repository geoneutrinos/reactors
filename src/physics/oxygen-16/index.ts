import { piecewise, scaleLinear } from "d3";
import nuebar from "./nuebarIBDxsec.json";
import nue from "./nueIBDxsec.json"

export const crossSection16OElectronNeutrino = (Ev: number):number => {
 const scale = scaleLinear()
   .domain([nue.energy[0], nue.energy[nue.energy.length - 1]])
   .clamp(true);
 const interpolator = piecewise(nue.crossSection)
 return interpolator(scale(Ev))
}
export const crossSection16OElectronAntineutrino = (Ev:number):number => {
 const scale = scaleLinear()
   .domain([nuebar.energy[0], nuebar.energy[nue.energy.length - 1]])
   .clamp(true);
 const interpolator = piecewise(nuebar.crossSection)
 return interpolator(scale(Ev))
}