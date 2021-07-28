import { memoize } from 'lodash';

export enum MassOrdering {
    Inverted = "Inverted",
    Normal = "Normal",
}


interface VariableOscillationParams {
  s2t12: number
  dmsq21: number
  s2t13Normal: number
  s2t13Inverted: number
  dmsq32Normal: number
  dmsq32Inverted: number
}
interface DerivedOscillationParams {
  dmsq31Normal: number
  dmsq31Inverted: number
  c4t13Normal: number
  c4t13Inverted: number
  s22t12: number
  c2t12: number
  s22t13Normal:number
  s22t13Inverted:number
  averageSurvivalProbabilityNormal: number
  averageSurvivalProbabilityInverted: number
  averageSurvivalProbability: number
}
interface OscillationFunctions {
  normalNeutrinoFlavor: (Ev: number, dist: number) => number;
  normalNeutrinoOscillationSpectrum: (dist: number) => Float64Array;
  invertedNeutrinoFlavor: (Ev: number, dist: number) => number;
  invertedNeutrinoOscillationSpectrum: (dist: number) => Float64Array;
  neutrinoOscillationSpectrum: (dist: number) => Float64Array;
}
interface OscillationConfig {
  massOrdering: MassOrdering
}
type OscillationParams = VariableOscillationParams & DerivedOscillationParams;
export type Oscillation = OscillationParams & OscillationFunctions & OscillationConfig;

export let oscillation: Oscillation = {
  s2t12: 0,
  dmsq21: 0,
  s2t13Normal: 0,
  s2t13Inverted: 0,
  dmsq32Normal: 0,
  dmsq32Inverted: 0,

  dmsq31Normal: 0,
  dmsq31Inverted: 0,

  c4t13Normal: 0,
  c4t13Inverted: 0,

  s22t12: 0,
  c2t12: 0,

  s22t13Normal:0,
  s22t13Inverted:0,

  averageSurvivalProbabilityNormal: 0,
  averageSurvivalProbabilityInverted: 0,
  averageSurvivalProbability: 0,

  // empty functions
  normalNeutrinoFlavor: (Ev, dist) => 0,
  normalNeutrinoOscillationSpectrum: (dist) => new Float64Array(),
  invertedNeutrinoFlavor: (Ev, dist) => 0,
  invertedNeutrinoOscillationSpectrum: (dist) => new Float64Array(),
  neutrinoOscillationSpectrum: (dist) => new Float64Array(),

  // Config things
  massOrdering: MassOrdering.Normal
}

export const bins = (new Float64Array(1000)).map((v, i) => 0.005 + i/100)

const defaultOscillationParams: VariableOscillationParams = {
  s2t12: 0.310,
  dmsq21: 7.39e-5,
  s2t13Normal:  0.02241,
  s2t13Inverted: 0.02261,
  dmsq32Normal: 2.449e-3,
  dmsq32Inverted: -2.509e-3,
}

interface OsilationParamsAction{
  arg: keyof VariableOscillationParams | keyof OscillationConfig
  value: number | MassOrdering
}

export const oscillationReducer = (state:Oscillation, action:OsilationParamsAction): Oscillation => {
  const oscillation = { ...state };
  switch (action.arg) {
    case "s2t12":
      {
        let s2t12 = action.value as number;
        oscillation.s2t12 = s2t12;
        oscillation.s22t12 = 4 * s2t12 * (1 - s2t12);
        oscillation.c2t12 = 1 - s2t12;
      }
      break;

    case "dmsq21":
      {
        let dmsq21 = action.value as number;
        let { dmsq32Normal, dmsq32Inverted } = oscillation;

        oscillation.dmsq21 = dmsq21;
        oscillation.dmsq31Normal = dmsq32Normal + dmsq21;
        oscillation.dmsq31Inverted = dmsq32Inverted + dmsq21;
      }
      break;

    case "s2t13Normal":
      {
        let s2t13Normal = action.value  as number;
        oscillation.s2t13Normal = s2t13Normal;
        oscillation.c4t13Normal = (1 - s2t13Normal) ** 2;
        oscillation.s22t13Normal = 4 * s2t13Normal * (1 - s2t13Normal);
      }
      break;
    case "s2t13Inverted":
      {
        let s2t13Inverted = action.value as number;
        oscillation.s2t13Inverted = s2t13Inverted;
        oscillation.c4t13Inverted = (1 - s2t13Inverted) ** 2;
        oscillation.s22t13Inverted = 4 * s2t13Inverted * (1 - s2t13Inverted);
      }
      break;

    case "dmsq32Normal":
      {
        let dmsq32Normal = action.value as number;
        let { dmsq21 } = oscillation;
        oscillation.dmsq32Normal = dmsq32Normal;
        oscillation.dmsq31Normal = dmsq32Normal + dmsq21;
      }
      break;

    case "dmsq32Inverted":
      {
        let dmsq32Inverted = action.value as number;
        let { dmsq21 } = oscillation;
        oscillation.dmsq32Inverted = dmsq32Inverted;
        oscillation.dmsq31Inverted = dmsq32Inverted + dmsq21;
      }
      break;
    case "massOrdering":{
      let massOrdering = action.value as MassOrdering;
      oscillation.massOrdering = massOrdering;
    }
  }

  // recalc average survival probabilites
  let {
    c4t13Normal,
    s22t12,
    s2t13Normal,
    c4t13Inverted,
    s2t13Inverted,
    dmsq21,
    dmsq31Normal,
    dmsq32Normal,
    s22t13Normal,
    c2t12,
    s2t12,
    dmsq31Inverted,
    dmsq32Inverted,
    s22t13Inverted,
  } = oscillation;

  oscillation.averageSurvivalProbabilityNormal =
    c4t13Normal * (1 - s22t12 * 0.5) + s2t13Normal * s2t13Normal;
  oscillation.averageSurvivalProbabilityInverted =
    c4t13Inverted * (1 - s22t12 * 0.5) + s2t13Inverted * s2t13Inverted;
  oscillation.averageSurvivalProbability = 
    oscillation.massOrdering === MassOrdering.Normal
      ? oscillation.averageSurvivalProbabilityNormal
      : oscillation.averageSurvivalProbabilityInverted;

  // reinit functions
  oscillation.normalNeutrinoFlavor = (Ev: number, dist: number): number => {
    const oscarg21 = 1.27 * dmsq21 * dist * 1000;
    const oscarg31 = 1.27 * dmsq31Normal * dist * 1000;
    const oscarg32 = 1.27 * dmsq32Normal * dist * 1000;

    const supr21 = c4t13Normal * s22t12 * Math.sin(oscarg21 / Ev) ** 2;
    const supr31 = s22t13Normal * c2t12 * Math.sin(oscarg31 / Ev) ** 2;
    const supr32 = s22t13Normal * s2t12 * Math.sin(oscarg32 / Ev) ** 2;

    return 1 - supr21 - supr31 - supr32;
  };
  oscillation.normalNeutrinoOscillationSpectrum = memoize(
    (dist: number): Float64Array => {
      return bins.map((Ev) =>
        oscillation.normalNeutrinoFlavor(Ev, dist)
      );
    }
  );

  oscillation.invertedNeutrinoFlavor = (Ev: number, dist: number): number => {
    const oscarg21 = 1.27 * dmsq21 * dist * 1000;
    const oscarg31 = 1.27 * dmsq31Inverted * dist * 1000;
    const oscarg32 = 1.27 * dmsq32Inverted * dist * 1000;

    const supr21 = c4t13Inverted * s22t12 * Math.sin(oscarg21 / Ev) ** 2;
    const supr31 = s22t13Inverted * c2t12 * Math.sin(oscarg31 / Ev) ** 2;
    const supr32 = s22t13Inverted * s2t12 * Math.sin(oscarg32 / Ev) ** 2;

    return 1 - supr21 - supr31 - supr32;
  };
  oscillation.invertedNeutrinoOscillationSpectrum = memoize(
    (dist: number): Float64Array => {
      return bins.map((Ev) =>
        oscillation.invertedNeutrinoFlavor(Ev, dist)
      );
    }
  );

  oscillation.neutrinoOscillationSpectrum =
    oscillation.massOrdering === MassOrdering.Normal
      ? oscillation.normalNeutrinoOscillationSpectrum
      : oscillation.invertedNeutrinoOscillationSpectrum;
  return oscillation;
}

let arg: keyof VariableOscillationParams;
for (arg in defaultOscillationParams){
  let value = defaultOscillationParams[arg]
  oscillation = oscillationReducer(oscillation, {arg:arg, value:value})
}

export const {
  s2t12,
  dmsq21,
  s2t13Normal,
  s2t13Inverted,
  dmsq32Normal,
  dmsq32Inverted,
  dmsq31Normal,
  dmsq31Inverted,
  c4t13Normal,
  c4t13Inverted,
  s22t12,
  c2t12,
  s22t13Normal, 
  s22t13Inverted,
  averageSurvivalProbabilityNormal,
  averageSurvivalProbabilityInverted,
  normalNeutrinoOscillationSpectrum,
  invertedNeutrinoOscillationSpectrum
} = oscillation;