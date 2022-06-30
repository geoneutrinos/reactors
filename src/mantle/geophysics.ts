import { ISOTOPIC_HALF_LIFE, ISOTOPIC_ATOMIC_MASS, K40_BRANCH_RATIO, ELEMENTARY_CHARGE } from "../physics/constants";
import { ISOTOPIC_DECAY_ENERGIES } from "../physics/derived";
import { averageNeutrinoEnergy } from "../antineutrino-spectrum";

export const MANTLE_MASS = 4.0023618e24; // kg (PREM- A. M. Dziewonski and D. L. Anderson, Phys. Earth Planet. Inter. 25, 297 (1981).
export const MANTLE_GEOPHYSICAL_RESPONSE = 1.1770628e6; // kg/cm2

export const ISOTOPIC_DECAY_HEATING = {
  // J kg-1 s-1
  K40beta:
    (Math.log(2) / ISOTOPIC_HALF_LIFE.K40) *
    (((ISOTOPIC_DECAY_ENERGIES.K40 - averageNeutrinoEnergy40K) * ELEMENTARY_CHARGE * 1e6 * K40_BRANCH_RATIO.beta) /
      ISOTOPIC_ATOMIC_MASS.K40),
  TH232:
    (Math.log(2) / ISOTOPIC_HALF_LIFE.TH232) *
    ((ISOTOPIC_DECAY_ENERGIES.TH232 - averageNeutrinoEnergy232Th) * ELEMENTARY_CHARGE * 1e6 / ISOTOPIC_ATOMIC_MASS.TH232),
  U235:
    (Math.log(2) / ISOTOPIC_HALF_LIFE.U235) *
    ((ISOTOPIC_DECAY_ENERGIES.U235 - averageNeutrinoEnergy235U) * ELEMENTARY_CHARGE * 1e6 / ISOTOPIC_ATOMIC_MASS.U235),
  U238:
    (Math.log(2) / ISOTOPIC_HALF_LIFE.U238) *
    ((ISOTOPIC_DECAY_ENERGIES.U238 - averageNeutrinoEnergy238U) * ELEMENTARY_CHARGE * 1e6 / ISOTOPIC_ATOMIC_MASS.U238),
};
