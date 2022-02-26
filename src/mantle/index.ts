import {
  CrossSection,
  XSNames,
} from "../physics/neutrino-cross-section";
import { Oscillation } from "../physics/neutrino-oscillation";
import {
  antineutrinoSpectrum235U,
  antineutrinoSpectrum238U,
  antineutrinoSpectrum232Th,
  antineutrinoSpectrum40K,
} from "../antineutrino-spectrum";
import {
  SECONDS_PER_YEAR,
  ISOTOPIC_NATURAL_ABUNDANCE,
} from "../physics/constants";
import { ISOTOPIC_NEUTRINO_LUMINOSITY } from "../physics/derived";
import bins from "../physics/bins";

const MICROSECOND_PER_SECOND = 1e6;
const TARGETS = 1e32;

const TargetYears = TARGETS * SECONDS_PER_YEAR;

const EvBinFronIndex = (i: number) => bins[i];

type CrustFlux = {
  u: number;
  th: number;
  k: number;
}

type GeoNuFluxRatio = {
  U238flux: number, // cm-2 s-1
  ThURatio: number, // no units
  KURatio: number, // no units
}

const extractESEandMuTau = (
  spec: number,
  Ev: number,
  survivalProbability: number,
  crossSection: CrossSection
) => {
  if (crossSection.crossSection !== XSNames.ESTOTAL) {
    return [spec, 0];
  }
  const ESEratio = crossSection.crossSectionElectronAntineutrinoFractionES(Ev);
  const ESMUTauContirbution =
    spec * (1 - ESEratio) * (1 - survivalProbability) * TargetYears;

  spec = spec * ESEratio; // convert spec to only be ESE contribution
  return [spec, ESMUTauContirbution];
};

const getGeoRates = (spectrum: Float32Array, crustFlux: number, mantleFlux: number, survivalProbability: number, crossSection: CrossSection) => {
  const crustSpectrum = new Float32Array(spectrum.length)
  const mantleSpectrum = new Float32Array(spectrum.length)
  const geoSpectrum = new Float32Array(spectrum.length)
  spectrum.forEach((v, i) =>{
    const Ev = EvBinFronIndex(i);
    const CrustFlux = crustFlux * MICROSECOND_PER_SECOND; // Convert from cm-2 us-1 to cm-2 s-1
    const crossSectionArea = crossSection.crossSectionFunction(Ev); // cm2

    const crust = v * CrustFlux * crossSectionArea;
    const mantle = v * mantleFlux * crossSectionArea;

    const [crust_spec, crust_ESMUTauContirbution] = extractESEandMuTau(
      crust,
      Ev,
      survivalProbability,
      crossSection
    );

    const [mantle_spec, mantle_ESMUTauContirbution] = extractESEandMuTau(
      mantle,
      Ev,
      survivalProbability,
      crossSection
    );

    const crust_rate = crust_spec * TargetYears * survivalProbability + crust_ESMUTauContirbution 
    const mantle_rate = mantle_spec * TargetYears * survivalProbability + mantle_ESMUTauContirbution 

    geoSpectrum[i] = crust_rate + mantle_rate;
    crustSpectrum[i] = crust_rate;
    mantleSpectrum[i] = mantle_rate;
  })
  return {geoSpectrum, crustSpectrum, mantleSpectrum}
}

export function mantleGeoSpectrum(
  crossSection: CrossSection,
  oscillation: Oscillation,
  geoFluxRatios: GeoNuFluxRatio,
  crustFlux: CrustFlux
) {
  let survivalProbability = oscillation.averageSurvivalProbability

  if (crossSection.crossSection === XSNames.ESMUTAU) {
    survivalProbability = 1 - survivalProbability;
  }

  const { U238flux, ThURatio, KURatio } = geoFluxRatios;


  const {geoSpectrum: geoU238, crustSpectrum: geo_crustU238, mantleSpectrum: geo_mantleU238}  = getGeoRates(
    antineutrinoSpectrum238U, 
    crustFlux.u, 
    U238flux, 
    survivalProbability, 
    crossSection,
    )


  const U235FluxIsotopicScale =
    (ISOTOPIC_NEUTRINO_LUMINOSITY.U235 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) *
    (ISOTOPIC_NATURAL_ABUNDANCE.U235 / ISOTOPIC_NATURAL_ABUNDANCE.U238);

  const U235MantleFlux = U238flux * U235FluxIsotopicScale;

  const {geoSpectrum: geoU235, crustSpectrum: geo_crustU235, mantleSpectrum: geo_mantleU235} = getGeoRates(
    antineutrinoSpectrum235U ,
    crustFlux.u * U235FluxIsotopicScale,
    U235MantleFlux,
    survivalProbability,
    crossSection
  )


  const ThMantleFluxIsotopicScale =
    (ISOTOPIC_NEUTRINO_LUMINOSITY.TH232 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) *
    (ISOTOPIC_NATURAL_ABUNDANCE.TH232 / ISOTOPIC_NATURAL_ABUNDANCE.U238);

  const ThMantleFlux = U238flux * ThURatio * ThMantleFluxIsotopicScale;

  const {geoSpectrum: geoTh232,crustSpectrum:  geo_crustTh232,mantleSpectrum:  geo_mantleTh232} = getGeoRates(
    antineutrinoSpectrum232Th,
    crustFlux.th,
    ThMantleFlux,
    survivalProbability,
    crossSection,
  )

  const KMantleFluxIsotopicScale =
    (ISOTOPIC_NEUTRINO_LUMINOSITY.K40 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) *
    (ISOTOPIC_NATURAL_ABUNDANCE.K40 / ISOTOPIC_NATURAL_ABUNDANCE.U238);

  const KMantleFlux = U238flux * KURatio * KMantleFluxIsotopicScale;

  const {geoSpectrum: geoK40_beta, crustSpectrum: geo_crustK40_beta,mantleSpectrum:  geo_mantleK40_beta} = getGeoRates(
    antineutrinoSpectrum40K,
    crustFlux.k,
    KMantleFlux,
    survivalProbability,
    crossSection,
  )


  return {
    geo_mantleU238: geo_mantleU238,
    geo_crustU238: geo_crustU238,
    geo_mantleU235: geo_mantleU235,
    geo_crustU235: geo_crustU235,
    geo_mantleTh232: geo_mantleTh232,
    geo_crustTh232: geo_crustTh232,
    geo_mantleK40_beta: geo_mantleK40_beta,
    geo_crustK40_beta: geo_crustK40_beta,
    geoU238: geoU238,
    geoU235: geoU235,
    geoTh232: geoTh232,
    geoK40_beta: geoK40_beta,
  };
}
