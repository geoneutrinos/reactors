import {piecewise, scaleLinear} from 'd3';
import {Isotopes, IsotopeKeys } from '../constants';
import extra from './data/estienne2018.json';

const interpolators = {
    [Isotopes.U238]: piecewise(extra.U238_450d),
    [Isotopes.U235]: piecewise(extra.U235_4500d),
    [Isotopes.PU239]: piecewise(extra.PU239_450d),
    [Isotopes.PU241]: piecewise(extra.PU241_450d)
}

const scale = scaleLinear().domain([extra.energy[0], extra.energy[extra.energy.length -1]]).clamp(true)

export function neutrinoEnergyFor(isotope: IsotopeKeys){
    return (Ev: number) => {
        const scaledEv = scale(Ev)
        return interpolators[isotope](scaledEv)
    }
}