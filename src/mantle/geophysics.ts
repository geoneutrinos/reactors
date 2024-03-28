import { 
  ISOTOPIC_HALF_LIFE, 
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
  averageNeutrinoEnergy40K, 
  averageNeutrinoEnergy40KEC, 
} from "../antineutrino-spectrum";

import { mantleMass,mantleGeophysicalResponse } from "./PREM";

import Elements from "../elements";

const {K40, Th232, U235, U238} = Elements

export const MANTLE_MASS = mantleMass / 1e3; // kg (PREM- A. M. Dziewonski and D. L. Anderson, Phys. Earth Planet. Inter. 25, 297 (1981).
export const MANTLE_GEOPHYSICAL_RESPONSE = mantleGeophysicalResponse; // kg/cm2

export const ISOTOPIC_DECAY_HEATING = {
  // J kg-1 s-1
  K40beta:
    (Math.log(2) / ISOTOPIC_HALF_LIFE.K40) *
    (((ISOTOPIC_DECAY_ENERGIES.K40 - averageNeutrinoEnergy40K) * ELEMENTARY_CHARGE * 1e6 * K40_BRANCH_RATIO.beta) /
      (K40.relative_atomic_mass * AU)),
  K40ec:
    (Math.log(2) / ISOTOPIC_HALF_LIFE.K40) *
    (((ISOTOPIC_DECAY_ENERGIES.K40EC - averageNeutrinoEnergy40KEC) * ELEMENTARY_CHARGE * 1e6 * K40_BRANCH_RATIO.ec) /
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
