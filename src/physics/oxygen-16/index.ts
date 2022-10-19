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

const electronNeutrino16OFitParams = [ // Table 4
  {Ex: 15.21, a:-40.008, b:4.918, c:1.036, Emin:15.35},
  {Ex: 22.47, a:-39.305, b:4.343, c:0.961, Emin:22.71},
  {Ex: 25.51, a:-39.655, b:5.263, c:1.236, Emin:25.88},
  {Ex: 29.35, a:-39.166, b:3.947, c:0.901, Emin:29.72},
]

const electronAntineutrino16OFitParams = [ // Table 4
  {Ex: 11.23, a:-40.656, b:4.528, c:0.887, Emin:11.30},
  {Ex: 18.50, a:-40.026, b:4.117, c:0.895, Emin:18.68},
  {Ex: 21.54, a:-40.060, b:3.743, c:0.565, Emin:21.57},
  {Ex: 25.38, a:-39.862, b:3.636, c:0.846, Emin:25.73},
]

const partial16OCrossSection = (Ev: number, {Ex,a,b,c,Emin}:{Ex:number, a:number, b:number, c:number, Emin:number}): number => {
  if (Ev <= Emin){ return 0};
  const TurnedV = Math.log10(Ev ** 0.25 - Ex ** 0.25)
  return 10 ** (a + b * TurnedV + c * TurnedV ** 2) || 0
}

export const crossSection16OElectronNeutrinoG1 = (Ev: number) => partial16OCrossSection(Ev, electronNeutrino16OFitParams[0])
export const crossSection16OElectronNeutrinoG2 = (Ev: number) => partial16OCrossSection(Ev, electronNeutrino16OFitParams[1])
export const crossSection16OElectronNeutrinoG3 = (Ev: number) => partial16OCrossSection(Ev, electronNeutrino16OFitParams[2]) 
export const crossSection16OElectronNeutrinoG4 = (Ev: number) => partial16OCrossSection(Ev, electronNeutrino16OFitParams[3]) 

export const crossSection16OElectronAntineutrinoG1 = (Ev: number) => partial16OCrossSection(Ev, electronAntineutrino16OFitParams[0])
export const crossSection16OElectronAntineutrinoG2 = (Ev: number) => partial16OCrossSection(Ev, electronAntineutrino16OFitParams[1])
export const crossSection16OElectronAntineutrinoG3 = (Ev: number) => partial16OCrossSection(Ev, electronAntineutrino16OFitParams[2])
export const crossSection16OElectronAntineutrinoG4 = (Ev: number) => partial16OCrossSection(Ev, electronAntineutrino16OFitParams[3])

export const crossSection16OElectronAntineutrino = (Ev:number): number => {
  return electronAntineutrino16OFitParams.reduce((previous, params) => partial16OCrossSection(Ev, params) + previous, 0)
}

export const crossSection16OElectronNeutrino = (Ev: number):number => {
  return electronNeutrino16OFitParams.reduce((previous, params) => partial16OCrossSection(Ev, params) + previous, 0)
}
