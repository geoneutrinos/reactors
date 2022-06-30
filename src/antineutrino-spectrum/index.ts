import antineutrinoSpectrum40KData from "./data/AntineutrinoSpectrum_40K.knt.json";
import antineutrinoSpectrum232ThData from "./data/AntineutrinoSpectrum_232Th.knt.json";
import antineutrinoSpectrum235UData from "./data/AntineutrinoSpectrum_235U.knt.json";
import antineutrinoSpectrum238UData from "./data/AntineutrinoSpectrum_238U.knt.json";

import { SECONDS_PER_YEAR } from "../physics/constants";

import { CrossSectionFunc, XSNames, CrossSection, crossSection } from "../physics/neutrino-cross-section";

import {binCount} from "../physics/bins";

//interface RateToFlux {
//  IBDSV2003: number;
//  IBDVB1999: number;
//  ESANTI: number;
//  ESMUTAU: number;
//}

/**
 *
 * @param antineutrinoSpectrum
 * @param start
 * @param stop
 * @param size
 */
function resample(
  antineutrinoSpectrum: number[],
  start: number,
  stop: number,
  size: number
): Float32Array {
  const output = new Float32Array(size).fill(0);
  const binWidth = (stop - start) / size;
  const inputBinWidth = 1/1000
  const sliceSize = Math.floor(binWidth/inputBinWidth);

  return output.map((v, i) => {
    return antineutrinoSpectrum
      .slice(i * sliceSize, i * sliceSize + sliceSize)
      .reduce((p, c) => p + c * binCount/10, 0);
  });
}

export const rawAntineutrinoSpectrum = {
  "40K": antineutrinoSpectrum40KData,
  "238U": antineutrinoSpectrum238UData,
  "235U": antineutrinoSpectrum235UData,
  "232Th": antineutrinoSpectrum232ThData,
}

export const antineutrinoSpectrum40K = resample(
  antineutrinoSpectrum40KData,
  0,
  10,
  binCount
);
export const antineutrinoSpectrum232Th = resample(
  antineutrinoSpectrum232ThData,
  0,
  10,
  binCount
);
export const antineutrinoSpectrum235U = resample(
  antineutrinoSpectrum235UData,
  0,
  10,
  binCount
);
export const antineutrinoSpectrum238U = resample(
  antineutrinoSpectrum238UData,
  0,
  10,
  binCount
);

const averageNeutrinoEnergy = (spectrum: number[]):number => {
  const num = spectrum.reduce((p, v, i) => ((0.0005 + i /1000) * v) + p)
  const dem = spectrum.reduce((p, v) => ( v + p))
  return num/dem;
}

export const averageNeutrinoEnergy238U = averageNeutrinoEnergy(antineutrinoSpectrum238UData)
export const averageNeutrinoEnergy235U = averageNeutrinoEnergy(antineutrinoSpectrum235UData)
export const averageNeutrinoEnergy232Th = averageNeutrinoEnergy(antineutrinoSpectrum232ThData)
export const averageNeutrinoEnergy40K = averageNeutrinoEnergy(antineutrinoSpectrum40KData)

function rateToFluxCalc(spectrum: number[], crossSection: CrossSectionFunc): number {
  const targets = 1e32;
  const rate_to_flux_n = spectrum.reduce((p, v) => p + v, 0);
  //TODO assumption about bins
  const rate_to_flux_d = spectrum
    .map((v, i) => {
      return v * crossSection(0.0005 + i / 1000);
    })
    .reduce((p, v) => p + v, 0);
  return (1 / (targets * SECONDS_PER_YEAR)) * (rate_to_flux_n / rate_to_flux_d);
}

interface RateToFlux {
  [key: string]: number| number[]
  spectrum: number[]
}

export const rateToFluxReducer = (r2f:RateToFlux, crossSection:CrossSection): RateToFlux => {
  const newr2f = {...r2f}
  Object.values(XSNames).forEach((name) => {
    newr2f[name as keyof RateToFlux] = rateToFluxCalc(r2f.spectrum, crossSection[name as keyof CrossSection] as CrossSectionFunc)
  })
  return newr2f
}

const defaulTrateToFlux238U:RateToFlux = {
  spectrum: antineutrinoSpectrum238UData
}
const defaulTrateToFlux235U:RateToFlux = {
  spectrum: antineutrinoSpectrum235UData
}
const defaulTrateToFlux232Th:RateToFlux = {
  spectrum: antineutrinoSpectrum232ThData
}
const defaulTrateToFlux40K:RateToFlux = {
  spectrum: antineutrinoSpectrum40KData
}
export const rateToFlux238U = rateToFluxReducer(defaulTrateToFlux238U, crossSection)
export const rateToFlux235U = rateToFluxReducer(defaulTrateToFlux235U, crossSection)
export const rateToFlux232Th = rateToFluxReducer(defaulTrateToFlux232Th, crossSection)
export const rateToFlux40K = rateToFluxReducer(defaulTrateToFlux40K, crossSection)
