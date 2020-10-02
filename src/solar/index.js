import boron8 from './boron8.json';

import {sum} from 'lodash'

import {crossSectionElectionNeutrinoES} from '../physics/neutrino-cross-section'
import { SECONDS_PER_YEAR } from "../physics/constants";

// at some point other ephemerical caluclations should be added here

export const BORON8_FLUX = 2.345e6 // cm-2 s-1

export const BORON_8_RATE = boron8.map(([bin, spec]) => crossSectionElectionNeutrinoES(bin) * spec * BORON8_FLUX)

export const BORON_8_NIU = sum(BORON_8_RATE) * SECONDS_PER_YEAR * 1e32 // 1e32 => targets

export { boron8 };