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
