import { ELECTRON_REST_MASS, NEUTRON_REST_MASS, PROTON_REST_MASS, HBAR_C, FERMI_COUPLING_CONSTANT } from './constants'
import { memoize } from 'lodash';

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
export function crossSectionSV2003(Ev: number): number{
  const a = -0.07056;
  const b = 0.02018;
  const c = -0.001953;

  const sv = a + (b * Math.log(Ev)) + (c * Math.log(Ev) ** 3);
  const sve = Ev ** sv

  const Delta = NEUTRON_REST_MASS - PROTON_REST_MASS;

  const Ee = Math.max(ELECTRON_REST_MASS, Ev - Delta)
  const Pe = Math.sqrt(Ee ** 2 - ELECTRON_REST_MASS ** 2) // positron energy

  return 1e-43 * Pe * Ee * sve;
}

/**
 * Calculates the neutrino cross section, sometimes called sigma
 * Impliments P. Vogel, J.F. Beacom, Phys. Rev. D 60 (1999)
 * 
 * @param {number} Ev -  Energy of the neutrino in MeV
 * @returns {number} - Cross secton area in cm^2
 */
export function crossSectionVB1999(Ev: number): number{
  const Ee = Math.max(ELECTRON_REST_MASS, Ev - (NEUTRON_REST_MASS - PROTON_REST_MASS));

  return 9.52e-44 * Math.sqrt((Ee * Ee) - (ELECTRON_REST_MASS * ELECTRON_REST_MASS)) * Ee;
}


export function crossSectionElectronAntineutrinoES(Ev: number): number {
  const weakMixingAngle =  0.23122; // sin**2(Theta)

  //const prefactor = (fermiCouplingConstant ** 2 * ELECTRON_REST_MASS)/(6 * Math.PI);
  const prefactor = ((((FERMI_COUPLING_CONSTANT / 1e6) ** 2) * ELECTRON_REST_MASS) * HBAR_C ** 2) / (6 * Math.PI)

  const term1 = 1 + 4 * weakMixingAngle + 16 * weakMixingAngle ** 2;
  const term2 = (3 * weakMixingAngle * 6 * weakMixingAngle ** 2) * (ELECTRON_REST_MASS/Ev);

  return prefactor * Ev * (term1 - term2);

}

export function crossSectionMuTauAntineutrinoES(Ev: number): number {
  const weakMixingAngle =  0.23122; // sin**2(Theta)

  const prefactor = ((((FERMI_COUPLING_CONSTANT / 1e6) ** 2) * ELECTRON_REST_MASS) * HBAR_C ** 2) / (6 * Math.PI)

  const term1 = 1 - 4 * weakMixingAngle + 16 * weakMixingAngle ** 2;
  const term2 = (3 * weakMixingAngle * 6 * weakMixingAngle ** 2) * (ELECTRON_REST_MASS/Ev);

  return prefactor * Ev * (term1 - term2);

}