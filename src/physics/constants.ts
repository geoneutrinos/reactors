export const SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60; //seconds
export const ELEMENTARY_CHARGE = 1.602176634e-19; //Coulombs (exact as of 20 May 2019)
export const ELECTRON_REST_MASS = 0.51099895000; // (15) MeV
export const NEUTRON_REST_MASS = 939.56542052; // (54) MeV
export const PROTON_REST_MASS = 938.27208816; // (29) MeV
export const FERMI_COUPLING_CONSTANT = 1.1663787e-5; // (6) GeV-2
export const HBAR_C = 197.3269804e-13; // MeV cm (exact)
//export const WEAK_MIXING_ANGLE = 0.23153; // ± 0.0004; https://pdg.lbl.gov/2020/reviews/rpp2020-rev-phys-constants.pdf
export const WEAK_MIXING_ANGLE = 0.23867; // ± 0.00016; Erler, J and Ramsey-Musolf, MJ (2005) Phys Rev D 72, 073003.
export const AU = 1.660_539_006_60e-27; // kg (atomic mass aka dalton)

export const FISSION_ENERGIES = {
  //MeV
  U235: 201.92,
  U238: 205.52,
  PU239: 209.99,
  PU241: 213.60,
};

export enum Isotopes {
  U235 = "U235",
  U238 = "U238",
  PU239 = "PU239",
  PU241 = "PU241",
}

export type VFitIsotopes = {
  [key in keyof typeof Isotopes]: number[];
};

// Huber 2011 -> DOI: 10.1103/PhysRevC.84.024617
// Mueller 2011 -> 10.1103/PhysRevC.83.054615
export const V_FIT_PARAMS: VFitIsotopes = {
  U235: [4.367, -4.577, 2.1, -5.294e-1, 6.186e-2, -2.777e-3], // Huber 2011 (phys rev c) table 3
  U238: [4.833e-1, 1.927e-1, -1.283e-1, -6.762e-3, 2.233e-3, -1.536e-4], // Mueller 2011 table 6
  PU239: [4.757, -5.392, 2.563, -6.596e-1, 7.82e-2, -3.536e-3], // Huber 2011 (phys rev c) table 3
  PU241: [2.99, -2.882, 1.278, -3.343e-1, 3.905e-2, -1.754e-3], // Huber 2011 (phys rev c) table 3
};

export const K40_BRANCH_RATIO = {
  beta: 0.8928,
  ec: 0.1072,
};

export const ISOTOPIC_NATURAL_ABUNDANCE = {
  K40: 0.0117,
  TH232: 100,
  U235: 0.72,
  U238: 99.2745,
};

export const ISOTOPIC_HALF_LIFE = {
  // Gy -> Seconds
  K40: 1.277 * 1e9 * SECONDS_PER_YEAR,
  TH232: 14.05 * 1e9 * SECONDS_PER_YEAR,
  U235: 0.7038 * 1e9 * SECONDS_PER_YEAR,
  U238: 4.468 * 1e9 * SECONDS_PER_YEAR,
};

export const ISOTOPIC_NEUTRINOS_PER_DECAY = {
  K40: 1,
  TH232: 4,
  U235: 4,
  U238: 6,
};

export const ISOTOPIC_ATOMIC_MASS = {
  // u -> kg
  K40: 39.963_998_166 * AU,
  TH232: 232.038_0558 * AU,
  U235: 235.043_9302 * AU,
  U238: 238.050_7884 * AU,
};
