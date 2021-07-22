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

const MICROSECOND_PER_SECOND = 1e6;
const TARGETS = 1e32;

const TargetYears = TARGETS * SECONDS_PER_YEAR;

const EvBinFronIndex = (i: number) => 0.005 + i / 100;

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

export function mantleGeoSpectrum(
  crossSection: CrossSection,
  oscillation: Oscillation,
  geoFluxRatios: any,
  crustFlux: any
) {
  const XSFunc = crossSection.crossSectionFunction

  let survivalProbability = oscillation.averageSurvivalProbability

  if (crossSection.crossSection === XSNames.ESMUTAU) {
    survivalProbability = 1 - survivalProbability;
  }

  const { U238flux, ThURatio, KURatio } = geoFluxRatios;

  const geoU238 = antineutrinoSpectrum238U.map((v, i) => {
    const Ev = EvBinFronIndex(i);
    const UCrustFlux = crustFlux.u * MICROSECOND_PER_SECOND; // Convert from cm-2 us-1 to cm-2 s-1
    const crossSectionArea = XSFunc(Ev); // cm2

    const bin = v * (UCrustFlux + U238flux) * crossSectionArea;

    const [spec, ESMUTauContirbution] = extractESEandMuTau(
      bin,
      Ev,
      survivalProbability,
      crossSection
    );

    return spec * TargetYears * survivalProbability + ESMUTauContirbution;
  });

  const U235FluxIsotopicScale =
    (ISOTOPIC_NEUTRINO_LUMINOSITY.U235 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) *
    (ISOTOPIC_NATURAL_ABUNDANCE.U235 / ISOTOPIC_NATURAL_ABUNDANCE.U238);

  const U235MantleFlux = U238flux * U235FluxIsotopicScale;

  const geoU235 = antineutrinoSpectrum235U.map((v, i) => {
    const Ev = EvBinFronIndex(i);
    const U235CrustFlux = crustFlux.u * U235FluxIsotopicScale * MICROSECOND_PER_SECOND; // Convert from cm-2 us-1 to cm-2 s-1
    const crossSectionArea = XSFunc(Ev); // cm2

    const bin = v * (U235CrustFlux + U235MantleFlux) * crossSectionArea;

    const [spec, ESMUTauContirbution] = extractESEandMuTau(
      bin,
      Ev,
      survivalProbability,
      crossSection
    );

    return spec * TargetYears * survivalProbability + ESMUTauContirbution;
  });

  const ThMantleFluxIsotopicScale =
    (ISOTOPIC_NEUTRINO_LUMINOSITY.TH232 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) *
    (ISOTOPIC_NATURAL_ABUNDANCE.TH232 / ISOTOPIC_NATURAL_ABUNDANCE.U238);

  const ThMantleFlux = U238flux * ThURatio * ThMantleFluxIsotopicScale;

  const geoTh232 = antineutrinoSpectrum232Th.map((v, i) => {
    const Ev = EvBinFronIndex(i);
    const ThCrustFlux = crustFlux.th * MICROSECOND_PER_SECOND; // Convert from cm-2 us-1 to cm-2 s-1
    const crossSectionArea = XSFunc(Ev); // cm2

    const bin = v * (ThCrustFlux + ThMantleFlux) * crossSectionArea;

    const [spec, ESMUTauContirbution] = extractESEandMuTau(
      bin,
      Ev,
      survivalProbability,
      crossSection
    );

    return spec * TargetYears * survivalProbability + ESMUTauContirbution;
  });

  const KMantleFluxIsotopicScale =
    (ISOTOPIC_NEUTRINO_LUMINOSITY.K40 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) *
    (ISOTOPIC_NATURAL_ABUNDANCE.K40 / ISOTOPIC_NATURAL_ABUNDANCE.U238);

  const KMantleFlux = U238flux * KURatio * KMantleFluxIsotopicScale;

  const geoK40_beta = antineutrinoSpectrum40K.map((v, i) => {
    const Ev = EvBinFronIndex(i);
    const KCrustFlux = crustFlux.k * MICROSECOND_PER_SECOND; // Convert from cm-2 us-1 to cm-2 s-1
    const crossSectionArea = XSFunc(Ev); // cm2

    let bin = v * (KCrustFlux + KMantleFlux) * crossSectionArea;

    const [spec, ESMUTauContirbution] = extractESEandMuTau(
      bin,
      Ev,
      survivalProbability,
      crossSection
    );

    return spec * TargetYears * survivalProbability + ESMUTauContirbution;
  });

  return {
    geoU238: geoU238,
    geoU235: geoU235,
    geoTh232: geoTh232,
    geoK40_beta: geoK40_beta,
  };
}
