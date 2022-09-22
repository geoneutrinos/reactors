import {
  ELEMENTARY_CHARGE,
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

// TODO: the osc params are runtime modifiable, need to eventually get them
// from the Physics Context
// I thnk fine as is (at least until the mass ordering is determined experimentally)
// tabulated rates are given for both normal and inverted mass ordering
import { s2t12, c2t12, s2t13Normal, s2t13Inverted, MassOrdering } from "../physics/neutrino-oscillation";

import { sum } from "lodash";

import elements, { Element } from "../elements";
import { IBD_THRESHOLD } from "../physics/derived";

export const neutrinoTargets = 1e32; // for IBD, eES, pES

interface CEvNSTarget {
  molarMass: number;
  nuclearTargets: number;
  protonTargets: number;
  neutronTargets: number;
  targetMass: number;
}

interface SNRecord {
  crossSection: Float64Array
  eventSpectrum: Float64Array
  events: number
}

type SNFluxSpectrumInterface = Record<NeutrinoType, Float64Array>

type OscilatedFluxSpectrums = Record<MassOrdering, SNFluxSpectrumInterface>

interface CEvNSEventsInterface {
  [NeutrinoType.electronNeutrino]: number;
  [NeutrinoType.electronAntineutrino]: number;
  [NeutrinoType.muTauNeutrino]: number; // both... Anti/Anti-anti
}

export const getTargetParamsCEvNS = (element: Element): CEvNSTarget => {
  return {
    molarMass: element.relative_atomic_mass,
    nuclearTargets: (AVOGADRO_CONSTANT * 1e6 * element.isotopic_composition) / element.relative_atomic_mass,
    protonTargets: element.atomic_number,
    neutronTargets: element.mass_number - element.atomic_number,
    targetMass: element.relative_atomic_mass * ATOMIC_MASS_UNIT,
  };
};

const energyBins = 10000;
const maximumEnergy = 100;
const deltaEnergy = maximumEnergy / energyBins; // MeV

// make the array of neutrino energies 0 - 100 MeV
export const energyValues = new Float64Array(energyBins).map(
  (v, i) => i * deltaEnergy + deltaEnergy / 2
);

/**
 * Calculates the unoscillated neutrino flux spectrum from a supernova for all the neutrino types we use
 * @param averageNeutrinoEnergyNue 
 * @param averageNeutrinoEnergyAnu 
 * @param averageNeutrinoEnergyNux
 * @param totalEnergyNeutrinoNue
 * @param totalEnergyNeutrinoAnu
 * @param totalEnergyNeutrinoNux
 * @returns 
 */
export const SNFluxSpectrum = (averageNeutrinoEnergyNue: number, averageNeutrinoEnergyAnu: number, averageNeutrinoEnergyNux: number, totalEnergyNeutrinoNue: number, totalEnergyNeutrinoAnu: number, totalEnergyNeutrinoNux: number) : SNFluxSpectrumInterface => {
  const muTauSpec = energyValues.map((x) => neutrinoSpectrumCCSN(x, averageNeutrinoEnergyNux, totalEnergyNeutrinoNux)) 
  return {
    [NeutrinoType.electronNeutrino]: energyValues.map((x) => neutrinoSpectrumCCSN(x, averageNeutrinoEnergyNue, totalEnergyNeutrinoNue)),
    [NeutrinoType.electronAntineutrino]: energyValues.map((x) => neutrinoSpectrumCCSN(x, averageNeutrinoEnergyAnu, totalEnergyNeutrinoAnu)),
    [NeutrinoType.muTauNeutrino]: muTauSpec, 
    [NeutrinoType.muTauAntineutrino]: muTauSpec,
  }
}

// Oscillations now include theta13 following Nagakura et al. 2021 "Supernova neutrino signals based on long-term axisymmetric simulations"
export const oscillatedFluxSpectrum = ({fluxSpectrums}:{fluxSpectrums: SNFluxSpectrumInterface}): OscilatedFluxSpectrums=> {
  const electronNeutrinoNeutrinoFluxSpectrum = fluxSpectrums[NeutrinoType.electronNeutrino]
  const electronAntineutrinoNeutrinoFluxSpectrum = fluxSpectrums[NeutrinoType.electronAntineutrino]
  const muTauNeutrinoFluxSpectrum = fluxSpectrums[NeutrinoType.muTauNeutrino]

  return {
    [MassOrdering.Normal]: {
      [NeutrinoType.electronNeutrino]: electronNeutrinoNeutrinoFluxSpectrum.map((v,i) => v * s2t13Normal + muTauNeutrinoFluxSpectrum[i] * (1 - s2t13Normal)),
      [NeutrinoType.electronAntineutrino]: electronAntineutrinoNeutrinoFluxSpectrum.map((v,i) => v * c2t12 * (1 - s2t13Normal) + muTauNeutrinoFluxSpectrum[i] * (1 - c2t12 * (1 - s2t13Normal))),
      [NeutrinoType.muTauNeutrino]: electronNeutrinoNeutrinoFluxSpectrum.map((v,i) => (v * (1 - s2t13Normal) + muTauNeutrinoFluxSpectrum[i] * (1 + s2t13Normal))/2),
      [NeutrinoType.muTauAntineutrino]: electronAntineutrinoNeutrinoFluxSpectrum.map((v,i) => (v * (1 - c2t12 * (1 - s2t13Normal)) + muTauNeutrinoFluxSpectrum[i] * (1 + c2t12 * (1 - s2t13Normal)))/2),
    },
    [MassOrdering.Inverted]: {
      [NeutrinoType.electronNeutrino]: electronNeutrinoNeutrinoFluxSpectrum.map((v,i) => v * s2t12 * (1 - s2t13Inverted) + muTauNeutrinoFluxSpectrum[i] * (1 - s2t12 * (1 - s2t13Inverted))),
      [NeutrinoType.electronAntineutrino]: electronAntineutrinoNeutrinoFluxSpectrum.map((v,i) => v * s2t13Inverted + muTauNeutrinoFluxSpectrum[i] * (1 - s2t13Inverted)),
      [NeutrinoType.muTauNeutrino]: electronNeutrinoNeutrinoFluxSpectrum.map((v,i) => (v * (1 - s2t12 * (1 - s2t13Inverted)) + muTauNeutrinoFluxSpectrum[i] * (1 + s2t12 * (1 - s2t13Inverted)))/2),
      [NeutrinoType.muTauAntineutrino]: electronAntineutrinoNeutrinoFluxSpectrum.map((v,i) => (v * (1 - s2t13Inverted) + muTauNeutrinoFluxSpectrum[i] * (1 + s2t13Inverted))/2),
    }
  }
}

export const calcIBDSNRecord = (neutrinoType: NeutrinoType, fluxSpectrums: SNFluxSpectrumInterface, tMin:number = 0): SNRecord => {
  const crossSection = energyValues.map(v => (v - IBD_THRESHOLD - tMin) > 0? crossSectionSV2003(v): 0)
  const eventSpectrum = fluxSpectrums[neutrinoType].map(
    (v, i) => v * crossSection[i] * neutrinoTargets
  );
  const events = sum(eventSpectrum) * deltaEnergy;

  return {
    crossSection,
    eventSpectrum,
    events,
  }
}

export const calcSNRecord = (neutrinoType: NeutrinoType, neutrinoTarget:NeutrinoTarget, tMin: number, fluxSpectrums:SNFluxSpectrumInterface):SNRecord =>{

  const crossSection = energyValues.map((Ev) => crossSectionElasticScattering(
    Ev,
    neutrinoType,
    tMin,
    undefined,
    neutrinoTarget
  ))
  const eventSpectrum = fluxSpectrums[neutrinoType].map((v, i) => v * crossSection[i] * neutrinoTargets)
  let events = sum(eventSpectrum) * deltaEnergy;

  // It's both Mu and Tau
  if ((neutrinoType === NeutrinoType.muTauAntineutrino) || (neutrinoType === NeutrinoType.muTauNeutrino)){
    events = events * 2
  }

  return {
    crossSection,
    eventSpectrum,
    events
  }
} 

//-----

type ElementalRecord = Record<keyof typeof elements, CEvNSEventsInterface>

export const CEvNSEventsElemental = (element: Element, TMin:number, fluxSpectrums:SNFluxSpectrumInterface): ElementalRecord => {
  const isotopes = Object.values(elements).filter(isotope => isotope.atomic_number === element.atomic_number)
  const totals: CEvNSEventsInterface = {
    [NeutrinoType.electronNeutrino]: 0,
    [NeutrinoType.electronAntineutrino]: 0, 
    [NeutrinoType.muTauNeutrino]:0,
  }
  const enteries = isotopes.map(isotope => {
    const events = CEvNSEvents(isotope, TMin, fluxSpectrums)

    totals[NeutrinoType.electronNeutrino] += events[NeutrinoType.electronNeutrino]
    totals[NeutrinoType.electronAntineutrino] += events[NeutrinoType.electronAntineutrino]
    totals[NeutrinoType.muTauNeutrino] += events[NeutrinoType.muTauNeutrino]

    return [isotope.key, events]
  })
  const records: ElementalRecord = Object.fromEntries(enteries)
  records["total"] = totals
  return records
}

export const CEvNSEvents = (element: Element, TMin:number, fluxSpectrums:SNFluxSpectrumInterface): CEvNSEventsInterface => {
  let targetParams = {tMin: TMin, ...getTargetParamsCEvNS(element)};
  let xsectionCEvNS = energyValues.map((ev) => xSectionCEvNS(ev, targetParams));
  let eventSpectrumNueCEvNS = fluxSpectrums[NeutrinoType.electronNeutrino].map(
    (v, i) => v * xsectionCEvNS[i] * targetParams.nuclearTargets
  );
  let eventSpectrumAnuCEvNS = fluxSpectrums[NeutrinoType.electronAntineutrino].map(
    (v, i) => v * xsectionCEvNS[i] * targetParams.nuclearTargets
  );
  let eventSpectrumNuxCEvNS = fluxSpectrums[NeutrinoType.muTauNeutrino].map(
    (v, i) => v * xsectionCEvNS[i] * targetParams.nuclearTargets
  );
  return {
    [NeutrinoType.electronNeutrino]: sum(eventSpectrumNueCEvNS) * deltaEnergy,
    [NeutrinoType.electronAntineutrino]:
      sum(eventSpectrumAnuCEvNS) * deltaEnergy,
    [NeutrinoType.muTauNeutrino]: sum(eventSpectrumNuxCEvNS) * deltaEnergy * 4,
  };
};

function neutrinoSpectrumCCSN(Ev: number, Ev_avg: number, Ev_tot: number) {
  const energy_convert = 1e-13 / ELEMENTARY_CHARGE; // MeV per erg
  const enu_tot = Ev_tot * energy_convert; // MeV
  const d_ccsn = 10 * 3.086e21; // cm
  const beta = 4;

  const prefix = beta ** beta / (4 * Math.PI * 6 * Ev_avg * Ev_avg);

  const energy_factor =
    (Ev / Ev_avg) ** (beta - 1) * Math.exp((-beta * Ev) / Ev_avg);

  return (prefix * enu_tot * energy_factor) / d_ccsn / d_ccsn;
}


//TODO Integrate with the main ES function
function xSectionCEvNS(
  Ev: number,
  {
    tMin,
    targetMass,
    protonTargets,
    neutronTargets,
  }: { tMin:number, targetMass: number; protonTargets: number; neutronTargets: number }
) {
  // assuming electro-weak parameters =1 and ignoring radiative corrections
  // assuming no axial-vector contributions- equal numbers of up and down protons and neutrons
  const cLeft = (CEvNS_PROTON_VECTOR * protonTargets +
      CEvNS_NEUTRON_VECTOR * neutronTargets)
  const cRight = cLeft
  
  const tCEvNSMax = Ev / (1 + targetMass / (2 * Ev));
  if (tCEvNSMax < tMin) {
    return 0;
  }

  const y_max = tCEvNSMax / Ev;
  const y_min = tMin / Ev;

  const term1 = (((FERMI_COUPLING_CONSTANT / 1e6) * HBAR_C) ** 2 * targetMass * Ev) / (2 * Math.PI);
  const term2 = cLeft ** 2 * y_max;
  const term3 = cRight ** 2 * (1/3) * (1 - (1 - y_max) ** 3);
  const term4 = cLeft * cRight * (targetMass/(2 * Ev)) * y_max ** 2;

  const term5 = cLeft ** 2 * y_min;
  const term6 = cRight ** 2 * (1/3) * (1 - (1 - y_min) ** 3);
  const term7 = cLeft * cRight * (targetMass/(2 * Ev)) * y_min ** 2;

  return term1 * ((term2 + term3 - term4) - (term5 + term6 - term7));
}
