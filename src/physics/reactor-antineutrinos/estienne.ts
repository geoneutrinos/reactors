import {piecewise, scaleLinear} from 'd3';
import { ReactorAntineutrinoModel } from '.';
import {Isotopes, IsotopeKeys } from '../constants';
import extra from './data/estienne2018.json';

const interpolators = {
    [Isotopes.U238]: piecewise(extra.U238_450d.map(Math.log)),
    [Isotopes.U235]: piecewise(extra.U235_4500d.map(Math.log)),
    [Isotopes.PU239]: piecewise(extra.PU239_450d.map(Math.log)),
    [Isotopes.PU241]: piecewise(extra.PU241_450d.map(Math.log))
}

const scale = scaleLinear().domain([extra.energy[0], extra.energy[extra.energy.length -1]]).clamp(true)

export function neutrinoEnergyFor(isotope: IsotopeKeys){
    return (Ev: number) => {
        const scaledEv = scale(Ev)
        return Math.exp(interpolators[isotope](scaledEv))
    }
}

const model = Object.fromEntries(Object.keys(Isotopes).map(key => {
    let isotopeKey = key as IsotopeKeys
    return [isotopeKey, neutrinoEnergyFor(isotopeKey)]
  })) as ReactorAntineutrinoModel
  
  export default model;