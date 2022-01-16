import { IsotopeKeys } from "../constants";

/**
 * Returns the partial internation rate which has not been scaled for 
 * thermal power of a core, had the neutrinos oscilated, or had the 
 * distance taken into account.
 * 
 * @param Ev - Energy of the neutrino in MeV
 * @param Q - Energy per fision of some nuclei
 * @param crossSection - Fuction which takes the neutrino enery in MeV and returns the cross section in cm^-2
 * @param energySpectrum - function which takes the neutnrio enery in MeV and eturns the differential neutrino enery
 */
export function partialInteractionRate(Ev: number, Q: number, crossSection:(Ev:number)=>number, neutrinoEnergyFunction:(Ev: number) => number): number{
  return neutrinoEnergyFunction(Ev) * 1/Q * crossSection(Ev)/(4 * Math.PI);
}

type ReactorAntineutrinoModelFunc = (Ev: number) => number

type ReactorAntineutrinoModel = Record<IsotopeKeys, ReactorAntineutrinoModelFunc>

export enum RANames {
  HM2011 = "Huber-Mueller 2011",
  ES2018 = "Estienne et. al. 2018",
}

interface ReactorAntineutrinoModelConfig {
  reactorAntineutrino: RANames
}