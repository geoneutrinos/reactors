import {piecewise, scaleLinear} from 'd3';
import { ReactorAntineutrinoModel } from ".";
import { IsotopeKeys, Isotopes  } from "../constants";

import huber from "./huber-muller";

import kopeikin from "./data/kopeikin_et_al2021.json";


const interpolators = {
  [Isotopes.U238]: piecewise(kopeikin.U238.map(Math.log)),
  [Isotopes.U235]: piecewise(kopeikin.U235.map(Math.log)),
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
    if (Ev <= maxE){
      const scaledEv = scale(Ev)
      return Math.exp(interpolators[isotope](scaledEv))
    }
    if (Ev > maxE){
      return huber[isotope](Ev)
    }
  }
}

const model = Object.fromEntries(Object.keys(Isotopes).map(key => {
  let isotopeKey = key as IsotopeKeys
  return [isotopeKey, neutrinoEnergyFor(isotopeKey)]
})) as ReactorAntineutrinoModel

export default model;