import antineutrinoSpectrum40KData from "./data/AntineutrinoSpectrum_40K.knt.json";
import antineutrinoSpectrum232ThData from "./data/AntineutrinoSpectrum_232Th.knt.json";
import antineutrinoSpectrum235UData from "./data/AntineutrinoSpectrum_235U.knt.json";
import antineutrinoSpectrum238UData from "./data/AntineutrinoSpectrum_238U.knt.json";

import { SECONDS_PER_YEAR } from "../physics/constants";

import { XSFuncs, CrossSection } from "../physics/neutrino-cross-section";

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
  const sliceSize = Math.floor(binWidth * 1000);

  return output.map((v, i) => {
    return antineutrinoSpectrum
      .slice(i * sliceSize, i * sliceSize + sliceSize)
      .reduce((p, c) => p + c * 100, 0);
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
  1000
);
export const antineutrinoSpectrum232Th = resample(
  antineutrinoSpectrum232ThData,
  0,
  10,
  1000
);
export const antineutrinoSpectrum235U = resample(
  antineutrinoSpectrum235UData,
  0,
  10,
  1000
);
export const antineutrinoSpectrum238U = resample(
  antineutrinoSpectrum238UData,
  0,
  10,
  1000
);

function rateToFlux(spectrum: number[], crossSection: CrossSection): number {
  const targets = 1e32;
  const rate_to_flux_n = spectrum.reduce((p, v) => p + v, 0);
  const rate_to_flux_d = spectrum
    .map((v, i) => {
      return v * crossSection(0.0005 + i / 1000);
    })
    .reduce((p, v) => p + v, 0);
  return (1 / (targets * SECONDS_PER_YEAR)) * (rate_to_flux_n / rate_to_flux_d);
}

export const rateToFlux238U = Object.fromEntries(
  Object.entries(XSFuncs).map(([key, val]) => [
    key,
    rateToFlux(antineutrinoSpectrum238UData, val),
  ])
);
export const rateToFlux235U = Object.fromEntries(
  Object.entries(XSFuncs).map(([key, val]) => [
    key,
    rateToFlux(antineutrinoSpectrum235UData, val),
  ])
);
export const rateToFlux232Th = Object.fromEntries(
  Object.entries(XSFuncs).map(([key, val]) => [
    key,
    rateToFlux(antineutrinoSpectrum232ThData, val),
  ])
);
export const rateToFlux40K = Object.fromEntries(
  Object.entries(XSFuncs).map(([key, val]) => [
    key,
    rateToFlux(antineutrinoSpectrum40KData, val),
  ])
);
