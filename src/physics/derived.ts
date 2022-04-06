import {
  ISOTOPIC_ATOMIC_MASS,
  ISOTOPIC_HALF_LIFE,
  ISOTOPIC_NEUTRINOS_PER_DECAY,
  ISOTOPIC_ALPHAS_PER_DECAY,
  K40_BRANCH_RATIO,
  ELECTRON_REST_MASS,
  NEUTRON_REST_MASS,
  PROTON_REST_MASS,
  ALPHA_REST_MASS,
  ELEMENTARY_CHARGE,
} from "./constants";

import Elements from "../elements";

// Can "destructure" the elements needed:
const {K40, Th232, U235, U238, Ca40, Pb208, Pb207, Pb206} = Elements

// These have a relative_atomic_mass property
// e.g. K40.relative_atomic_mass is 39.963998166

export const ISOTOPIC_DECAY_ENERGIES = {
   // MeV
   K40:
     ((K40.relative_atomic_mass - Ca40.relative_atomic_mass) - ISOTOPIC_ALPHAS_PER_DECAY.K40 * 
      (ALPHA_REST_MASS + 2 * ELECTRON_REST_MASS)) * ELEMENTARY_CHARGE * 1e6,
   TH232:
     ((Th232.relative_atomic_mass - Pb208.relative_atomic_mass) - ISOTOPIC_ALPHAS_PER_DECAY.Th232 * 
      (ALPHA_REST_MASS + 2 * ELECTRON_REST_MASS)) * ELEMENTARY_CHARGE * 1e6,
   U235:
     ((U235.relative_atomic_mass - Pb207.relative_atomic_mass) - ISOTOPIC_ALPHAS_PER_DECAY.U235 * 
      (ALPHA_REST_MASS + 2 * ELECTRON_REST_MASS)) * ELEMENTARY_CHARGE * 1e6,
   U238:
     ((U238.relative_atomic_mass - Pb206.relative_atomic_mass) - ISOTOPIC_ALPHAS_PER_DECAY.U238 * 
      (ALPHA_REST_MASS + 2 * ELECTRON_REST_MASS)) * ELEMENTARY_CHARGE * 1e6,
 };

// ISOTOPIC_DECAY_HEATING moved to antineutrino-specturm due to circular import
  
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
