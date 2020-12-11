import { memoize } from 'lodash';

export enum MassOrdering {
    Inverted = "Inverted",
    Normal = "Normal",
}


interface VariableOscilationParams {
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
interface OscilationFunctions {
  normalNeutrinoFlavor: (Ev: number, dist: number) => number;
  normalNeutrinoOscilationSpectrum: (dist: number) => Float64Array;
  invertedNeutrinoFlavor: (Ev: number, dist: number) => number;
  invertedNeutrinoOscilationSpectrum: (dist: number) => Float64Array;
  neutrinoOscilationSpectrum: (dist: number) => Float64Array;
}
interface OscilationConfig {
  massOrdering: MassOrdering
}
type OscilationParams = VariableOscilationParams & DerivedOscillationParams;
export type Oscilation = OscilationParams & OscilationFunctions & OscilationConfig;

export let oscilation: Oscilation = {
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
  normalNeutrinoOscilationSpectrum: (dist) => new Float64Array(),
  invertedNeutrinoFlavor: (Ev, dist) => 0,
  invertedNeutrinoOscilationSpectrum: (dist) => new Float64Array(),
  neutrinoOscilationSpectrum: (dist) => new Float64Array(),

  // Config things
  massOrdering: MassOrdering.Normal
}

const defaultOscilationParams: VariableOscilationParams = {
  s2t12: 0.310,
  dmsq21: 7.39e-5,
  s2t13Normal:  0.02241,
  s2t13Inverted: 0.02261,
  dmsq32Normal: 2.449e-3,
  dmsq32Inverted: -2.509e-3,
}

interface OsilationParamsAction{
  arg: keyof VariableOscilationParams | keyof OscilationConfig
  value: number | MassOrdering
}

export const oscilationReducer = (state:Oscilation, action:OsilationParamsAction): Oscilation => {
  const oscilation = { ...state };
  switch (action.arg) {
    case "s2t12":
      {
        let s2t12 = action.value as number;
        oscilation.s2t12 = s2t12;
        oscilation.s22t12 = 4 * s2t12 * (1 - s2t12);
        oscilation.c2t12 = 1 - s2t12;
      }
      break;

    case "dmsq21":
      {
        let dmsq21 = action.value as number;
        let { dmsq32Normal, dmsq32Inverted } = oscilation;

        oscilation.dmsq21 = dmsq21;
        oscilation.dmsq31Normal = dmsq32Normal + dmsq21;
        oscilation.dmsq31Inverted = dmsq32Inverted + dmsq21;
      }
      break;

    case "s2t13Normal":
      {
        let s2t13Normal = action.value  as number;
        oscilation.s2t13Normal = s2t13Normal;
        oscilation.c4t13Normal = (1 - s2t13Normal) ** 2;
        oscilation.s22t13Normal = 4 * s2t13Normal * (1 - s2t13Normal);
      }
      break;
    case "s2t13Inverted":
      {
        let s2t13Inverted = action.value as number;
        oscilation.s2t13Inverted = s2t13Inverted;
        oscilation.c4t13Inverted = (1 - s2t13Inverted) ** 2;
        oscilation.s22t13Inverted = 4 * s2t13Inverted * (1 - s2t13Inverted);
      }
      break;

    case "dmsq32Normal":
      {
        let dmsq32Normal = action.value as number;
        let { dmsq21 } = oscilation;
        oscilation.dmsq32Normal = dmsq32Normal;
        oscilation.dmsq31Normal = dmsq32Normal + dmsq21;
      }
      break;

    case "dmsq32Inverted":
      {
        let dmsq32Inverted = action.value as number;
        let { dmsq21 } = oscilation;
        oscilation.dmsq32Inverted = dmsq32Inverted;
        oscilation.dmsq31Inverted = dmsq32Inverted + dmsq21;
      }
      break;
    case "massOrdering":{
      let massOrdering = action.value as MassOrdering;
      oscilation.massOrdering = massOrdering;
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
  } = oscilation;

  oscilation.averageSurvivalProbabilityNormal =
    c4t13Normal * (1 - s22t12 * 0.5) + s2t13Normal * s2t13Normal;
  oscilation.averageSurvivalProbabilityInverted =
    c4t13Inverted * (1 - s22t12 * 0.5) + s2t13Inverted * s2t13Inverted;
  oscilation.averageSurvivalProbability = 
    oscilation.massOrdering === MassOrdering.Normal
      ? oscilation.averageSurvivalProbabilityNormal
      : oscilation.averageSurvivalProbabilityInverted;

  // reinit functions
  oscilation.normalNeutrinoFlavor = (Ev: number, dist: number): number => {
    const oscarg21 = 1.27 * dmsq21 * dist * 1000;
    const oscarg31 = 1.27 * dmsq31Normal * dist * 1000;
    const oscarg32 = 1.27 * dmsq32Normal * dist * 1000;

    const supr21 = c4t13Normal * s22t12 * Math.sin(oscarg21 / Ev) ** 2;
    const supr31 = s22t13Normal * c2t12 * Math.sin(oscarg31 / Ev) ** 2;
    const supr32 = s22t13Normal * s2t12 * Math.sin(oscarg32 / Ev) ** 2;

    return 1 - supr21 - supr31 - supr32;
  };
  oscilation.normalNeutrinoOscilationSpectrum = memoize(
    (dist: number): Float64Array => {
      const oscspec = new Float64Array(1000);
      oscspec.fill(0);

      return oscspec.map((value, index) =>
        oscilation.normalNeutrinoFlavor((index + 1) * 0.01, dist)
      );
    }
  );

  oscilation.invertedNeutrinoFlavor = (Ev: number, dist: number): number => {
    const oscarg21 = 1.27 * dmsq21 * dist * 1000;
    const oscarg31 = 1.27 * dmsq31Inverted * dist * 1000;
    const oscarg32 = 1.27 * dmsq32Inverted * dist * 1000;

    const supr21 = c4t13Inverted * s22t12 * Math.sin(oscarg21 / Ev) ** 2;
    const supr31 = s22t13Inverted * c2t12 * Math.sin(oscarg31 / Ev) ** 2;
    const supr32 = s22t13Inverted * s2t12 * Math.sin(oscarg32 / Ev) ** 2;

    return 1 - supr21 - supr31 - supr32;
  };
  oscilation.invertedNeutrinoOscilationSpectrum = memoize(
    (dist: number): Float64Array => {
      const oscspec = new Float64Array(1000);
      oscspec.fill(0);

      return oscspec.map((value, index) =>
        oscilation.invertedNeutrinoFlavor((index + 1) * 0.01, dist)
      );
    }
  );

  oscilation.neutrinoOscilationSpectrum =
    oscilation.massOrdering === MassOrdering.Normal
      ? oscilation.normalNeutrinoOscilationSpectrum
      : oscilation.invertedNeutrinoOscilationSpectrum;
  return oscilation;
}

let arg: keyof VariableOscilationParams;
for (arg in defaultOscilationParams){
  let value = defaultOscilationParams[arg]
  oscilation = oscilationReducer(oscilation, {arg:arg, value:value})
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
  normalNeutrinoOscilationSpectrum,
  invertedNeutrinoOscilationSpectrum
} = oscilation;