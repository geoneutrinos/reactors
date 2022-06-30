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
export const ATOMIC_MASS_UNIT = 931.49410242; // (28) MeV/c2; PDG
export const AU = 1.660_539_066_60e-27; // (50) kg (atomic mass aka dalton); PDG

export const FISSION_ENERGIES = {
  // MeV ref: V. I. Kopeikin et al., "Reactor as a Source of Antineutrinos: Thermal Fission Energy," Phys. Atom. Nucl. 67, 1892 (2004)
  // U235Ko: 201.92,
  // U238Ko: 205.52,
  // PU239Ko: 209.99,
  // PU241Ko: 213.60,
  // Fission energies used previously (source?)
  // U235dunno: 202.79,
  // U238dunno: 205.93,
  // PU239dunno: 207.32,
  // PU241dunno: 211.04,
  // MeV ref: X. B. Ma et al., "Improved calculation of the energy release in neutron-induced fission." Phys. Rev. C 88, 014605 (2013)
  U235: 202.36,
  U238: 205.99,
  PU239: 211.12,
  PU241: 214.26,
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
  K40: 0.0117, // https://ciaaw.org/isotopic-abundances.htm
  TH232: 99.98, // https://ciaaw.org/isotopic-abundances.htm
  U235: 0.7204, // https://ciaaw.org/isotopic-abundances.htm
  U238: 99.2742, // https://ciaaw.org/isotopic-abundances.htm
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

export const ISOTOPIC_ATOMIC_MASS = {
  // u -> kg
  K40: 39.963_998_165 * AU, // https://www-nds.iaea.org/amdc/ame2020/mass_1.mas20.txt
  TH232: 232.038_053_606 * AU, // https://www-nds.iaea.org/amdc/ame2020/mass_1.mas20.txt
  U235: 235.043_928_117 * AU, // https://www-nds.iaea.org/amdc/ame2020/mass_1.mas20.txt
  U238: 238.050_786_936 * AU, // https://www-nds.iaea.org/amdc/ame2020/mass_1.mas20.txt
};
