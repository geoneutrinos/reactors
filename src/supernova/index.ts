import {
  ELEMENTARY_CHARGE,
  FERMI_COUPLING_CONSTANT,
  HBAR_C,
  ATOMIC_MASS_UNIT,
  AVOGADRO_CONSTANT,
} from "../physics/constants";

import {
  NeutrinoType,
  crossSectionElasticScattering,
  NeutrinoTarget,
  crossSectionSV2003,
} from "../physics/neutrino-cross-section";

// TODO: the osc params are runtime modifiable, need to eventually get them
// from the Physics Context
// I thnk fine as is (at least until the mass ordering is determined experimentally)
// tabulated rates are given for both normal and inverted mass ordering
import {
  s2t12Inverted,
  c2t12Normal,
  s2t13Normal,
  s2t13Inverted,
  MassOrdering,
} from "../physics/neutrino-oscillation";

import { sum, memoize } from "lodash";

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
  (_v, i) => i * deltaEnergy + deltaEnergy / 2
);

/**
 * Calculates the unoscillated neutrino flux spectrum from a supernova for all the neutrino types we use
 * @param averageNeutrinoEnergyNue 
 * @param averageNeutrinoEnergyAnu 
 * @param averageNeutrinoEnergyNux
 * @param totalEnergyNeutrinoNue
 * @param totalEnergyNeutrinoAnu
 * @param totalEnergyNeutrinoNux
 * @param nueSpectrumShapeParam
 * @param anuSpectrumShapeParam
 * @param nuxSpectrumShapeParam
 * @returns
 */
export const SNFluxSpectrum = (averageNeutrinoEnergyNue: number, averageNeutrinoEnergyAnu: number, averageNeutrinoEnergyNux: number, totalEnergyNeutrinoNue: number, totalEnergyNeutrinoAnu: number, totalEnergyNeutrinoNux: number, nueSpectrumShapeParam: number, anuSpectrumShapeParam: number, nuxSpectrumShapeParam: number) : SNFluxSpectrumInterface => {
  const muTauSpec = energyValues.map((x) => neutrinoSpectrumCCSN(x, averageNeutrinoEnergyNux, totalEnergyNeutrinoNux, nuxSpectrumShapeParam)) 
  return {
    [NeutrinoType.electronNeutrino]: energyValues.map((x) => neutrinoSpectrumCCSN(x, averageNeutrinoEnergyNue, totalEnergyNeutrinoNue, nueSpectrumShapeParam)),
    [NeutrinoType.electronAntineutrino]: energyValues.map((x) => neutrinoSpectrumCCSN(x, averageNeutrinoEnergyAnu, totalEnergyNeutrinoAnu, anuSpectrumShapeParam)),
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
      [NeutrinoType.electronAntineutrino]: electronAntineutrinoNeutrinoFluxSpectrum.map((v,i) => v * c2t12Normal * (1 - s2t13Normal) + muTauNeutrinoFluxSpectrum[i] * (1 - c2t12Normal * (1 - s2t13Normal))),
      [NeutrinoType.muTauNeutrino]: electronNeutrinoNeutrinoFluxSpectrum.map((v,i) => (v * (1 - s2t13Normal) + muTauNeutrinoFluxSpectrum[i] * (1 + s2t13Normal))/2),
      [NeutrinoType.muTauAntineutrino]: electronAntineutrinoNeutrinoFluxSpectrum.map((v,i) => (v * (1 - c2t12Normal * (1 - s2t13Normal)) + muTauNeutrinoFluxSpectrum[i] * (1 + c2t12Normal * (1 - s2t13Normal)))/2),
    },
    [MassOrdering.Inverted]: {
      [NeutrinoType.electronNeutrino]: electronNeutrinoNeutrinoFluxSpectrum.map((v,i) => v * s2t12Inverted * (1 - s2t13Inverted) + muTauNeutrinoFluxSpectrum[i] * (1 - s2t12Inverted * (1 - s2t13Inverted))),
      [NeutrinoType.electronAntineutrino]: electronAntineutrinoNeutrinoFluxSpectrum.map((v,i) => v * s2t13Inverted + muTauNeutrinoFluxSpectrum[i] * (1 - s2t13Inverted)),
      [NeutrinoType.muTauNeutrino]: electronNeutrinoNeutrinoFluxSpectrum.map((v,i) => (v * (1 - s2t12Inverted * (1 - s2t13Inverted)) + muTauNeutrinoFluxSpectrum[i] * (1 + s2t12Inverted * (1 - s2t13Inverted)))/2),
      [NeutrinoType.muTauAntineutrino]: electronAntineutrinoNeutrinoFluxSpectrum.map((v,i) => (v * (1 - s2t13Inverted) + muTauNeutrinoFluxSpectrum[i] * (1 + s2t13Inverted))/2),
    }
  }
}

export const calcIBDSNRecord = (neutrinoType: NeutrinoType, fluxSpectrums: SNFluxSpectrumInterface, tMin:number = 0, xsFunc = crossSectionSV2003, threshold_energy = IBD_THRESHOLD ): SNRecord => {
  const crossSection = energyValues.map(v => (v - threshold_energy - tMin) > 0? xsFunc(v): 0)
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
  let xsectionCEvNS = energyValues.map((ev) => crossSectionElasticScattering(ev, NeutrinoType.electronNeutrino, targetParams.tMin, undefined, NeutrinoTarget.nucleus, targetParams.targetMass, targetParams.protonTargets, targetParams.neutronTargets));
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

const factorial = memoize((x: number) => {
  let n = 1;
  while (x > 0){
    n *= x;
    x--;
  }
  return n
})

function neutrinoSpectrumCCSN(Ev: number, Ev_avg: number, Ev_tot: number, shape_param: number) {
  const energy_convert = 1e-13 / ELEMENTARY_CHARGE; // MeV per erg
  const enu_tot = Ev_tot * 1e52 * energy_convert; // MeV
  const d_ccsn = 10 * 3.086e21; // cm

  const energy_factor =
    (Ev / Ev_avg) ** (shape_param - 1) * Math.exp((-shape_param * Ev) / Ev_avg);

  const prefix = shape_param ** shape_param / (4 * Math.PI * Ev_avg * Ev_avg);

// the factor of 6 in the denominator is (shape_param - 1)! for shape_param=4
// TODO: code the factorial described above


  return (prefix * enu_tot * energy_factor) / d_ccsn / d_ccsn / factorial(shape_param - 1);
}
