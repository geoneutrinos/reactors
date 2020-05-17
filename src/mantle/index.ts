import {XSFuncs, XSNames} from "../physics/neutrino-cross-section";
import { averageSurvivalProbabilityNormal, averageSurvivalProbabilityInverted } from '../physics/neutrino-oscillation';
import { antineutrinoSpectrum238U, antineutrinoSpectrum232Th, antineutrinoSpectrum40K } from '../antineutrino-spectrum';
import { SECONDS_PER_YEAR, ISOTOPIC_NATURAL_ABUNDANCE } from '../physics/constants';
import { ISOTOPIC_NEUTRINO_LUMINOSITY } from '../physics/derived';

enum MassOrdering {
    inverted = "inverted",
    normal = "normal",
}

export function mantleGeoSpectrum(crossSection:XSNames, massOrdering:MassOrdering, geoFluxRatios:any, crustFlux:any){
  const XSFunc = XSFuncs[crossSection]

  const survivalProbability = {
    "inverted": averageSurvivalProbabilityInverted,
    "normal": averageSurvivalProbabilityNormal,
  }[massOrdering]

  const uMantleFlux = geoFluxRatios.U238flux;
  const geoU = antineutrinoSpectrum238U.map((v, i) => {
    return v * (crustFlux.u * 1e6 + uMantleFlux) * SECONDS_PER_YEAR * XSFunc((0.005 + i / 100)) * 1e32 * survivalProbability;
  })
  const thMantleFlux = uMantleFlux * geoFluxRatios.ThURatio * (ISOTOPIC_NEUTRINO_LUMINOSITY.TH232 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) * (ISOTOPIC_NATURAL_ABUNDANCE.TH232 / ISOTOPIC_NATURAL_ABUNDANCE.U238);
  const geoTh = antineutrinoSpectrum232Th.map((v, i) => {
    return v * (crustFlux.th * 1e6 + thMantleFlux) * SECONDS_PER_YEAR * XSFunc((0.005 + i / 100)) * 1e32 * survivalProbability;
  })
  const kMantleFlux = uMantleFlux * geoFluxRatios.KURatio * (ISOTOPIC_NEUTRINO_LUMINOSITY.K40 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) * (ISOTOPIC_NATURAL_ABUNDANCE.K40 / ISOTOPIC_NATURAL_ABUNDANCE.U238);
  const geoK = antineutrinoSpectrum40K.map((v, i) => {
    return v * (crustFlux.k * 1e6 + kMantleFlux) * SECONDS_PER_YEAR * XSFunc((0.005 + i / 100)) * 1e32 * survivalProbability;
  })
  return {
      geoU: geoU,
      geoTh: geoTh,
      geoK: geoK
  }
}