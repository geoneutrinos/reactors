import { piecewise, scaleLinear } from "d3";
import nuebar from "./nuebarIBDxsec.json";
import nue from "./nueIBDxsec.json";

import { memoize } from "lodash";

export const crossSection16OElectronNeutrinoOld = memoize((Ev: number): number => {
  const energy = nue.energy.map(Math.log10);
  const scale = scaleLinear()
    .domain([energy[0], energy[energy.length - 1]])
    .clamp(true);
  const interpolator = piecewise(nue.crossSection);
  return interpolator(scale(Math.log10(Ev)));
});

export const crossSection16OElectronAntineutrinoOld = memoize((Ev: number): number => {
  const energy = nuebar.energy.map(Math.log10);
  const scale = scaleLinear()
    .domain([energy[0], energy[energy.length - 1]])
    .clamp(true);
  const interpolator = piecewise(nuebar.crossSection);
  return interpolator(scale(Math.log10(Ev)));
});

//const firstNonZero = (energy:number[], area:number[]):number => {
//  for (let i = 0; i < area.length; i++){
//    if (area[i] > 0){
//      return energy[i]
//    }
//  }
//  return 0
//}

//export const electronAntineutrino16OThresholdEnergy = firstNonZero(nuebar.energy, nuebar.crossSection)
//export const electronNeutrino16OThresholdEnergy = firstNonZero(nue.energy, nue.crossSection)
export const electronAntineutrino16OThresholdEnergy = 11.23
export const electronAntineutrino16OThresholdEnergyG1 = 11.30
export const electronAntineutrino16OThresholdEnergyG2 = 18.68
export const electronAntineutrino16OThresholdEnergyG3 = 21.57
export const electronAntineutrino16OThresholdEnergyG4 = 25.70
export const electronNeutrino16OThresholdEnergy = 15.21
export const electronNeutrino16OThresholdEnergyG1 = 15.35
export const electronNeutrino16OThresholdEnergyG2 = 22.70
export const electronNeutrino16OThresholdEnergyG3 = 25.85
export const electronNeutrino16OThresholdEnergyG4 = 29.68

const partial16OCrossSection = (Ev: number, {Ex, a,b,c}:{Ex:number, a:number, b:number, c:number}): number => {
  const TurnedV = Math.log10(Ev ** 0.25 - Ex ** 0.25)
  return 10 ** (a + b * TurnedV + c * TurnedV ** 2) || 0
}

const group16OCrossSection = (Ev: number, Ex: number, a: number, b: number, c: number): number => {
  const TurnedV = Math.log10(Ev ** 0.25 - Ex ** 0.25)
  return 10 ** (a + b * TurnedV + c * TurnedV ** 2) || 0
}

const electronNeutrino16OFitParams = [ // Table 4
  {Ex: 15.21, a:-40.008, b:4.918, c:1.036},
  {Ex: 22.47, a:-39.305, b:4.343, c:0.961},
  {Ex: 25.51, a:-39.655, b:5.263, c:1.236},
  {Ex: 29.35, a:-39.116, b:3.947, c:0.901},
]

const electronAntieutrino16OFitParams = [ // Table 4
  {Ex: 11.23, a:-40.656, b:4.528, c:0.887},
  {Ex: 18.50, a:-40.026, b:4.117, c:0.895},
  {Ex: 21.54, a:-40.060, b:3.743, c:0.565},
  {Ex: 25.38, a:-39.862, b:3.636, c:0.846},
]

export const crossSection16OElectronAntineutrino = (Ev:number): number => {
  return electronAntieutrino16OFitParams.reduce((previous, params) => partial16OCrossSection(Ev, params) + previous, 0)
}

export const crossSection16OElectronNeutrino = (Ev: number):number => {
  return electronNeutrino16OFitParams.reduce((previous, params) => partial16OCrossSection(Ev, params) + previous, 0)
}

electronAntieutrino16OFitParams.forEach(params => console.log(partial16OCrossSection(18, params)))
