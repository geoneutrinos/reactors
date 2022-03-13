import {piecewise, scaleLinear} from 'd3';
import { ReactorAntineutrinoModel } from ".";
import { IsotopeKeys, Isotopes  } from "../constants";

import huber, {model_uncertanties as hmUncertanties} from "./huber-muller";

import kopeikin from "./data/kopeikin_et_al2021.json";


const interpolators = {
  [Isotopes.U238]: piecewise(kopeikin.U238.map(Math.log)),
  [Isotopes.U235]: piecewise(kopeikin.U235.map(Math.log)),
}

const uncertanties = {
  [Isotopes.U238]: piecewise(kopeikin.U238_u),
  [Isotopes.U235]: piecewise(kopeikin.U235_u),
}

const minE = kopeikin.energy[0];
const maxE = kopeikin.energy[kopeikin.energy.length -1];

const scale = scaleLinear().domain([minE, maxE])


export function neutrinoEnergyFor(isotope: IsotopeKeys){
  return (Ev: number) => {

    if (isotope === "PU239" || isotope === "PU241"){
      return huber[isotope](Ev)
    }

    if (Ev < minE){
      return huber[isotope](Ev)
    }
    else if (Ev <= maxE){
      const scaledEv = scale(Ev)
      return Math.exp(interpolators[isotope](scaledEv))
    }
    else {
      return huber[isotope](Ev)
    }
  }
}

const model = Object.fromEntries(Object.keys(Isotopes).map(key => {
  let isotopeKey = key as IsotopeKeys
  return [isotopeKey, neutrinoEnergyFor(isotopeKey)]
})) as ReactorAntineutrinoModel

export const model_uncertanties = Object.fromEntries(
  Object.keys(Isotopes).map((key) => {
    let isotopeKey = key as IsotopeKeys;
    return [
      isotopeKey,
      (Ev) => {
        if (isotopeKey === "PU239" || isotopeKey === "PU241") {
          return hmUncertanties[isotopeKey](Ev);
        }

        if (Ev < minE) {
          return hmUncertanties[isotopeKey](Ev);
        } else if (Ev <= maxE) {
          const scaledEv = scale(Ev);
          return (
            neutrinoEnergyFor(isotopeKey)(Ev) *
            uncertanties[isotopeKey](scaledEv)
          );
        } else {
          return hmUncertanties[isotopeKey](Ev);
        }
      },
    ];
  })
) as ReactorAntineutrinoModel;

export default model;