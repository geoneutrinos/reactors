import boron8 from './boron8.json';

import {sum} from 'lodash'

import {CrossSection } from '../physics/neutrino-cross-section'
import { SECONDS_PER_YEAR } from "../physics/constants";

// at some point other ephemerical caluclations should be added here

export const boron8Bins = boron8.map(([bin, spec]) => bin)

interface Boron8Data {
    boron8Flux: number;
    boron8Rate: number[];
    boron8NIU: number;
}

interface Boron8Funcs {
    updateRate: (this: Boron8, crossSection: CrossSection ) => Boron8
}

type Boron8 = Boron8Data & Boron8Funcs;

export const defaultBoron8: Boron8 = {
    boron8Flux: 2.345e6, // cm-2 s-1
    boron8Rate: [],
    boron8NIU: 0,
    updateRate: function(this: Boron8, crossSection:CrossSection){
        const newBoron8 = {...this};
        newBoron8.boron8Rate =  boron8.map(([bin, spec]) => crossSection["Elastic Scattering: Neutrino"](bin) * spec * this.boron8Flux);
        newBoron8.boron8NIU = sum(newBoron8.boron8Rate) * SECONDS_PER_YEAR * 1e32; // targets
        return newBoron8;
    }
}