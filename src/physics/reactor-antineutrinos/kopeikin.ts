import {piecewise, scaleLinear} from 'd3';
import { ReactorAntineutrinoModel } from ".";
import { IsotopeKeys, Isotopes  } from "../constants";

import esModel from "./estienne";

import kopeikin from "./data/kopeikin_et_al2021.json";


const interpolators = {
  [Isotopes.U238]: piecewise(kopeikin.U238),
  [Isotopes.U235]: piecewise(kopeikin.U235),
}
const minE = kopeikin.energy[0];
const maxE = kopeikin.energy[kopeikin.energy.length -1];

const scale = scaleLinear().domain([minE, maxE])


export function neutrinoEnergyFor(isotope: IsotopeKeys){
  return (Ev: number) => {

    if (isotope === "PU239" || isotope === "PU241"){
      return esModel[isotope](Ev)
    }

    if (Ev < minE){
      return esModel[isotope](Ev)
    }
    if (Ev < maxE){
      const scaledEv = scale(Ev)
      return interpolators[isotope](scaledEv)
    }
    if (Ev >= maxE){
      return esModel[isotope](Ev)
    }
  }
}

const model = Object.fromEntries(Object.keys(Isotopes).map(key => {
  let isotopeKey = key as IsotopeKeys
  return [isotopeKey, neutrinoEnergyFor(isotopeKey)]
})) as ReactorAntineutrinoModel

export default model;