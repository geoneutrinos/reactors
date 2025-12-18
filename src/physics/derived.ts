import {
  ISOTOPIC_HALF_LIFE,
  ISOTOPIC_NEUTRINOS_PER_DECAY,
  ISOTOPIC_ALPHAS_PER_DECAY,
  K40_BRANCH_RATIO,
  ELECTRON_REST_MASS,
  NEUTRON_REST_MASS,
  PROTON_REST_MASS,
  ALPHA_REST_MASS,
  ATOMIC_MASS_UNIT,
  AU,
} from "./constants";

import Elements from "../elements";

// Can "destructure" the elements needed:
const {K40, Th232, U235, U238, Ca40, Ar40, Pb208, Pb207, Pb206} = Elements

// These have a relative_atomic_mass property
// e.g. K40.relative_atomic_mass is 39.963998166

export const ISOTOPIC_DECAY_ENERGIES = {
   // MeV
   K40beta:
     (K40.relative_atomic_mass - Ca40.relative_atomic_mass) * ATOMIC_MASS_UNIT - ISOTOPIC_ALPHAS_PER_DECAY.K40 * 
      (ALPHA_REST_MASS + 2 * ELECTRON_REST_MASS),
   K40ec:
     (K40.relative_atomic_mass - Ar40.relative_atomic_mass) * ATOMIC_MASS_UNIT - ISOTOPIC_ALPHAS_PER_DECAY.K40 * 
      (ALPHA_REST_MASS + 2 * ELECTRON_REST_MASS),
   TH232:
     (Th232.relative_atomic_mass - Pb208.relative_atomic_mass) * ATOMIC_MASS_UNIT - ISOTOPIC_ALPHAS_PER_DECAY.TH232 * 
      (ALPHA_REST_MASS + 2 * ELECTRON_REST_MASS),
   U235:
     (U235.relative_atomic_mass - Pb207.relative_atomic_mass) * ATOMIC_MASS_UNIT - ISOTOPIC_ALPHAS_PER_DECAY.U235 * 
      (ALPHA_REST_MASS + 2 * ELECTRON_REST_MASS),
   U238:
     (U238.relative_atomic_mass - Pb206.relative_atomic_mass) * ATOMIC_MASS_UNIT - ISOTOPIC_ALPHAS_PER_DECAY.U238 * 
      (ALPHA_REST_MASS + 2 * ELECTRON_REST_MASS),
 };

// ISOTOPIC_DECAY_HEATING resides in geophysics.ts
  
export const ISOTOPIC_NEUTRINO_LUMINOSITY = {
  // kg-1 s-1
  K40beta:
    (Math.log(2) / ISOTOPIC_HALF_LIFE.K40) *
    ((ISOTOPIC_NEUTRINOS_PER_DECAY.K40 * K40_BRANCH_RATIO.beta) /
      (K40.relative_atomic_mass * AU)),
  K40ec:
    (Math.log(2) / ISOTOPIC_HALF_LIFE.K40) *
    ((ISOTOPIC_NEUTRINOS_PER_DECAY.K40 * K40_BRANCH_RATIO.ec) /
      (K40.relative_atomic_mass * AU)),
  TH232:
    (Math.log(2) / ISOTOPIC_HALF_LIFE.TH232) *
    (ISOTOPIC_NEUTRINOS_PER_DECAY.TH232 / (Th232.relative_atomic_mass * AU)),
  U235:
    (Math.log(2) / ISOTOPIC_HALF_LIFE.U235) *
    (ISOTOPIC_NEUTRINOS_PER_DECAY.U235 / (U235.relative_atomic_mass * AU)),
  U238:
    (Math.log(2) / ISOTOPIC_HALF_LIFE.U238) *
    (ISOTOPIC_NEUTRINOS_PER_DECAY.U238 / (U238.relative_atomic_mass * AU)),
};

export const ISOTOPIC_ATOMIC_MASS_KG = {
  // kg
  // used only by isotope-data.tsx
  K40:
    K40.relative_atomic_mass * AU,
  TH232:
    Th232.relative_atomic_mass * AU,
  U235:
    U235.relative_atomic_mass * AU,
  U238:
    U238.relative_atomic_mass * AU,
  AR40:
    Ar40.relative_atomic_mass * AU,
  CA40:
    Ca40.relative_atomic_mass * AU,
  PB208:
    Pb208.relative_atomic_mass * AU,
  PB207:
    Pb207.relative_atomic_mass * AU,
  PB206:
    Pb206.relative_atomic_mass * AU,
};

export const IBD_THRESHOLD =
  ((ELECTRON_REST_MASS + NEUTRON_REST_MASS) ** 2 - PROTON_REST_MASS ** 2) /
  (2 * PROTON_REST_MASS);
