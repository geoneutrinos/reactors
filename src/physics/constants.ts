export const SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60; //seconds
export const ELEMENTARY_CHARGE = 1.602176634e-19; //Coulombs (exact as of 20 May 2019)
export const ELECTRON_REST_MASS = 0.51099895000; // (15) MeV; PDG
export const NEUTRON_REST_MASS = 939.56542052; // (54) MeV; PDG
export const PROTON_REST_MASS = 938.27208816; // (29) MeV; PDG
export const ALPHA_REST_MASS = 3727.3794066; // (11) MeV; https://physics.nist.gov/cgi-bin/cuu/Value?malc2mev
export const FERMI_COUPLING_CONSTANT = 1.1663787e-5; // (6) GeV-2
export const HBAR_C = 197.3269804e-13; // MeV cm (exact)
//export const WEAK_MIXING_ANGLE = 0.23153; // ± 0.0004; https://pdg.lbl.gov/2020/reviews/rpp2020-rev-phys-constants.pdf
export const WEAK_MIXING_ANGLE = 0.23867; // ± 0.00016; Erler, J and Ramsey-Musolf, MJ (2005) Phys Rev D 72, 073003.
export const AU = 1.660_539_066_60e-27; // (50) kg (atomic mass aka dalton); PDG
export const MANTLE_MASS = 4.0023618e24; // kg (PREM- A. M. Dziewonski and D. L. Anderson, Phys. Earth Planet. Inter. 25, 297 (1981).
export const MANTLE_GEOPHYSICAL_RESPONSE = 1.1770628e6; // kg/cm2

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
export type IsotopeKeys = keyof typeof Isotopes

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
  K40: 1.248 * 1e9 * SECONDS_PER_YEAR, // J. Chen, Nuclear Data Sheets A=40 140 (2017) 
  TH232: 14.0 * 1e9 * SECONDS_PER_YEAR, // E. Browne, Nuclear Data Shetts A=232 107 (2006)
  U235: 0.704 * 1e9 * SECONDS_PER_YEAR, // E. Browne and J.K. Tuli, Nuclear Data Sheets A=235 122 (2014)
  U238: 4.468 * 1e9 * SECONDS_PER_YEAR, // E. Browne and J.K. Tuli, Nuclear Data Sheets A=238 127 (2015)
  // Gy
  K40e9y: 1.248, // J. Chen, Nuclear Data Sheets A=40 140 (2017) 
  TH232e9y: 14.0, // E. Browne, Nuclear Data Shetts A=232 107 (2006)
  U235e9y: 0.704, // E. Browne and J.K. Tuli, Nuclear Data Sheets A=235 122 (2014)
  U238e9y: 4.468, // E. Browne and J.K. Tuli, Nuclear Data Sheets A=238 127 (2015)
};

export const ISOTOPIC_ALPHAS_PER_DECAY = {
  K40: 0,
  TH232: 6,
  U235: 7,
  U238: 8,
};

export const ISOTOPIC_NEUTRINOS_PER_DECAY = {
  K40: 1,
  TH232: 4,
  U235: 4,
  U238: 6,
};

export const ISOTOPIC_DECAY_ENERGIES = {
  // MeV -> J
  K40_beta: 1.31119275 * ELEMENTARY_CHARGE * 1e6,
  TH232: 42.6464844 * ELEMENTARY_CHARGE * 1e6,
  U235: 46.4042969 * ELEMENTARY_CHARGE * 1e6,
  U238: 51.6835938 * ELEMENTARY_CHARGE * 1e6,
};

export const ISOTOPIC_ATOMIC_MASS = {
  // u -> kg
  K40: 39.963_998_166 * AU,
  TH232: 232.038_0558 * AU,
  U235: 235.043_9302 * AU,
  U238: 238.050_7884 * AU,
};
