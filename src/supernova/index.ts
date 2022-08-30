import {
  ELEMENTARY_CHARGE,
  ELECTRON_REST_MASS,
  FERMI_COUPLING_CONSTANT,
  HBAR_C,
  ATOMIC_MASS_UNIT,
  AVOGADRO_CONSTANT,
} from "../physics/constants";

import {
  NeutrinoType,
  CEvNS_PROTON_VECTOR,
  CEvNS_NEUTRON_VECTOR,
  crossSectionElasticScattering,
  NeutrinoTarget,
  crossSectionSV2003,
} from "../physics/neutrino-cross-section";

import { IBD_THRESHOLD } from "../physics/derived";
import { s2t12, c2t12 } from "../physics/neutrino-oscillation";

import { sum, zip } from "lodash";

import { Element } from "../elements";

const neutrinoTargets = 1e32; // for IBD, eES, pES

interface CEvNSTarget {
  molarMass: number;
  nuclearTargets: number;
  protonTargets: number;
  neutronTargets: number;
  targetMass: number;
}

export const getTargetParamsCEvNS = (element: Element): CEvNSTarget => {
  return {
    molarMass: element.relative_atomic_mass,
    nuclearTargets: (AVOGADRO_CONSTANT * 1e6) / element.relative_atomic_mass,
    protonTargets: element.atomic_number,
    neutronTargets: element.mass_number - element.atomic_number,
    targetMass: element.relative_atomic_mass * ATOMIC_MASS_UNIT,
  };
};

const energyBins = 10000;
const maximumEnergy = 100;
const deltaEnergy = maximumEnergy / energyBins; // MeV

// ToDo import elastic scattering Tmins set by UI
const tESeMin = 0;
const tESpMin = 0;
const tCEvNSMin = 0;

// make the array of neutrino energies 0 - 100 MeV
export const energyValues = new Float64Array(energyBins).map(
  (v, i) => i * deltaEnergy + deltaEnergy / 2
);

// make the non-oscillated neutrino speciaes flux spectra with different average energy in MeV
// TODO import average neutrino energies set by UI
const avgNrgNue = 12;
const avgNrgAnu = 15;
const avgNrgNux = 18;

export const fluxSpectrumNue = energyValues.map(function (x) {
  return neutrinoSpectrumCCSN(x, avgNrgNue);
});
export const fluxSpectrumAnu = energyValues.map(function (x) {
  return neutrinoSpectrumCCSN(x, avgNrgAnu);
});
export const fluxSpectrumNux = energyValues.map(function (x) {
  return neutrinoSpectrumCCSN(x, avgNrgNux);
});

// electron neutrinos
export const fluxNOSpectrumNue = fluxSpectrumNux.map((v) => v);

const fluxIOSpectrumNueT1 = fluxSpectrumNue.map((v) => v * s2t12);
const fluxIOSpectrumNueT2 = fluxSpectrumNux.map((v) => v * c2t12);
export const fluxIOSpectrumNue = fluxIOSpectrumNueT1.map(
  (v, i) => v + fluxIOSpectrumNueT2[i]
);

// electron anti-neutrinos
const fluxNOSpectrumAnuT1 = fluxSpectrumAnu.map((v) => v * c2t12);
const fluxNOSpectrumAnuT2 = fluxSpectrumNux.map((v) => v * s2t12);
export const fluxNOSpectrumAnu = fluxNOSpectrumAnuT1.map(
  (v, i) => v + fluxNOSpectrumAnuT2[i]
);

export const fluxIOSpectrumAnu = fluxSpectrumNux.map((v) => v);

// mu or tau neutrinos and antineutrinos
const fluxNOSpectrumNuxT1 = fluxSpectrumNux.map((v) => v * (2 + c2t12));
const fluxNOSpectrumNuxT2 = fluxSpectrumNue.map((v) => v);
const fluxNOSpectrumNuxT3 = fluxSpectrumAnu.map((v) => v * s2t12);
const fluxNOSpectrumNuxT123 = fluxNOSpectrumNuxT1.map(
  (v, i) => v + fluxNOSpectrumNuxT2[i] + fluxNOSpectrumNuxT3[i]
);
export const fluxNOSpectrumNux = fluxNOSpectrumNuxT123.map((v) => v / 4);

const fluxIOSpectrumNuxT1 = fluxSpectrumNux.map((v) => v * (2 + s2t12));
const fluxIOSpectrumNuxT2 = fluxSpectrumAnu.map((v) => v);
const fluxIOSpectrumNuxT3 = fluxSpectrumNue.map((v) => v * c2t12);
const fluxIOSpectrumNuxT123 = fluxIOSpectrumNuxT1.map(
  (v, i) => v + fluxIOSpectrumNuxT2[i] + fluxIOSpectrumNuxT3[i]
);
export const fluxIOSpectrumNux = fluxIOSpectrumNuxT123.map((v) => v / 4);

// IBD cross section using SV 2003
const xsectionIBD = energyValues.map(crossSectionSV2003);

// IBD event spectra (/MeV)
export const eventSpectrumIBDnoOsc = fluxSpectrumAnu.map(
  (v, i) => v * xsectionIBD[i] * neutrinoTargets
);
export const eventSpectrumIBDforNO = fluxNOSpectrumAnu.map(
  (v, i) => v * xsectionIBD[i] * neutrinoTargets
);
export const eventSpectrumIBDforIO = fluxIOSpectrumAnu.map(
  (v, i) => v * xsectionIBD[i] * neutrinoTargets
);

// IBD event totals
export const sumSpectrumIBDnoOsc = sum(eventSpectrumIBDnoOsc) * deltaEnergy;
export const sumSpectrumIBDforNO = sum(eventSpectrumIBDforNO) * deltaEnergy;
export const sumSpectrumIBDforIO = sum(eventSpectrumIBDforIO) * deltaEnergy;

// make neutrino-proton elastic scattering (pES) cross section
export const xsectionESpNue = energyValues.map(function (x) {
  return crossSectionElasticScattering(
    x,
    NeutrinoType.electronNeutrino,
    undefined,
    undefined,
    NeutrinoTarget.proton
  );
});
export const xsectionESpAnu = energyValues.map(function (x) {
  return crossSectionElasticScattering(
    x,
    NeutrinoType.electronAntineutrino,
    undefined,
    undefined,
    NeutrinoTarget.proton
  );
});
const xsectionESpNux = energyValues.map(function (x) {
  return crossSectionElasticScattering(
    x,
    NeutrinoType.muTauNeutrino,
    undefined,
    undefined,
    NeutrinoTarget.proton
  );
});
const xsectionESpAnx = energyValues.map(function (x) {
  return crossSectionElasticScattering(
    x,
    NeutrinoType.muTauAntineutrino,
    undefined,
    undefined,
    NeutrinoTarget.proton
  );
});

// pES event sprecta (/MeV)
export const eventSpectrumNueESP = fluxSpectrumNue.map(
  (v, i) => v * xsectionESpNue[i] * neutrinoTargets
);
export const eventSpectrumAnuESP = fluxSpectrumAnu.map(
  (v, i) => v * xsectionESpAnu[i] * neutrinoTargets
);
export const eventSpectrumNuxESP = fluxSpectrumNux.map(
  (v, i) => v * xsectionESpNux[i] * neutrinoTargets
);
export const eventSpectrumAnxESP = fluxSpectrumNux.map(
  (v, i) => v * xsectionESpAnx[i] * neutrinoTargets
);

// pES event totals with Nux x4 for mu and tau neutrinos and antineutrinos
export const sumSpectrumNueESP = sum(eventSpectrumNueESP) * deltaEnergy;
export const sumSpectrumAnuESP = sum(eventSpectrumAnuESP) * deltaEnergy;
export const sumSpectrumNuxESP = sum(eventSpectrumNuxESP) * deltaEnergy * 2;
export const sumSpectrumAnxESP = sum(eventSpectrumAnxESP) * deltaEnergy * 2;

// make neutrino-electron elastic scattering (eES) cross section
export const xsectionESeNue = energyValues.map(function (x) {
  return crossSectionElasticScattering(
    x,
    NeutrinoType.electronNeutrino,
    undefined,
    undefined,
    NeutrinoTarget.electron
  );
});
export const eventSpectrumNueESEforNO = fluxNOSpectrumNue.map(
  (v, i) => v * xsectionESeNue[i] * neutrinoTargets
);
export const sumSpectrumNueESEforNO =
  sum(eventSpectrumNueESEforNO) * deltaEnergy;
export const eventSpectrumNueESEforIO = fluxIOSpectrumNue.map(
  (v, i) => v * xsectionESeNue[i] * neutrinoTargets
);
export const sumSpectrumNueESEforIO =
  sum(eventSpectrumNueESEforIO) * deltaEnergy;

export const xsectionESeAnu = energyValues.map(function (x) {
  return crossSectionElasticScattering(
    x,
    NeutrinoType.electronAntineutrino,
    undefined,
    undefined,
    NeutrinoTarget.electron
  );
});
export const eventSpectrumAnuESEforNO = fluxNOSpectrumAnu.map(
  (v, i) => v * xsectionESeAnu[i] * neutrinoTargets
);
export const sumSpectrumAnuESEforNO =
  sum(eventSpectrumAnuESEforNO) * deltaEnergy;
export const eventSpectrumAnuESEforIO = fluxIOSpectrumAnu.map(
  (v, i) => v * xsectionESeAnu[i] * neutrinoTargets
);
export const sumSpectrumAnuESEforIO =
  sum(eventSpectrumAnuESEforIO) * deltaEnergy;

// x2 for mu and tau
export const xsectionESeNux = energyValues.map(function (x) {
  return crossSectionElasticScattering(
    x,
    NeutrinoType.muTauNeutrino,
    undefined,
    undefined,
    NeutrinoTarget.electron
  );
});
export const eventSpectrumNuxESEforNO = fluxNOSpectrumNux.map(
  (v, i) => v * xsectionESeNux[i] * neutrinoTargets
);
export const sumSpectrumNuxESEforNO =
  sum(eventSpectrumNuxESEforNO) * deltaEnergy * 2;
export const eventSpectrumNuxESEforIO = fluxIOSpectrumNux.map(
  (v, i) => v * xsectionESeNux[i] * neutrinoTargets
);
export const sumSpectrumNuxESEforIO =
  sum(eventSpectrumNuxESEforIO) * deltaEnergy * 2;

// x2 for mu and tau
export const xsectionESeAnx = energyValues.map(function (x) {
  return crossSectionElasticScattering(
    x,
    NeutrinoType.muTauAntineutrino,
    undefined,
    undefined,
    NeutrinoTarget.electron
  );
});
export const eventSpectrumAnxESEforNO = fluxNOSpectrumNux.map(
  (v, i) => v * xsectionESeAnx[i] * neutrinoTargets
);
export const sumSpectrumAnxESEforNO =
  sum(eventSpectrumAnxESEforNO) * deltaEnergy * 2;
export const eventSpectrumAnxESEforIO = fluxIOSpectrumNux.map(
  (v, i) => v * xsectionESeAnx[i] * neutrinoTargets
);
export const sumSpectrumAnxESEforIO =
  sum(eventSpectrumAnxESEforIO) * deltaEnergy * 2;

interface CEvNSEventsInterface {
  [NeutrinoType.electronNeutrino]: number;
  [NeutrinoType.electronAntineutrino]: number;
  [NeutrinoType.muTauNeutrino]: number; // both... Anti/Anti-anti
}

export const CEvNSEvents = (element: Element): CEvNSEventsInterface => {
  let targetParams = getTargetParamsCEvNS(element);
  let xsectionCEvNS = energyValues.map((ev) => xSectionCEvNS(ev, targetParams));
  let eventSpectrumNueCEvNS = fluxSpectrumNue.map(
    (v, i) => v * xsectionCEvNS[i] * targetParams.nuclearTargets
  );
  let eventSpectrumAnuCEvNS = fluxSpectrumAnu.map(
    (v, i) => v * xsectionCEvNS[i] * targetParams.nuclearTargets
  );
  let eventSpectrumNuxCEvNS = fluxSpectrumNux.map(
    (v, i) => v * xsectionCEvNS[i] * targetParams.nuclearTargets
  );
  return {
    [NeutrinoType.electronNeutrino]: sum(eventSpectrumNueCEvNS) * deltaEnergy,
    [NeutrinoType.electronAntineutrino]:
      sum(eventSpectrumAnuCEvNS) * deltaEnergy,
    [NeutrinoType.muTauNeutrino]: sum(eventSpectrumNuxCEvNS) * deltaEnergy * 4,
  };
};

function neutrinoSpectrumCCSN(Ev: number, Ev_avg: number) {
  const enu_tot = (5e52 * 1e-13) / ELEMENTARY_CHARGE; // MeV
  const d_ccsn = 10 * 3.086e21; // cm
  const beta = 4;

  const prefix = beta ** beta / (4 * Math.PI * 6 * Ev_avg * Ev_avg);

  const energy_factor =
    (Ev / Ev_avg) ** (beta - 1) * Math.exp((-beta * Ev) / Ev_avg);

  return (prefix * enu_tot * energy_factor) / d_ccsn / d_ccsn;
}

function xSectionCEvNS(
  Ev: number,
  {
    targetMass,
    protonTargets,
    neutronTargets,
  }: { targetMass: number; protonTargets: number; neutronTargets: number }
) {
  // assuming electro-weak parameters =1 and ignoring radiative corrections
  // assuming no axial-vector contributions- equal numbers of up and down protons and neutrons
  const cLeft = (CEvNS_PROTON_VECTOR * protonTargets +
      CEvNS_NEUTRON_VECTOR * neutronTargets)
  const cRight = cLeft
  
  const tCEvNSMax = Ev / (1 + targetMass / (2 * Ev));
  if (tCEvNSMax < tCEvNSMin) {
    return 0;
  }

  const y_max = tCEvNSMax / Ev;
  const y_min = tCEvNSMin / Ev;

  const term1 = (((FERMI_COUPLING_CONSTANT / 1e6) * HBAR_C) ** 2 * targetMass * Ev) / (2 * Math.PI);
  const term2 = cLeft ** 2 * y_max;
  const term3 = cRight ** 2 * (1/3) * (1 - (1 - y_max) ** 3);
  const term4 = cLeft * cRight * (targetMass/(2 * Ev)) * y_max ** 2;

  const term5 = cLeft ** 2 * y_min;
  const term6 = cRight ** 2 * (1/3) * (1 - (1 - y_min) ** 3);
  const term7 = cLeft * cRight * (targetMass/(2 * Ev)) * y_min ** 2;

  return term1 * ((term2 + term3 - term4) - (term5 + term6 - term7));
}
