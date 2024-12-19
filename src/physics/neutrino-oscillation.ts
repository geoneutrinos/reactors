import { memoize } from 'lodash';
import bins from "./bins"

export enum MassOrdering {
    Inverted = "IO",
    Normal = "NO",
}


interface VariableOscillationParams {
  s2t12Normal: number
  s2t12Normal3SigmaMinimum: number
  // s2t12Normal3SigmaMaximum: number
  s2t12Inverted: number
  // s2t12Inverted3SigmaMinimum: number
  // s2t12Inverted3SigmaMaximum: number
  dmsq21Normal: number
  // dmsq21Normal3SigmaMinimum: number
  // dmsq21Normal3SigmaMaximum: number
  dmsq21Inverted: number
  // dmsq21Inverted3SigmaMinimum: number
  // dmsq21Inverted3SigmaMaximum: number
  s2t13Normal: number
  // s2t13Normal3SigmaMinimum: number
  // s2t13Normal3SigmaMaximum: number
  s2t13Inverted: number
  // s2t13Inverted3SigmaMinimum: number
  // s2t13Inverted3SigmaMaximum: number
  dmsq31Normal: number
  // dmsq31Normal3SigmaMinimum: number
  // dmsq31Normal3SigmaMaximum: number
  dmsq32Inverted: number
  // dmsq32Inverted3SigmaMinimum: number
  // dmsq32Inverted3SigmaMaximum: number
}
interface DerivedOscillationParams {
  dmsq32Normal: number
  dmsq31Inverted: number
  c4t13Normal: number
  c4t13Inverted: number
  s22t12Normal: number
  s22t12Normal3SigmaMinimum: number
  s22t12Inverted: number
  c2t12Normal: number
  c2t12Inverted: number
  s22t13Normal: number
  s22t13Inverted: number
  averageSurvivalProbabilityNormal: number
  averageSurvivalProbabilityNormalMaximum: number
  // averageSurvivalProbabilityNormalMinimum: number
  averageSurvivalProbabilityInverted: number
  // averageSurvivalProbabilityInvertedMaximum: number
  // averageSurvivalProbabilityInvertedMinimum: number
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
  s2t12Normal: 0,
  s2t12Normal3SigmaMinimum: 0,
  s2t12Inverted: 0,
  dmsq21Normal: 0,
  dmsq21Inverted: 0,
  s2t13Normal: 0,
  s2t13Inverted: 0,
  dmsq32Normal: 0,
  dmsq32Inverted: 0,

  dmsq31Normal: 0,
  dmsq31Inverted: 0,

  c4t13Normal: 0,
  c4t13Inverted: 0,

  s22t12Normal: 0,
  s22t12Normal3SigmaMinimum: 0,
  s22t12Inverted: 0,

  c2t12Normal: 0,
  c2t12Inverted: 0,

  s22t13Normal: 0,
  s22t13Inverted: 0,

  averageSurvivalProbabilityNormal: 0,
  averageSurvivalProbabilityNormalMaximum: 0,
  // averageSurvivalProbabilityNormalMinimum: 0,
  averageSurvivalProbabilityInverted: 0,
  // averageSurvivalProbabilityInvertedMaximum: 0,
  // averageSurvivalProbabilityInvertedMinimum: 0,
  averageSurvivalProbability: 0,

  // empty functions
  normalNeutrinoFlavor: (_Ev, _dist) => 0,
  normalNeutrinoOscillationSpectrum: (_dist) => new Float64Array(),
  invertedNeutrinoFlavor: (_Ev, _dist) => 0,
  invertedNeutrinoOscillationSpectrum: (_dist) => new Float64Array(),
  neutrinoOscillationSpectrum: (_dist) => new Float64Array(),

  // Config things
  massOrdering: MassOrdering.Normal
}

// Parameter values from nu-fit.org NuFit 6.0 IC24 with SK atmospheric data  
const defaultOscillationParams: VariableOscillationParams = {
  s2t12Normal: 0.308,
  s2t12Normal3SigmaMinimum: 0.275,
  // s2t12Normal3SigmaMaximum: 0.345,
  s2t12Inverted: 0.308,
  // s2t12Inverted3SigmaMinimum: 0.275,
  // s2t12Inverted3SigmaMaximum: 0.345,
  dmsq21Normal: 7.49e-5,
  // dmsq21Normal3SigmaMinimum: 6.92e-5,
  // dmsq21Normal3SigmaMaximum: 8.05e-5,
  dmsq21Inverted: 7.49e-5,
  // dmsq21Inverted3SigmaMaximum: 6.92e-5,
  // dmsq21Inverted3SigmaMinimum: 8.05e-5,
  s2t13Normal:  0.02215,
  // s2t13Normal3SigmaMinimum:  0.02030,
  // s2t13Normal3SigmaMaximum:  0.02388,
  s2t13Inverted: 0.02231,
  // s2t13Inverted3SigmaMinimum: 0.02060,
  // s2t13Inverted3SigmaMaximum: 0.02409,
  dmsq31Normal: 2.513e-3,
  // dmsq31Normal3SigmaMinimum: 2.451e-3,
  // dmsq31Normal3SigmaMaximum: 2.578e-3,
  dmsq32Inverted: -2.484e-3,
  // dmsq32Inverted3SigmaMinimum: -2.547e-3,
  // dmsq32Inverted3SigmaMaximum: -2.421e-3,
}

interface OscillationParamsAction{
  arg: keyof VariableOscillationParams | keyof OscillationConfig
  value: number | MassOrdering
}

export const oscillationReducer = (state:Oscillation, action:OscillationParamsAction): Oscillation => {
  const oscillation = { ...state };
  switch (action.arg) {
    case "s2t12Normal":
      {
        let s2t12Normal = action.value as number;
        oscillation.s2t12Normal = s2t12Normal;
        oscillation.s22t12Normal = 4 * s2t12Normal * (1 - s2t12Normal);
        oscillation.s22t12Normal3SigmaMinimum = 4 * s2t12Normal3SigmaMinimum * (1 - s2t12Normal3SigmaMinimum);
        oscillation.c2t12Normal = 1 - s2t12Normal;
      }
      break;

      case "s2t12Inverted":
      {
        let s2t12Inverted = action.value as number;
        oscillation.s2t12Inverted = s2t12Inverted;
        oscillation.s22t12Inverted = 4 * s2t12Inverted * (1 - s2t12Inverted);
        oscillation.c2t12Inverted = 1 - s2t12Inverted;
      }
      break;

    case "dmsq21Normal":
      {
        let dmsq21Normal = action.value as number;
        let { dmsq31Normal } = oscillation;

        oscillation.dmsq21Normal = dmsq21Normal;
        oscillation.dmsq32Normal = dmsq31Normal - dmsq21Normal;
      }
      break;

      case "dmsq21Inverted":
      {
        let dmsq21Inverted = action.value as number;
        let { dmsq32Inverted } = oscillation;

        oscillation.dmsq21Inverted = dmsq21Inverted;
        oscillation.dmsq31Inverted = dmsq32Inverted + dmsq21Inverted;
      }
      break;

    case "s2t13Normal":
      {
        let s2t13Normal = action.value as number;
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

    case "dmsq31Normal":
      {
        let dmsq31Normal = action.value as number;
        let { dmsq21Normal } = oscillation;
        oscillation.dmsq31Normal = dmsq31Normal;
        oscillation.dmsq32Normal = dmsq31Normal - dmsq21Normal;
      }
      break;

    case "dmsq32Inverted":
      {
        let dmsq32Inverted = action.value as number;
        let { dmsq21Inverted } = oscillation;
        oscillation.dmsq32Inverted = dmsq32Inverted;
        oscillation.dmsq31Inverted = dmsq32Inverted + dmsq21Inverted;
      }
      break;
    case "massOrdering":{
      let massOrdering = action.value as MassOrdering;
      oscillation.massOrdering = massOrdering;
    }
  }

  // recalculate average survival probabilities
  let {
    s2t12Normal,
    s2t12Inverted,
    s22t12Normal,
    s22t12Normal3SigmaMinimum,
    s22t12Inverted,
    c2t12Normal,
    c2t12Inverted,
    s2t13Normal,
    s2t13Inverted,
    s22t13Normal,
    s22t13Inverted,
    c4t13Normal,
    c4t13Inverted,
    dmsq21Normal,
    dmsq21Inverted,
    dmsq31Normal,
    dmsq31Inverted,
    dmsq32Normal,
    dmsq32Inverted,
  } = oscillation;

  oscillation.averageSurvivalProbabilityNormal =
    c4t13Normal * (1 - s22t12Normal * 0.5) + s2t13Normal * s2t13Normal;

  oscillation.averageSurvivalProbabilityNormalMaximum =
    c4t13Normal * (1 - s22t12Normal3SigmaMinimum * 0.5) + s2t13Normal * s2t13Normal;

  oscillation.averageSurvivalProbabilityInverted =
    c4t13Inverted * (1 - s22t12Inverted * 0.5) + s2t13Inverted * s2t13Inverted;
  
  oscillation.averageSurvivalProbability = 
    oscillation.massOrdering === MassOrdering.Normal
      ? oscillation.averageSurvivalProbabilityNormal
      : oscillation.averageSurvivalProbabilityInverted;

  // reinit functions
  oscillation.normalNeutrinoFlavor = (Ev: number, dist: number): number => {
    const oscarg21 = 1.27 * dmsq21Normal * dist * 1000;
    const oscarg31 = 1.27 * dmsq31Normal * dist * 1000;
    const oscarg32 = 1.27 * dmsq32Normal * dist * 1000;

    const supr21 = c4t13Normal * s22t12Normal * Math.sin(oscarg21 / Ev) ** 2;
    const supr31 = s22t13Normal * c2t12Normal * Math.sin(oscarg31 / Ev) ** 2;
    const supr32 = s22t13Normal * s2t12Normal * Math.sin(oscarg32 / Ev) ** 2;

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
    const oscarg21 = 1.27 * dmsq21Inverted * dist * 1000;
    const oscarg31 = 1.27 * dmsq31Inverted * dist * 1000;
    const oscarg32 = 1.27 * dmsq32Inverted * dist * 1000;

    const supr21 = c4t13Inverted * s22t12Inverted * Math.sin(oscarg21 / Ev) ** 2;
    const supr31 = s22t13Inverted * c2t12Inverted * Math.sin(oscarg31 / Ev) ** 2;
    const supr32 = s22t13Inverted * s2t12Inverted * Math.sin(oscarg32 / Ev) ** 2;

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
  s2t12Normal,
  // s2t12Normal3SigmaMinimum,
  s2t12Inverted,
  dmsq21Normal,
  dmsq21Inverted,
  s2t13Normal,
  s2t13Inverted,
  dmsq32Normal,
  dmsq32Inverted,
  dmsq31Normal,
  dmsq31Inverted,
  c4t13Normal,
  c4t13Inverted,
  s22t12Normal,
  // s22t12Normal3SigmaMinimum,
  s22t12Inverted,
  c2t12Normal,
  c2t12Inverted,
  s22t13Normal, 
  s22t13Inverted,
  averageSurvivalProbabilityNormal,
  averageSurvivalProbabilityNormalMaximum,
  averageSurvivalProbabilityInverted,
  normalNeutrinoOscillationSpectrum,
  invertedNeutrinoOscillationSpectrum
} = oscillation;
