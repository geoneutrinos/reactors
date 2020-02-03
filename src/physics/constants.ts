export const SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60; //seconds
export const ELEMENTARY_CHARGE = 1.602176634e-19; //Coulombs (exact as of 20 May 2019)
export const ELECTRON_REST_MASS = 0.5109989461 // MeV
export const NEUTRON_REST_MASS = 939.565413 // MeV
export const PROTON_REST_MASS = 938.2720813 //MeV
export const FERMI_COUPLING_CONSTANT = 1.1663787e-5 // GeV-2
export const HBAR_C = 197.3269804e-13 // MeV cm (exact)
export const WEAK_MIXING_ANGLE = 0.2313 // ± 0.0004; arXiv:hep-ph/0212134 ???

export const FISSION_ENERGIES = { //MeV
  "U235":  201.912,
  "U238":  204.997, 
  "PU239": 210.927,
  "PU241": 213.416
};

export enum Isotopes { U235 = "U235", U238 = "U238", PU239 = "PU239", PU241 = "PU241"}

export type VFitIsotopes = {
    [key in keyof typeof Isotopes]: number[]
}

// Huber 2011 -> DOI: 10.1103/PhysRevC.84.024617
// Mueller 2011 -> 10.1103/PhysRevC.83.054615
export const V_FIT_PARAMS:VFitIsotopes = {
  U235:  [4.367, -4.577, 2.100, -5.294e-1, 6.186e-2, -2.777e-3], // Huber 2011 (phys rev c) table 3
  U238:  [4.833e-1, 1.927e-1, -1.283e-1, -6.762e-3, 2.233e-3, -1.536e-4], // Mueller 2011 table 6
  PU239: [4.757, -5.392, 2.563, -6.596e-1, 7.820e-2, -3.536e-3], // Huber 2011 (phys rev c) table 3
  PU241: [2.990, -2.882, 1.278, -3.343e-1, 3.905e-2, -1.754e-3] // Huber 2011 (phys rev c) table 3
}