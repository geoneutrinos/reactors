import { XSFuncs, XSNames } from "../physics/neutrino-cross-section";
import {
  MassOrdering,
  averageSurvivalProbabilityNormal,
  averageSurvivalProbabilityInverted,
} from "../physics/neutrino-oscillation";
import {
  antineutrinoSpectrum238U,
  antineutrinoSpectrum232Th,
  antineutrinoSpectrum40K,
} from "../antineutrino-spectrum";
import {
  SECONDS_PER_YEAR,
  ISOTOPIC_NATURAL_ABUNDANCE,
} from "../physics/constants";
import { ISOTOPIC_NEUTRINO_LUMINOSITY } from "../physics/derived";

export function mantleGeoSpectrum(
  crossSection: XSNames,
  massOrdering: MassOrdering,
  geoFluxRatios: any,
  crustFlux: any
) {
  const XSFunc = XSFuncs[crossSection];
  const MICROSECOND_PER_SECOND = 1e6;
  const TARGETS = 1e32;

  const TargetYears = TARGETS * SECONDS_PER_YEAR;

  let survivalProbability = {
    [MassOrdering.Inverted]: averageSurvivalProbabilityInverted,
    [MassOrdering.Normal]: averageSurvivalProbabilityNormal,
  }[massOrdering];

  if (crossSection === XSNames.ESMUTAU) {
    survivalProbability = 1 - survivalProbability;
  }

  const { U238flux, ThURatio, KURatio } = geoFluxRatios;

  const geoU = antineutrinoSpectrum238U.map((v, i) => {
    const UCrustFlux = crustFlux.u * MICROSECOND_PER_SECOND; // Convert from cm-2 us-1 to cm-2 s-1
    const crossSection = XSFunc(0.005 + i / 100); // cm2

    return (
      v *
      (UCrustFlux + U238flux) *
      crossSection *
      TargetYears *
      survivalProbability
    );
  });

  const ThMantleFluxIsotopicScale =
    (ISOTOPIC_NEUTRINO_LUMINOSITY.TH232 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) *
    (ISOTOPIC_NATURAL_ABUNDANCE.TH232 / ISOTOPIC_NATURAL_ABUNDANCE.U238);

  const ThMantleFlux = U238flux * ThURatio * ThMantleFluxIsotopicScale;

  const geoTh = antineutrinoSpectrum232Th.map((v, i) => {
    const ThCrustFlux = crustFlux.th * MICROSECOND_PER_SECOND; // Convert from cm-2 us-1 to cm-2 s-1
    const crossSection = XSFunc(0.005 + i / 100); // cm2

    return (
      v *
      (ThCrustFlux + ThMantleFlux) *
      crossSection *
      TargetYears *
      survivalProbability
    );
  });

  const KMantleFluxIsotopicScale =
    (ISOTOPIC_NEUTRINO_LUMINOSITY.K40 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) *
    (ISOTOPIC_NATURAL_ABUNDANCE.K40 / ISOTOPIC_NATURAL_ABUNDANCE.U238);

  const KMantleFlux = U238flux * KURatio * KMantleFluxIsotopicScale;

  const geoK = antineutrinoSpectrum40K.map((v, i) => {
    const KCrustFlux = crustFlux.k * MICROSECOND_PER_SECOND; // Convert from cm-2 us-1 to cm-2 s-1
    const crossSection = XSFunc(0.005 + i / 100); // cm2
    return (
      v *
      (KCrustFlux + KMantleFlux) *
      crossSection *
      TargetYears *
      survivalProbability
    );
  });

  return {
    geoU: geoU,
    geoTh: geoTh,
    geoK: geoK,
  };
}
