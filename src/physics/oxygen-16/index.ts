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
export const electronNeutrino16OThresholdEnergy = 15.21

const partial16OCrossSection = (Ev: number, {Ex, a,b,c}:{Ex:number, a:number, b:number, c:number}): number => {
  const TurnedV = Math.log10(Ev ** 0.25 - Ex ** 0.25)
  return 10 ** (a + b * TurnedV + c * TurnedV ** 2) || 0
}

export const electronNeutrino16OThresholdEnergyG1 = 15.345
export const crossSection16OElectronNeutrinoG1 = (Ev: number): number => {
  const TurnedV = Math.log10(Ev ** 0.25 - 15.21 ** 0.25)
  return 10 ** (-40.008 + 4.918 * TurnedV + 1.036 * TurnedV ** 2) || 0
}
export const electronNeutrino16OThresholdEnergyG2 = 22.695
export const crossSection16OElectronNeutrinoG2 = (Ev: number): number => {
  const TurnedV = Math.log10(Ev ** 0.25 - 22.47 ** 0.25)
  return 10 ** (-39.305 + 4.343 * TurnedV + 0.961 * TurnedV ** 2) || 0
}
export const electronNeutrino16OThresholdEnergyG3 = 25.845
export const crossSection16OElectronNeutrinoG3 = (Ev: number): number => {
  const TurnedV = Math.log10(Ev ** 0.25 - 25.51 ** 0.25)
  return 10 ** (-39.655 + 5.263 * TurnedV + 1.236 * TurnedV ** 2) || 0
}
export const electronNeutrino16OThresholdEnergyG4 = 29.675
export const crossSection16OElectronNeutrinoG4 = (Ev: number): number => {
  const TurnedV = Math.log10(Ev ** 0.25 - 29.35 ** 0.25)
  return 10 ** (-39.116 + 3.947 * TurnedV + 0.901 * TurnedV ** 2) || 0
}

export const electronAntineutrino16OThresholdEnergyG1 = 11.295
export const crossSection16OElectronAntineutrinoG1 = (Ev: number): number => {
  const TurnedV = Math.log10(Ev ** 0.25 - 11.23 ** 0.25)
  return 10 ** (-40.656 + 4.528 * TurnedV + 0.887 * TurnedV ** 2) || 0
}
export const electronAntineutrino16OThresholdEnergyG2 = 18.675
export const crossSection16OElectronAntineutrinoG2 = (Ev: number): number => {
  const TurnedV = Math.log10(Ev ** 0.25 - 18.50 ** 0.25)
  return 10 ** (-40.026 + 4.117 * TurnedV + 0.895 * TurnedV ** 2) || 0
}
export const electronAntineutrino16OThresholdEnergyG3 = 21.565
export const crossSection16OElectronAntineutrinoG3 = (Ev: number): number => {
  const TurnedV = Math.log10(Ev ** 0.25 - 21.54 ** 0.25)
  return 10 ** (-40.060 + 3.743 * TurnedV + 0.565 * TurnedV ** 2) || 0
}
export const electronAntineutrino16OThresholdEnergyG4 = 25.705
export const crossSection16OElectronAntineutrinoG4 = (Ev: number): number => {
  const TurnedV = Math.log10(Ev ** 0.25 - 25.38 ** 0.25)
  return 10 ** (-39.862 + 3.636 * TurnedV + 0.846 * TurnedV ** 2) || 0
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
