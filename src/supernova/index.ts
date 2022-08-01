import { 
  ELEMENTARY_CHARGE,
  ELECTRON_REST_MASS,
  PROTON_REST_MASS,
  FERMI_COUPLING_CONSTANT,
  HBAR_C,
  WEAK_MIXING_ANGLE,
  ATOMIC_MASS_UNIT,
  AVOGADRO_CONSTANT,
} from "../physics/constants";

import { 
  NeutrinoType,
  PS_COEFFICIENTS_AXIAL,
  PS_COEFFICIENTS_VECTOR,
  ES_COEFFICIENTS_AXIAL,
  ES_COEFFICIENTS_VECTOR,
  CEvNS_PROTON_VECTOR,
  CEvNS_NEUTRON_VECTOR,
} from "../physics/neutrino-cross-section";

import { IBD_THRESHOLD } from "../physics/derived";
import { s2t12, c2t12 } from "../physics/neutrino-oscillation";

import { sum } from "lodash";

import Elements from "../elements";

const {Ar40, Ge74, I127, Xe132, Cs133} = Elements

const neutrinoTargets = 1e32; // for IBD, eES, pES

// ToDo make UI to select CEvNS target
// temporary 132Xe CEvNS
const molarMass132Xe = 131.9041550856; // g/mole
const xenonTargets = AVOGADRO_CONSTANT * 1e6 / molarMass132Xe; // 1e6 g or 1000 kg
const zTarget = 54;
const nTarget = 78;
const massTarget = molarMass132Xe * ATOMIC_MASS_UNIT; //MeV

const energyBins = 10000;
const maximumEnergy = 100;
const deltaEnergy = maximumEnergy / energyBins; // MeV
const preFactor = 2 * ( FERMI_COUPLING_CONSTANT * HBAR_C / 1e6 ) ** 2 / Math.PI;

// ToDo import elastic scattering Tmins set by UI
const tESeMin = 0;
const tESpMin = 0;
const tCEvNSMin = 0;

// make the array of neutrino energies 0 - 100 MeV
export const energyValues = new Float64Array(energyBins).map((v, i) => i * deltaEnergy + deltaEnergy/2);

// make the non-oscillated neutrino speciaes flux spectra with different average energy in MeV
export const fluxSpectrumNue = energyValues.map(
  function(x) { return neutrinoSpectrumCCSN(x, 12); }
);
export const fluxSpectrumAnu = energyValues.map(
  function(x) { return neutrinoSpectrumCCSN(x, 15); }
);
export const fluxSpectrumNux = energyValues.map(
  function(x) { return neutrinoSpectrumCCSN(x, 18); }
);

// electron neutrinos
export const fluxNOSpectrumNue = fluxSpectrumNux.map((v) => v);

const fluxIOSpectrumNueT1 = fluxSpectrumNue.map((v) => v * s2t12);
const fluxIOSpectrumNueT2 = fluxSpectrumNux.map((v) => v * c2t12);
export const fluxIOSpectrumNue = fluxIOSpectrumNueT1.map((v, i) => v + fluxIOSpectrumNueT2[i]); 

// electron anti-neutrinos
const fluxNOSpectrumAnuT1 = fluxSpectrumAnu.map((v) => v * c2t12);
const fluxNOSpectrumAnuT2 = fluxSpectrumNux.map((v) => v * s2t12);
export const fluxNOSpectrumAnu = fluxNOSpectrumAnuT1.map((v, i) => v + fluxNOSpectrumAnuT2[i]); 

export const fluxIOSpectrumAnu = fluxSpectrumNux.map((v) => v);

// mu or tau neutrinos and antineutrinos
const fluxNOSpectrumNuxT1 = fluxSpectrumNux.map((v) => v * (2 + c2t12));
const fluxNOSpectrumNuxT2 = fluxSpectrumNue.map((v) => v);
const fluxNOSpectrumNuxT3 = fluxSpectrumAnu.map((v) => v * s2t12);
const fluxNOSpectrumNuxT123 = fluxNOSpectrumNuxT1.map((v, i) => v + fluxNOSpectrumNuxT2[i] + fluxNOSpectrumNuxT3[i]);
export const fluxNOSpectrumNux = fluxNOSpectrumNuxT123.map((v) => v / 4);

const fluxIOSpectrumNuxT1 = fluxSpectrumNux.map((v) => v * (2 + s2t12));
const fluxIOSpectrumNuxT2 = fluxSpectrumAnu.map((v) => v);
const fluxIOSpectrumNuxT3 = fluxSpectrumNue.map((v) => v * c2t12);
const fluxIOSpectrumNuxT123 = fluxIOSpectrumNuxT1.map((v, i) => v + fluxIOSpectrumNuxT2[i] + fluxIOSpectrumNuxT3[i]);
export const fluxIOSpectrumNux = fluxIOSpectrumNuxT123.map((v) => v / 4);

// IBD cross section using SV 2003
const xsectionIBD = energyValues.map(xSectionIBD);

// IBD event spectra (/MeV)
export const eventSpectrumIBDnoOsc = fluxSpectrumAnu.map((v, i) => v * xsectionIBD[i] * neutrinoTargets);
export const eventSpectrumIBDforNO = fluxNOSpectrumAnu.map((v, i) => v * xsectionIBD[i] * neutrinoTargets);
export const eventSpectrumIBDforIO = fluxIOSpectrumAnu.map((v, i) => v * xsectionIBD[i] * neutrinoTargets);

// IBD event totals
export const sumSpectrumIBDnoOsc = sum(eventSpectrumIBDnoOsc) * deltaEnergy;
export const sumSpectrumIBDforNO = sum(eventSpectrumIBDforNO) * deltaEnergy;
export const sumSpectrumIBDforIO = sum(eventSpectrumIBDforIO) * deltaEnergy;

// make neutrino-proton elastic scattering (pES) cross section
const xsectionESpNue = energyValues.map(
  function(x) { return xSectionESp(x, NeutrinoType.electronNeutrino); }
);
const xsectionESpAnu = energyValues.map(
  function(x) { return xSectionESp(x, NeutrinoType.electronAntineutrino); }
);
const xsectionESpNux = energyValues.map(
  function(x) { return xSectionESp(x, NeutrinoType.muTauNeutrino); }
);
const xsectionESpAnx = energyValues.map(
  function(x) { return xSectionESp(x, NeutrinoType.muTauAntineutrino); }
);

// pES event sprecta (/MeV)
export const eventSpectrumNueESP = fluxSpectrumNue.map((v, i) => v * xsectionESpNue[i] * neutrinoTargets);
export const eventSpectrumAnuESP = fluxSpectrumAnu.map((v, i) => v * xsectionESpAnu[i] * neutrinoTargets);
export const eventSpectrumNuxESP = fluxSpectrumNux.map((v, i) => v * xsectionESpNux[i] * neutrinoTargets);
export const eventSpectrumAnxESP = fluxSpectrumNux.map((v, i) => v * xsectionESpAnx[i] * neutrinoTargets);

// pES event totals with Nux x4 for mu and tau neutrinos and antineutrinos
export const sumSpectrumNueESP = sum(eventSpectrumNueESP) * deltaEnergy;
export const sumSpectrumAnuESP = sum(eventSpectrumAnuESP) * deltaEnergy;
export const sumSpectrumNuxESP = sum(eventSpectrumNuxESP) * deltaEnergy * 2;
export const sumSpectrumAnxESP = sum(eventSpectrumAnxESP) * deltaEnergy * 2;

// make neutrino-electron elastic scattering (eES) cross section 
export const xsectionESeNue = energyValues.map(
  function(x) { return xSectionESe(x, NeutrinoType.electronNeutrino); }
);
export const eventSpectrumNueESEforNO = fluxNOSpectrumNue.map((v, i) => v * xsectionESeNue[i] * neutrinoTargets);
export const sumSpectrumNueESEforNO = sum(eventSpectrumNueESEforNO) * deltaEnergy;
export const eventSpectrumNueESEforIO = fluxIOSpectrumNue.map((v, i) => v * xsectionESeNue[i] * neutrinoTargets);
export const sumSpectrumNueESEforIO = sum(eventSpectrumNueESEforIO) * deltaEnergy;

export const xsectionESeAnu = energyValues.map(
  function(x) { return xSectionESe(x, NeutrinoType.electronAntineutrino); }
);
export const eventSpectrumAnuESEforNO = fluxNOSpectrumAnu.map((v, i) => v * xsectionESeAnu[i] * neutrinoTargets);
export const sumSpectrumAnuESEforNO = sum(eventSpectrumAnuESEforNO) * deltaEnergy;
export const eventSpectrumAnuESEforIO = fluxIOSpectrumAnu.map((v, i) => v * xsectionESeAnu[i] * neutrinoTargets);
export const sumSpectrumAnuESEforIO = sum(eventSpectrumAnuESEforIO) * deltaEnergy;

// x2 for mu and tau
export const xsectionESeNux = energyValues.map(
  function(x) { return xSectionESe(x, NeutrinoType.muTauNeutrino); }
);
export const eventSpectrumNuxESEforNO = fluxNOSpectrumNux.map((v, i) => v * xsectionESeNux[i] * neutrinoTargets);
export const sumSpectrumNuxESEforNO = sum(eventSpectrumNuxESEforNO) * deltaEnergy * 2;
export const eventSpectrumNuxESEforIO = fluxIOSpectrumNux.map((v, i) => v * xsectionESeNux[i] * neutrinoTargets);
export const sumSpectrumNuxESEforIO = sum(eventSpectrumNuxESEforIO) * deltaEnergy * 2;

// x2 for mu and tau
export const xsectionESeAnx = energyValues.map(
  function(x) { return xSectionESe(x, NeutrinoType.muTauAntineutrino); }
);
export const eventSpectrumAnxESEforNO = fluxNOSpectrumNux.map((v, i) => v * xsectionESeAnx[i] * neutrinoTargets);
export const sumSpectrumAnxESEforNO = sum(eventSpectrumAnxESEforNO) * deltaEnergy * 2;
export const eventSpectrumAnxESEforIO = fluxIOSpectrumNux.map((v, i) => v * xsectionESeAnx[i] * neutrinoTargets);
export const sumSpectrumAnxESEforIO = sum(eventSpectrumAnxESEforIO) * deltaEnergy * 2;

const xsectionCEvNS = energyValues.map(xSectionCEvNS);
const eventSpectrumNueCEvNS = fluxSpectrumNue.map((v, i) => v * xsectionCEvNS[i] * xenonTargets);
export const sumSpectrumNueCEvNS = sum(eventSpectrumNueCEvNS) * deltaEnergy;
const eventSpectrumAnuCEvNS = fluxSpectrumAnu.map((v, i) => v * xsectionCEvNS[i] * xenonTargets);
export const sumSpectrumAnuCEvNS = sum(eventSpectrumAnuCEvNS) * deltaEnergy;
const eventSpectrumNuxCEvNS = fluxSpectrumNux.map((v, i) => v * xsectionCEvNS[i] * xenonTargets);
export const sumSpectrumNuxCEvNS = sum(eventSpectrumNuxCEvNS) * deltaEnergy * 4;

function neutrinoSpectrumCCSN(Ev: number, Ev_avg: number) {
  const enu_tot = 5e52 * 1e-13 / ELEMENTARY_CHARGE; // MeV
  const d_ccsn = 10 * 3.086e21; // cm
  const beta = 4;

  const prefix = (beta ** beta) / ( 4 * Math.PI * 6 * Ev_avg * Ev_avg );

  const energy_factor = ( ( Ev / Ev_avg ) ** (beta - 1) ) * Math.exp(-beta * Ev / Ev_avg);

  return prefix * enu_tot * energy_factor / d_ccsn / d_ccsn;
}

function xSectionIBD(Ev: number) {
  const a = -0.07056;
  const b = 0.02018;
  const c = -0.001953;

  const sv = a + (b * Math.log(Ev)) + (c * Math.log(Ev) ** 3);
  const sve = Ev ** sv;
  
  const Ee = Math.max(ELECTRON_REST_MASS, Ev - IBD_THRESHOLD + ELECTRON_REST_MASS);
  
  const Pe = Math.sqrt(Ee ** 2 - ELECTRON_REST_MASS ** 2);

  return 1e-43 * Pe * Ee * sve;
}

function xSectionESp(Ev: number, neutrinoType:NeutrinoType) {

  const cVec = PS_COEFFICIENTS_VECTOR[neutrinoType]
  const cAxi = PS_COEFFICIENTS_AXIAL[neutrinoType]

  const cL = ( cVec + cAxi ) / 2;
  const cR = ( cVec - cAxi ) / 2;

  const tESpMax = Ev / (1 + PROTON_REST_MASS / (2 * Ev));
  
  if (tESpMax < tESpMin) {
    return 0;
  }

  const y_max = tESpMax / Ev;
  const y_min = tESpMin / Ev;

  const term1 = preFactor * PROTON_REST_MASS * Ev;
  const term2 = cL ** 2 * y_max;
  const term3 = cR ** 2 * (1/3) * (1 - (1 - y_max) ** 3);
  const term4 = cL * cR * (PROTON_REST_MASS/(2 * Ev)) * y_max ** 2;

  const term5 = cL ** 2 * y_min;
  const term6 = cR ** 2 * (1/3) * (1 - (1 - y_min) ** 3);
  const term7 = cL * cR * (PROTON_REST_MASS/(2 * Ev)) * y_min ** 2;

  return term1 * ((term2 + term3 - term4) - (term5 + term6 - term7));
}

function xSectionESe(Ev: number, neutrinoType:NeutrinoType) {

  const cVec = ES_COEFFICIENTS_VECTOR[neutrinoType]
  const cAxi = ES_COEFFICIENTS_AXIAL[neutrinoType]

  const cL = ( cVec + cAxi ) / 2;
  const cR = ( cVec - cAxi ) / 2;

  const tESeMax = Ev / (1 + ELECTRON_REST_MASS / (2 * Ev));
  if (tESeMax < tESeMin){
    return 0;
  }

  const y_max = tESeMax / Ev;
  const y_min = tESeMin / Ev;
  
  const term1 = preFactor * ELECTRON_REST_MASS * Ev;
  const term2 = cL ** 2 * y_max;
  const term3 = cR ** 2 * (1/3) * (1 - (1 - y_max) ** 3);
  const term4 = cL * cR * (ELECTRON_REST_MASS/(2 * Ev)) * y_max ** 2;

  const term5 = cL ** 2 * y_min;
  const term6 = cR ** 2 * (1/3) * (1 - (1 - y_min) ** 3);
  const term7 = cL * cR * (ELECTRON_REST_MASS/(2 * Ev)) * y_min ** 2;

  return term1 * ((term2 + term3 - term4) - (term5 + term6 - term7));
}

function xSectionCEvNS(Ev: number) {

// assuming electro-weak parameters =1 and ignoring radiative corrections
// assuming no axial-vector contributions- equal numbers of up and down protons and neutrons 
  const factor = (preFactor / 4) * massTarget * Ev * (CEvNS_PROTON_VECTOR * zTarget + CEvNS_NEUTRON_VECTOR * nTarget) ** 2;

  const tCEvNSMax = Ev / (1 + massTarget / (2 * Ev));
  if (tCEvNSMax < tCEvNSMin){
    return 0;
  }

  const y_max = tCEvNSMax / Ev;
  const y_min = tCEvNSMin / Ev;
  
  const term1 = (1/3) * (1 - (1 - y_max) ** 3);
  const term2 = (massTarget/(2 * Ev)) * y_max ** 2;

  const term3 = (1/3) * (1 - (1 - y_min) ** 3);
  const term4 = (massTarget/(2 * Ev)) * y_min ** 2;

  return factor * ((y_max + term1 - term2) - (y_min + term3 - term4));
}

