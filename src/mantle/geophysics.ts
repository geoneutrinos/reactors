import { 
  ISOTOPIC_HALF_LIFE, 
  ISOTOPIC_NATURAL_ABUNDANCE, 
  K40_BRANCH_RATIO, 
  ELEMENTARY_CHARGE, 
  ISOTOPIC_NEUTRINOS_PER_DECAY, 
  AU,
} from "../physics/constants";

import { ISOTOPIC_DECAY_ENERGIES } from "../physics/derived";

import { 
  averageNeutrinoEnergy238U, 
  averageNeutrinoEnergy235U, 
  averageNeutrinoEnergy232Th, 
  averageNeutrinoEnergy40Kbeta, 
  averageNeutrinoEnergy40Kec, 
} from "../antineutrino-spectrum";

import { 
  lowerMantleMass,
  upperMantleMass,
  lowerMantleGeophysicalResponse,
  upperMantleGeophysicalResponse, 
} from "./PREM";

import {
  lvzMass,
  mantleMass as lunarMantleMass,
  lvzGeophysicalResponse,
  mantleGeophysicalResponse as lunarMantleGeophysicalResponse,
} from "./lunar"

import Elements from "../elements";

const {K40, Th232, U235, U238} = Elements

export const MANTLE_MASS = (upperMantleMass + lowerMantleMass) / 1e3; // kg (PREM- A. M. Dziewonski and D. L. Anderson (1981) Phys. Earth Planet. Inter. 25, 297.
export const MANTLE_GEOPHYSICAL_RESPONSE = lowerMantleGeophysicalResponse + upperMantleGeophysicalResponse; // kg/cm2

export const LUNAR_MANTLE_MASS = (lvzMass + lunarMantleMass) / 1e3;
export const LUNAR_MANTLE_GEOPHYSICAL_RESPONSE = lvzGeophysicalResponse + lunarMantleGeophysicalResponse;

export const ISOTOPIC_DECAY_HEATING = {
  // J kg-1 s-1
  K40beta:
    (Math.log(2) / ISOTOPIC_HALF_LIFE.K40) *
    (((ISOTOPIC_DECAY_ENERGIES.K40beta - averageNeutrinoEnergy40Kbeta) * ELEMENTARY_CHARGE * 1e6 * K40_BRANCH_RATIO.beta) /
      (K40.relative_atomic_mass * AU)),
  K40ec:
    (Math.log(2) / ISOTOPIC_HALF_LIFE.K40) *
    (((ISOTOPIC_DECAY_ENERGIES.K40ec - averageNeutrinoEnergy40Kec) * ELEMENTARY_CHARGE * 1e6 * K40_BRANCH_RATIO.ec) /
      (K40.relative_atomic_mass * AU)),
  TH232:
    (Math.log(2) / ISOTOPIC_HALF_LIFE.TH232) *
    ((ISOTOPIC_DECAY_ENERGIES.TH232 - (averageNeutrinoEnergy232Th * ISOTOPIC_NEUTRINOS_PER_DECAY.TH232)) * ELEMENTARY_CHARGE * 1e6 / 
     (Th232.relative_atomic_mass * AU)),
  U235:
    (Math.log(2) / ISOTOPIC_HALF_LIFE.U235) *
    ((ISOTOPIC_DECAY_ENERGIES.U235 - (averageNeutrinoEnergy235U * ISOTOPIC_NEUTRINOS_PER_DECAY.U235)) * ELEMENTARY_CHARGE * 1e6 / 
     (U235.relative_atomic_mass * AU)),
  U238:
    (Math.log(2) / ISOTOPIC_HALF_LIFE.U238) *
    ((ISOTOPIC_DECAY_ENERGIES.U238 - (averageNeutrinoEnergy238U * ISOTOPIC_NEUTRINOS_PER_DECAY.U238)) * ELEMENTARY_CHARGE * 1e6 / 
     (U238.relative_atomic_mass * AU)),
};

export const ELEMENTAL_DECAY_HEATING = {
  // J kg-1 s-1
  K:
    (ISOTOPIC_NATURAL_ABUNDANCE.K40 * (ISOTOPIC_DECAY_HEATING.K40beta + ISOTOPIC_DECAY_HEATING.K40ec)) * 1e-2,
  TH:
    (ISOTOPIC_NATURAL_ABUNDANCE.TH232 * ISOTOPIC_DECAY_HEATING.TH232) * 1e-2,
  U:
    (ISOTOPIC_NATURAL_ABUNDANCE.U235 * ISOTOPIC_DECAY_HEATING.U235 + ISOTOPIC_NATURAL_ABUNDANCE.U238 * ISOTOPIC_DECAY_HEATING.U238) * 1e-2,
};
