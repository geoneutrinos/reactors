import { ELECTRON_REST_MASS, HBAR_C, FERMI_COUPLING_CONSTANT, WEAK_MIXING_ANGLE, PROTON_REST_MASS, NEUTRON_REST_MASS } from './constants'
import {IBD_THRESHOLD} from "./derived"
import { memoize } from 'lodash';

export interface CrossSectionFunc {
  (Ev: number): number
}

export enum NeutrinoTarget {
  electron,
  proton,
  neutron,
  nucleus
}

export enum NeutrinoType {
  electronNeutrino,
  muTauNeutrino,
  electronAntineutrino,
  muTauAntineutrino
}

export enum XSNames {
  IBDVB1999 = "pIBD: Vogel and Beacom (1999)",
  IBDSV2003 = "pIBD: Strumia and Vissani (2003)",
  ESTOTAL = "eES: Antineutrino",
  ESANTI = "eES: Electron Antineutrino",
  ESMUTAU = "eES: Mu Tau Antineutrino",
}

export enum XSNamesNormal {
  ESNORMAL = "eES: Electron Neutrino",
  ESMUTAUNORM = "eES: Mu Tau Neutrino"
}

export const XSAbrev: {[key in XSNames | XSNamesNormal]: string} = {
  [XSNames.IBDVB1999]: "pIBDvb99",
  [XSNames.IBDSV2003]: "pIBDsv03",
  [XSNames.ESTOTAL]: "eESnubars",
  [XSNames.ESANTI]: "eESnuebar",
  [XSNames.ESMUTAU]: "eESnuxbar",
  [XSNamesNormal.ESNORMAL]: "eESnue",
  [XSNamesNormal.ESMUTAUNORM]: "eESnux",
}

export const ES_TARGET_MASSES = {
  [NeutrinoTarget.electron]: ELECTRON_REST_MASS,
  [NeutrinoTarget.proton]: PROTON_REST_MASS,
  [NeutrinoTarget.neutron]: NEUTRON_REST_MASS,
  [NeutrinoTarget.nucleus]: 0  // needs other input
}

export const ES_COEFFICIENTS_VECTOR = {
  [NeutrinoType.electronNeutrino]: 0.5 + 2 * WEAK_MIXING_ANGLE,
  [NeutrinoType.muTauNeutrino]: -0.5 + 2 * WEAK_MIXING_ANGLE,
  [NeutrinoType.electronAntineutrino]: 0.5 + 2 * WEAK_MIXING_ANGLE,
  [NeutrinoType.muTauAntineutrino]: -0.5 + 2 * WEAK_MIXING_ANGLE,
}
export const ES_COEFFICIENTS_AXIAL = {
  [NeutrinoType.electronNeutrino]: 0.5,
  [NeutrinoType.muTauNeutrino]: -0.5,
  [NeutrinoType.electronAntineutrino]: -0.5,
  [NeutrinoType.muTauAntineutrino]: 0.5,
}
export const PS_COEFFICIENTS_AXIAL = {
  [NeutrinoType.electronNeutrino]: 1.27 / 2,
  [NeutrinoType.muTauNeutrino]: 1.27 / 2,
  [NeutrinoType.electronAntineutrino]: -1.27 / 2,
  [NeutrinoType.muTauAntineutrino]: -1.27 / 2,
}
const _PS_COEFFICIENTS_VECTOR = 0.5 - 2 * WEAK_MIXING_ANGLE

export const PS_COEFFICIENTS_VECTOR = {
  [NeutrinoType.electronNeutrino]: _PS_COEFFICIENTS_VECTOR,
  [NeutrinoType.muTauNeutrino]: _PS_COEFFICIENTS_VECTOR,
  [NeutrinoType.electronAntineutrino]: _PS_COEFFICIENTS_VECTOR,
  [NeutrinoType.muTauAntineutrino]: _PS_COEFFICIENTS_VECTOR,
}
export const NEUTRON_COEFFICIENTS_VECTOR = -0.5


/** 
 * Calculates the neutrino cross section, sometimes called sigma
 * 
 * Implements Equation 25 in Strumia, A., & Vissani, F. (2003). Precise quasielastic 
 * neutrino/nucleon cross-section. Physics Letters, Section B: Nuclear, Elementary 
 * Particle and High-Energy Physics, 564(1–2), 42–54. 
 * https://doi.org/10.1016/S0370-2693(03)00616-6
 * 
 * @param {number} Ev -  Energy of the antineutrino in MeV
 * @returns {number} - Cross section in cm^2
 */
/** January 16, 2021
 * Corrected the expression for the electron energy Ee
*/
export const crossSectionSV2003: CrossSectionFunc = memoize((Ev) => {
  const a = -0.07056;
  const b = 0.02018;
  const c = -0.001953;

  const sv = a + (b * Math.log(Ev)) + (c * Math.log(Ev) ** 3);
  const sve = Ev ** sv

//  const Delta = NEUTRON_REST_MASS - PROTON_REST_MASS;

//  const Ee = Math.max(ELECTRON_REST_MASS, Ev - Delta)
  
  const Ee = Math.max(ELECTRON_REST_MASS, Ev - IBD_THRESHOLD + ELECTRON_REST_MASS)
  
  const Pe = Math.sqrt(Ee ** 2 - ELECTRON_REST_MASS ** 2) // electron momentum

  return 1e-43 * Pe * Ee * sve;
})

/**
 * Calculates the neutrino cross section, sometimes called sigma
 * Impliments P. Vogel, J.F. Beacom, Phys. Rev. D 60 (1999)
 * 
 * @param {number} Ev -  Energy of the antineutrino in MeV
 * @returns {number} - Cross section in cm^2
 */
/** January 16, 2021
 * Corrected the expression for the electron energy Ee
*/
export const crossSectionVB1999: CrossSectionFunc = memoize((Ev) => {
  const Ee = Math.max(ELECTRON_REST_MASS, Ev - IBD_THRESHOLD + ELECTRON_REST_MASS)
  //  const Ee = Math.max(ELECTRON_REST_MASS, Ev - (NEUTRON_REST_MASS - PROTON_REST_MASS));

  return 9.52e-44 * Math.sqrt((Ee * Ee) - (ELECTRON_REST_MASS * ELECTRON_REST_MASS)) * Ee;
})

/**
 * Calculates the electron kenetic energy as a function of neutrino energy and scattering angle
 * 
 * Implements equation 6
 * @param Ev - Neutrino energy in MeV
 * @param cosT  - Scattering angle in terms of cos theta (1 is straight)
 */
function TeFromEvCos(Ev:number, cosT:number): number{
  const num = 2 * ELECTRON_REST_MASS * cosT ** 2;
  const dem = (1 + ELECTRON_REST_MASS/Ev) ** 2 - cosT **2;
  return num/dem
}

function differentialTeFromEvCos(Ev: number, cosT:number): number{
  const num = 4 * ELECTRON_REST_MASS * Ev ** 2 * (Ev + ELECTRON_REST_MASS) ** 2 * cosT;
  const dem = ((Ev + ELECTRON_REST_MASS) ** 2 - Ev ** 2 * cosT **2) ** 2
  return num/dem;
}

export function TEMax(Ev: number, targetMass:number = ELECTRON_REST_MASS): number{
  return Ev/(1 + targetMass/(2 * Ev)) 
}

export function differentialCrossSectionElasticScattering(Ev: number, Te:number, neutrinoType:NeutrinoType): number{
  const cL = ES_COEFFICIENTS_VECTOR[neutrinoType] + ES_COEFFICIENTS_AXIAL[neutrinoType]
  const cR = ES_COEFFICIENTS_VECTOR[neutrinoType] - ES_COEFFICIENTS_AXIAL[neutrinoType]

  // The following impliments equation 11... it's big so there will be
  // 4 terms to make the equation the following: term1(term2 + term3 - term4)

  const FERMI_COUPLING_CONSTANT_MeV = FERMI_COUPLING_CONSTANT / 1e6

  const term1 = ((FERMI_COUPLING_CONSTANT_MeV ** 2) * (HBAR_C ** 2)) * ELECTRON_REST_MASS / (2 * Math.PI);
  const term2 = cL ** 2;
  const term3 = cR ** 2 * (1 - Te/Ev) ** 2;
  const term4 = cL * cR * (ELECTRON_REST_MASS * Te)/(Ev ** 2);

  return term1 * (term2 + term3 - term4);
}

export function differentialCrossSectionElasticScatteringAngular(Ev: number, cosT: number, neutrinoType:NeutrinoType): number{
  const Te = TeFromEvCos(Ev, cosT);
  const diffXs = differentialCrossSectionElasticScattering(Ev, Te, neutrinoType)
  const diffTe = differentialTeFromEvCos(Ev, cosT)
  return diffXs * diffTe;
}

export function crossSectionElasticScattering(
  Ev: number,
  neutrinoType: NeutrinoType,
  T_min: number = 0,
  Tmax?: number,
  target: NeutrinoTarget = NeutrinoTarget.electron,
  targetMass: number = 0,
  protonTargets: number = 0,
  neutronTargets: number = 0,
): number {
  let cL = 0;
  let cR = 0;
  switch (target) {
    case NeutrinoTarget.electron:
      cL =
        ES_COEFFICIENTS_VECTOR[neutrinoType] +
        ES_COEFFICIENTS_AXIAL[neutrinoType];
      cR =
        ES_COEFFICIENTS_VECTOR[neutrinoType] -
        ES_COEFFICIENTS_AXIAL[neutrinoType];
      break;
    case NeutrinoTarget.neutron:
    case NeutrinoTarget.nucleus: // CEvNS
      // assuming electro-weak parameters =1 and ignoring radiative corrections
      // assuming no axial-vector contributions- equal numbers of up and down protons and neutrons
      cL = PS_COEFFICIENTS_VECTOR[neutrinoType] * protonTargets + NEUTRON_COEFFICIENTS_VECTOR * neutronTargets;
      cR = cL;
      break;
    case NeutrinoTarget.proton:
    default:
      cL = PS_COEFFICIENTS_VECTOR[neutrinoType] + PS_COEFFICIENTS_AXIAL[neutrinoType];
      cR = PS_COEFFICIENTS_VECTOR[neutrinoType] - PS_COEFFICIENTS_AXIAL[neutrinoType];
  }

  const tMass = targetMass > 0 ? targetMass : ES_TARGET_MASSES[target];

  // The following implements equation 13... it's big so there will be
  // 4 terms to make the equation the following: term1(term2 + term3 - term4)
  const T_max =
    Tmax !== undefined && Tmax < TEMax(Ev, tMass) ? Tmax : TEMax(Ev, tMass);
  if (T_max < T_min) {
    return 0;
  }

  const y_max = T_max / Ev;
  const y_min = T_min / Ev;

  const FERMI_COUPLING_CONSTANT_MeV = FERMI_COUPLING_CONSTANT / 1e6;

  const term1 =
    (FERMI_COUPLING_CONSTANT_MeV ** 2 * HBAR_C ** 2 * tMass * Ev) /
    (2 * Math.PI);
  const term2 = cL ** 2 * y_max;
  const term3 = cR ** 2 * (1 / 3) * (1 - (1 - y_max) ** 3);
  const term4 = cL * cR * (tMass / (2 * Ev)) * y_max ** 2;

  const term5 = cL ** 2 * y_min;
  const term6 = cR ** 2 * (1 / 3) * (1 - (1 - y_min) ** 3);
  const term7 = cL * cR * (tMass / (2 * Ev)) * y_min ** 2;

  return term1 * (term2 + term3 - term4 - (term5 + term6 - term7));
}

const crossSectionElectronAntineutrinoES: CrossSectionFunc = memoize((Ev) => {
  return crossSectionElasticScattering(Ev, NeutrinoType.electronAntineutrino)
})

const crossSectionMuTauAntineutrinoES: CrossSectionFunc = memoize((Ev) => {
  return crossSectionElasticScattering(Ev, NeutrinoType.muTauAntineutrino)
})

const crossSectionTotalES: CrossSectionFunc = memoize((Ev) => {
  return  crossSectionElectronAntineutrinoES(Ev) + crossSectionMuTauAntineutrinoES(Ev)
})

export const crossSectionElectronNeutrinoES: CrossSectionFunc = memoize((Ev) => {
  return crossSectionElasticScattering(Ev, NeutrinoType.electronNeutrino) 
})

export const crossSectionMuTauNeutrinoES: CrossSectionFunc = memoize((Ev) => {
  return crossSectionElasticScattering(Ev, NeutrinoType.muTauNeutrino) 
})

export const XSFuncs: {[key in XSNames | XSNamesNormal]: CrossSectionFunc} = {
  [XSNames.IBDVB1999]: crossSectionVB1999,
  [XSNames.IBDSV2003]: crossSectionSV2003,
  [XSNames.ESANTI]: crossSectionElectronAntineutrinoES,
  [XSNames.ESMUTAU]: crossSectionMuTauAntineutrinoES,
  [XSNames.ESTOTAL]: crossSectionTotalES,
  [XSNamesNormal.ESNORMAL]: crossSectionElectronNeutrinoES,
  [XSNamesNormal.ESMUTAUNORM]: crossSectionMuTauNeutrinoES
}

interface CrossSectionConfig {
  elasticScatteringTMin: number
  elasticScatteringTMax: number
  crossSection: XSNames // the current in use cross section function
}
interface CrossSectionFunctions {
  crossSectionElectronAntineutrinoFractionES: CrossSectionFunc,
  crossSectionFunction: CrossSectionFunc
}

export type CrossSection = CrossSectionConfig & CrossSectionFunctions & typeof XSFuncs

interface CrossSectionAction {
  arg: "elasticScatteringTMin" | "crossSection" | "elasticScatteringTMax",
  value: number | XSNames
}

const defaultCrossSection: CrossSection = {
  ...XSFuncs,
  elasticScatteringTMin: 0,
  elasticScatteringTMax: 15.3,
  crossSection: XSNames.IBDSV2003,
  crossSectionFunction: XSFuncs[XSNames.IBDSV2003],
  crossSectionElectronAntineutrinoFractionES: (_Ev) => 0,
}

export const crossSectionReducer = (state: CrossSection, action: CrossSectionAction): CrossSection => {
  const crossSection = {...state}
  switch (action.arg){
    case "crossSection":
      {
        let xs = action.value as XSNames
        crossSection.crossSection = xs
      }
      break;
    case "elasticScatteringTMin":
    case "elasticScatteringTMax":
      {
        let TMin = action.arg === "elasticScatteringTMin"? action.value as number : crossSection.elasticScatteringTMin;
        let TMax = action.arg === "elasticScatteringTMax"? action.value as number : crossSection.elasticScatteringTMax;
        crossSection.elasticScatteringTMin = TMin;
        crossSection.elasticScatteringTMax = TMax;
        crossSection[XSNames.ESANTI] = memoize((Ev) => crossSectionElasticScattering(Ev, NeutrinoType.electronAntineutrino, TMin, TMax));
        crossSection[XSNames.ESMUTAU] = memoize((Ev) => crossSectionElasticScattering(Ev, NeutrinoType.muTauAntineutrino, TMin, TMax));
        crossSection[XSNames.ESTOTAL] = memoize((Ev) => crossSection[XSNames.ESANTI](Ev) + crossSection[XSNames.ESMUTAU](Ev))
        crossSection[XSNamesNormal.ESNORMAL] = memoize((Ev) => crossSectionElasticScattering(Ev, NeutrinoType.electronNeutrino, TMin, TMax));
        crossSection[XSNamesNormal.ESMUTAUNORM] = memoize((Ev) => crossSectionElasticScattering(Ev, NeutrinoType.muTauNeutrino, TMin, TMax));
        crossSection.crossSectionElectronAntineutrinoFractionES = memoize((Ev) => {
          let electronES = crossSection[XSNames.ESANTI](Ev)
          let totalES = crossSection[XSNames.ESTOTAL](Ev);
          return totalES === 0 ? 0 : electronES / totalES;
        })
      }
      break;
  }
  crossSection.crossSectionFunction = crossSection[crossSection.crossSection]
  return crossSection
}

export const crossSection = crossSectionReducer(defaultCrossSection, {arg:"elasticScatteringTMin", value:0})
