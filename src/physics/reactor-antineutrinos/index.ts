import { IsotopeKeys } from "../constants";
import ES2018, {model_uncertanties as ES2018_uncertanties} from './estienne';
import HM2011, {model_uncertanties as HM2011_uncertanties} from './huber-muller';
import KO2021, {model_uncertanties as KO_uncertanties} from './kopeikin';

/**
 * Returns an intermediate value for the interaction rate, which accounts for neither the
 * thermal power of a reactor core, nor the inverse square of the distance to a reactor core,
 * nor the spectral distortion due to neutrino oscillations
 * 
 * @param Ev - Energy of the neutrino in MeV
 * @param Q - Energy per fission of the fissionable nuclei in the reactor fuel
 * @param crossSection - Function which returns the interaction cross section in cm^2 for the given neutrino energy in MeV
 * @param energySpectrum - function which takes the neutrino energy in MeV and returns the differential neutrino energy
 */
export function partialInteractionRate(Ev: number, Q: number, crossSection:(Ev:number)=>number, neutrinoEnergyFunction:(Ev: number) => number): number{
  return neutrinoEnergyFunction(Ev) * 1/Q * crossSection(Ev)/(4 * Math.PI);
}

export type ReactorAntineutrinoModelFunc = (Ev: number) => number

export type ReactorAntineutrinoModel = Record<IsotopeKeys, ReactorAntineutrinoModelFunc>

export enum RANames {
  KO2021 = "Huber (2011) + Kopeikin et al. (2021)",
  HM2011 = "Huber (2011) + Mueller et al. (2011)",
  ES2018 = "Estienne et al. (2019) - SM2018",
}

const uncertanties = {
  [RANames.KO2021]: KO_uncertanties,
  [RANames.HM2011]: HM2011_uncertanties,
  [RANames.ES2018]: ES2018_uncertanties,
}


interface ReactorAntineutrinoModelAction {
  arg: "model",
  value: RANames
}

export const reactorAntineutrinoModel  = {
  modelName: RANames.KO2021,
  [RANames.KO2021]: KO2021,
  [RANames.HM2011]: HM2011,
  [RANames.ES2018]: ES2018,
  model: KO2021,
  uncertanty: uncertanties[RANames.KO2021],
}

export type ReactorAntineutrinoModelApp = typeof reactorAntineutrinoModel;

export const reactorAntineutrinoModelReducer = (state:ReactorAntineutrinoModelApp, action:ReactorAntineutrinoModelAction) => {
  let newModel = {...state}
  switch(action.arg){
    case "model":
      newModel.modelName = action.value;
      newModel.model = newModel[newModel.modelName]
      newModel.uncertanty = uncertanties[newModel.modelName]
  }
  return newModel;
}
