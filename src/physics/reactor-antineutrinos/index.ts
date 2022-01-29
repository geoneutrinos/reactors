import { IsotopeKeys } from "../constants";
import HM2011 from './huber-muller';
import ES2018 from './estienne';
import KO2021 from './kopeikin';

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

export type ReactorAntineutrinoModelFunc = (Ev: number) => number

export type ReactorAntineutrinoModel = Record<IsotopeKeys, ReactorAntineutrinoModelFunc>

export enum RANames {
  HM2011 = "Huber (2011) + Mueller et al. (2011)",
  ES2018 = "Estienne et al. (2019) - SM2018",
  KO2021 = "Huber (2011) + Kopeikin et al. (2021)",
}


interface ReactorAntineutrinoModelAction {
  arg: "model",
  value: RANames
}

export const reactorAntineutrinoModel  = {
  modelName: RANames.KO2021,
  [RANames.HM2011]: HM2011,
  [RANames.ES2018]: ES2018,
  [RANames.KO2021]: KO2021,
  model: KO2021
}

export type ReactorAntineutrinoModelApp = typeof reactorAntineutrinoModel;

export const reactorAntineutrinoModelReducer = (state:ReactorAntineutrinoModelApp, action:ReactorAntineutrinoModelAction) => {
  let newModel = {...state}
  switch(action.arg){
    case "model":
      newModel.modelName = action.value;
      newModel.model = newModel[newModel.modelName]
  }
  return newModel;
}
