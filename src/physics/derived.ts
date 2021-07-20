import {
  ISOTOPIC_ATOMIC_MASS,
  ISOTOPIC_HALF_LIFE,
  ISOTOPIC_NEUTRINOS_PER_DECAY,
  K40_BRANCH_RATIO,
  ELECTRON_REST_MASS,
  NEUTRON_REST_MASS,
  PROTON_REST_MASS,
} from "./constants";

export const ISOTOPIC_NEUTRINO_LUMINOSITY = {
  // kg-1 s-1
  K40:
    (Math.log(2) / ISOTOPIC_HALF_LIFE.K40) *
    ((ISOTOPIC_NEUTRINOS_PER_DECAY.K40 * K40_BRANCH_RATIO.beta) /
      ISOTOPIC_ATOMIC_MASS.K40),
  TH232:
    (Math.log(2) / ISOTOPIC_HALF_LIFE.TH232) *
    (ISOTOPIC_NEUTRINOS_PER_DECAY.TH232 / ISOTOPIC_ATOMIC_MASS.TH232),
  U235:
    (Math.log(2) / ISOTOPIC_HALF_LIFE.U235) *
    (ISOTOPIC_NEUTRINOS_PER_DECAY.U235 / ISOTOPIC_ATOMIC_MASS.U235),
  U238:
    (Math.log(2) / ISOTOPIC_HALF_LIFE.U238) *
    (ISOTOPIC_NEUTRINOS_PER_DECAY.U238 / ISOTOPIC_ATOMIC_MASS.U238),
};

export const IBD_THRESHOLD =
  ((ELECTRON_REST_MASS + NEUTRON_REST_MASS) ** 2 - PROTON_REST_MASS ** 2) /
  (2 * PROTON_REST_MASS);
