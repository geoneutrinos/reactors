import { ELECTRON_REST_MASS, NEUTRON_REST_MASS, PROTON_REST_MASS, HBAR_C, FERMI_COUPLING_CONSTANT, WEAK_MIXING_ANGLE } from './constants'
import { memoize } from 'lodash';

export interface CrossSection {
  (Ev: number): number
}

enum NeutrinoType {
  electronNeutrino,
  electronAntineutino,
  muTauAntineutrino
}

export enum XSNames {
  IBDVB1999 = "IBD: Vogel and Beacom (1999)",
  IBDSV2003 = "IBD: Strumia and Vissani (2003)",
  ESTOTAL = "Elastic Scattering: Antineutrino",
  ESANTI = "Elastic Scattering: Electron Antineutrino",
  ESMUTAU = "Elastic Scattering: Mu Tau Antineutrino",
}

export const XSAbrev: {[key in XSNames]: string} = {
  [XSNames.IBDVB1999]: "IBDvb99",
  [XSNames.IBDSV2003]: "IBDsv03",
  [XSNames.ESTOTAL]: "ESnubars",
  [XSNames.ESANTI]: "ESnuebar",
  [XSNames.ESMUTAU]: "ESnuxbar",
}

/** 
 * Calculates the neutrino cross section, sometimes called sigma
 * 
 * Impliments Equation 25 in Strumia, A., & Vissani, F. (2003). Precise quasielastic 
 * neutrino/nucleon cross-section. Physics Letters, Section B: Nuclear, Elementary 
 * Particle and High-Energy Physics, 564(1–2), 42–54. 
 * https://doi.org/10.1016/S0370-2693(03)00616-6
 * 
 * @param {number} Ev -  Energy of the neutrino in MeV
 * @returns {number} - Cross secton area in cm^2
 */
const crossSectionSV2003: CrossSection = memoize((Ev) => {
  const a = -0.07056;
  const b = 0.02018;
  const c = -0.001953;

  const sv = a + (b * Math.log(Ev)) + (c * Math.log(Ev) ** 3);
  const sve = Ev ** sv

  const Delta = NEUTRON_REST_MASS - PROTON_REST_MASS;

  const Ee = Math.max(ELECTRON_REST_MASS, Ev - Delta)
  const Pe = Math.sqrt(Ee ** 2 - ELECTRON_REST_MASS ** 2) // positron energy

  return 1e-43 * Pe * Ee * sve;
})

/**
 * Calculates the neutrino cross section, sometimes called sigma
 * Impliments P. Vogel, J.F. Beacom, Phys. Rev. D 60 (1999)
 * 
 * @param {number} Ev -  Energy of the neutrino in MeV
 * @returns {number} - Cross secton area in cm^2
 */
const crossSectionVB1999: CrossSection = memoize((Ev) => {
  const Ee = Math.max(ELECTRON_REST_MASS, Ev - (NEUTRON_REST_MASS - PROTON_REST_MASS));

  return 9.52e-44 * Math.sqrt((Ee * Ee) - (ELECTRON_REST_MASS * ELECTRON_REST_MASS)) * Ee;
})

function crossSectionElasticScattering(Ev: number, neutrinoType: NeutrinoType): number {
  // Table I
  const cL = {
    [NeutrinoType.electronNeutrino]: 0.5 + WEAK_MIXING_ANGLE,
    [NeutrinoType.electronAntineutino]: WEAK_MIXING_ANGLE,
    [NeutrinoType.muTauAntineutrino]: WEAK_MIXING_ANGLE,
  }[neutrinoType]
  const cR = {
    [NeutrinoType.electronNeutrino]: WEAK_MIXING_ANGLE,
    [NeutrinoType.electronAntineutino]: 0.5 + WEAK_MIXING_ANGLE,
    [NeutrinoType.muTauAntineutrino]: -0.5 + WEAK_MIXING_ANGLE,
  }[neutrinoType]

  const TEmax = Ev/(1 + ELECTRON_REST_MASS/(2 * Ev)); // Equation 9

  // The following impliments equation 11... it's big so there will be
  // 4 terms to make the equation the following: term1(term2 + term3 - term4)

  const y = TEmax / Ev;
  
  const FERMI_COUPLING_CONSTANT_MeV = FERMI_COUPLING_CONSTANT / 1e6

  const term1 = (2 * (FERMI_COUPLING_CONSTANT_MeV ** 2) * (HBAR_C ** 2)) * ELECTRON_REST_MASS * Ev / Math.PI;
  const term2 = cL ** 2 * y;
  const term3 = cR ** 2 * (1/3) * (1 - (1 - y) ** 3);
  const term4 = cL * cR * (ELECTRON_REST_MASS/(2 * Ev)) * y ** 2;

  return term1 * (term2 + term3 - term4);

}

const crossSectionElectronAntineutrinoES: CrossSection = memoize((Ev) => {
  return crossSectionElasticScattering(Ev, NeutrinoType.electronAntineutino)
})

const crossSectionMuTauAntineutrinoES: CrossSection = memoize((Ev) => {
  return crossSectionElasticScattering(Ev, NeutrinoType.muTauAntineutrino)
})

const crossSectionTotalES: CrossSection = memoize((Ev) => {
  return  crossSectionElectronAntineutrinoES(Ev) + crossSectionMuTauAntineutrinoES(Ev)
})

export const crossSectionElectronAntineutrinoFractionES = memoize((Ev) => {
  return crossSectionElectronAntineutrinoES(Ev) / crossSectionTotalES(Ev);
})

export const XSFuncs: {[key in XSNames]: CrossSection} = {
  [XSNames.IBDVB1999]: crossSectionVB1999,
  [XSNames.IBDSV2003]: crossSectionSV2003,
  [XSNames.ESANTI]: crossSectionElectronAntineutrinoES,
  [XSNames.ESMUTAU]: crossSectionMuTauAntineutrinoES,
  [XSNames.ESTOTAL]: crossSectionTotalES,
}