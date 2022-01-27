import {piecewise, scaleLinear} from 'd3';
import { ReactorAntineutrinoModel } from ".";
import { IsotopeKeys, Isotopes  } from "../constants";

import esModel from "./estienne";

import huber from "./data/huber2011.json";
import muller from "./data/mueller_et_al2011.json";

// Huber 2011 -> DOI: 10.1103/PhysRevC.84.024617
// Mueller 2011 -> 10.1103/PhysRevC.83.054615
export const V_FIT_PARAMS: Record<IsotopeKeys, number[]> = {
  U235: [4.367, -4.577, 2.1, -5.294e-1, 6.186e-2, -2.777e-3], // Huber 2011 (phys rev c) table 3
  U238: [4.833e-1, 1.927e-1, -1.283e-1, -6.762e-3, 2.233e-3, -1.536e-4], // Mueller 2011 table 6
  PU239: [4.757, -5.392, 2.563, -6.596e-1, 7.82e-2, -3.536e-3], // Huber 2011 (phys rev c) table 3
  PU241: [2.99, -2.882, 1.278, -3.343e-1, 3.905e-2, -1.754e-3], // Huber 2011 (phys rev c) table 3
};

const interpolators = {
  [Isotopes.U238]: piecewise(muller.U238_450d.map(Math.log)),
  [Isotopes.U235]: piecewise(huber.U235_12h.map(Math.log)),
  [Isotopes.PU239]: piecewise(huber.PU239_3h.map(Math.log)),
  [Isotopes.PU241]: piecewise(huber.PU241_43h.map(Math.log)),
}
const minE = muller.energy[0];
const maxE = muller.energy[muller.energy.length -1];

const scale = scaleLinear().domain([minE, maxE])

/**
 * estimate of the differential neutrino energy, usually represented by the symbol lambda
 * @param Ev - Energy of the neutrino in MeV
 * @param c  - One or more unitless fitted coeficients
 */
 export function neutrinoEnergy(Ev:number, ...c: number[]): number{
    const params = c.map((cv, i) => cv * Math.pow(Ev, i));
    return Math.exp(params.reduce((sum, value) => sum + value, 0));
  }

export function neutrinoEnergyFor(isotope: IsotopeKeys){
  return (Ev: number) => {
    if (Ev < minE){
      return esModel[isotope](Ev)
    }
    if (Ev <= maxE){
      const scaledEv = scale(Ev)
      return Math.exp(interpolators[isotope](scaledEv))
    }
    if (Ev > maxE){
      return esModel[isotope](Ev)
    }
  }
}

const model = Object.fromEntries(Object.keys(Isotopes).map(key => {
  let isotopeKey = key as IsotopeKeys
  return [isotopeKey, neutrinoEnergyFor(isotopeKey)]
})) as ReactorAntineutrinoModel

export default model;