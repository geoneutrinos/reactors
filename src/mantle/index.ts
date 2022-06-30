import { CrossSection, XSNames } from "../physics/neutrino-cross-section";
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
import {
  MANTLE_GEOPHYSICAL_RESPONSE,
  MANTLE_MASS,
  ISOTOPIC_DECAY_HEATING,
} from "./geophysics";
import { ISOTOPIC_NEUTRINO_LUMINOSITY } from "../physics/derived";
import bins, { binWidth } from "../physics/bins";
import { sum } from "lodash";

const MICROSECOND_PER_SECOND = 1e6;
const TARGETS = 1e32;

const TargetYears = TARGETS * SECONDS_PER_YEAR;

const EvBinFronIndex = (i: number) => bins[i];

interface CrustFlux {
  u: number;
  th: number;
  k: number;
}

interface GeoUncertainty {
  U238: number;
  U235: number;
  Th232: number;
  K40Beta: number;
}

type GeoHeating = GeoUncertainty;

interface GeoNuFluxRatio {
  U238flux: number; // cm-2 s-1
  ThURatio: number; // no units
  KURatio: number; // no units
}

interface GeoSignal {
  spectrum: Float32Array;
  NIU: number;
  spectrumUncertainty: Float32Array;
  NIUUncertainty: number;
}

interface GeoCrustMantle extends GeoSignal {
  U238: GeoSignal;
  U235: GeoSignal;
  Th232: GeoSignal;
  K40Beta: GeoSignal;
}

interface GeoInterface {
  crust: GeoCrustMantle;
  mantle: GeoCrustMantle;
  total: GeoCrustMantle;
  heating: GeoHeating;
}

// TODO Temp constants until passed in

export const mantleUncertainty: GeoUncertainty = {
  U238: 0.33,
  U235: 0.33,
  Th232: 0.33,
  K40Beta: 0.33,
};
export const crustUncertainty: GeoUncertainty = {
  U238: 0.27,
  U235: 0.27,
  Th232: 0.33,
  K40Beta: 0.25,
};

const getGeoSignal = (
  spectrum: Float32Array,
  uncertainty: number
): GeoSignal => {
  const spectrumUncertainty = spectrum.map((v) => v * uncertainty);
  return {
    spectrum: spectrum,
    NIU: sum(spectrum) * binWidth,
    spectrumUncertainty: spectrumUncertainty,
    NIUUncertainty: sum(spectrumUncertainty) * binWidth,
  };
};

const totalCrustMantleGeoSignal = (
  crust: GeoSignal,
  mantle: GeoSignal
): GeoSignal => {
  const spectrumUncertainty = crust.spectrumUncertainty.map((v, i) =>
    Math.hypot(v, mantle.spectrumUncertainty[i])
  );
  return {
    spectrum: crust.spectrum.map((v, i) => v + mantle.spectrum[i]),
    NIU: crust.NIU + mantle.NIU,
    spectrumUncertainty: spectrumUncertainty,
    NIUUncertainty: sum(spectrumUncertainty) * binWidth,
  };
};

const addTotals = (
  geoSignal: Omit<GeoCrustMantle, keyof GeoSignal>
): GeoCrustMantle => {
  const spectrum = geoSignal.U238.spectrum.map(
    (v, i) =>
      v +
      geoSignal.U235.spectrum[i] +
      geoSignal.Th232.spectrum[i] +
      geoSignal.K40Beta.spectrum[i]
  );
  const NIU = sum(spectrum) * binWidth;
  const spectrumUncertainty = geoSignal.U238.spectrumUncertainty.map(
    (v, i) =>
      v +
      geoSignal.U235.spectrumUncertainty[i] +
      geoSignal.Th232.spectrumUncertainty[i] +
      geoSignal.K40Beta.spectrumUncertainty[i]
  );
  const NIUUncertainty = sum(spectrumUncertainty) * binWidth;
  return {
    ...geoSignal,
    spectrum,
    NIU,
    spectrumUncertainty,
    NIUUncertainty,
  };
};

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

const getGeoRates = (
  spectrum: Float32Array,
  crustFlux: number,
  mantleFlux: number,
  survivalProbability: number,
  crossSection: CrossSection
) => {
  const crustSpectrum = new Float32Array(spectrum.length);
  const mantleSpectrum = new Float32Array(spectrum.length);
  spectrum.forEach((v, i) => {
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

    const crust_rate =
      crust_spec * TargetYears * survivalProbability +
      crust_ESMUTauContirbution;
    const mantle_rate =
      mantle_spec * TargetYears * survivalProbability +
      mantle_ESMUTauContirbution;

    crustSpectrum[i] = crust_rate;
    mantleSpectrum[i] = mantle_rate;
  });
  return { crustSpectrum, mantleSpectrum };
};

export function geoSpectrum(
  crossSection: CrossSection,
  oscillation: Oscillation,
  geoFluxRatios: GeoNuFluxRatio,
  crustFlux: CrustFlux
): GeoInterface {
  let survivalProbability = oscillation.averageSurvivalProbability;

  if (crossSection.crossSection === XSNames.ESMUTAU) {
    survivalProbability = 1 - survivalProbability;
  }

  const { U238flux, ThURatio, KURatio } = geoFluxRatios;

  const {
    crustSpectrum: crustU238Spectrum,
    mantleSpectrum: mantleU238Spectrum,
  } = getGeoRates(
    antineutrinoSpectrum238U,
    crustFlux.u,
    U238flux,
    survivalProbability,
    crossSection
  );

  const mantleHeatingU238 = (U238flux / ISOTOPIC_NEUTRINO_LUMINOSITY.U238 / MANTLE_GEOPHYSICAL_RESPONSE) * ISOTOPIC_DECAY_HEATING.U238 * MANTLE_MASS

  const U235FluxIsotopicScale =
    (ISOTOPIC_NEUTRINO_LUMINOSITY.U235 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) *
    (ISOTOPIC_NATURAL_ABUNDANCE.U235 / ISOTOPIC_NATURAL_ABUNDANCE.U238);

  const U235MantleFlux = U238flux * U235FluxIsotopicScale;

  const mantleHeatingU235 = (U235MantleFlux / ISOTOPIC_NEUTRINO_LUMINOSITY.U235 / MANTLE_GEOPHYSICAL_RESPONSE) * ISOTOPIC_DECAY_HEATING.U235 * MANTLE_MASS

  const {
    crustSpectrum: crustU235Spectrum,
    mantleSpectrum: mantleU235Spectrum,
  } = getGeoRates(
    antineutrinoSpectrum235U,
    crustFlux.u * U235FluxIsotopicScale,
    U235MantleFlux,
    survivalProbability,
    crossSection
  );

  const ThMantleFluxIsotopicScale =
    (ISOTOPIC_NEUTRINO_LUMINOSITY.TH232 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) *
    (ISOTOPIC_NATURAL_ABUNDANCE.TH232 / ISOTOPIC_NATURAL_ABUNDANCE.U238);

  const ThMantleFlux = U238flux * ThURatio * ThMantleFluxIsotopicScale;

  const mantleHeatingTh232 = (ThMantleFlux / ISOTOPIC_NEUTRINO_LUMINOSITY.TH232 / MANTLE_GEOPHYSICAL_RESPONSE) * ISOTOPIC_DECAY_HEATING.TH232 * MANTLE_MASS


  const {
    crustSpectrum: crustTh232Spectrum,
    mantleSpectrum: mantleTh232Spectrum,
  } = getGeoRates(
    antineutrinoSpectrum232Th,
    crustFlux.th,
    ThMantleFlux,
    survivalProbability,
    crossSection
  );

  const KMantleFluxIsotopicScale =
    (ISOTOPIC_NEUTRINO_LUMINOSITY.K40 / ISOTOPIC_NEUTRINO_LUMINOSITY.U238) *
    (ISOTOPIC_NATURAL_ABUNDANCE.K40 / ISOTOPIC_NATURAL_ABUNDANCE.U238);

  const KMantleFlux = U238flux * KURatio * KMantleFluxIsotopicScale;

  const mantleHeatingK40 = (KMantleFlux / ISOTOPIC_NEUTRINO_LUMINOSITY.K40 / MANTLE_GEOPHYSICAL_RESPONSE) * ISOTOPIC_DECAY_HEATING.K40beta * MANTLE_MASS
  
  const {
    crustSpectrum: crustK40BetaSpectrum,
    mantleSpectrum: mantleK40BetaSpectrum,
  } = getGeoRates(
    antineutrinoSpectrum40K,
    crustFlux.k,
    KMantleFlux,
    survivalProbability,
    crossSection
  );

  const mantleBase = {
    U238: getGeoSignal(mantleU238Spectrum, mantleUncertainty.U238),
    U235: getGeoSignal(mantleU235Spectrum, mantleUncertainty.U235),
    Th232: getGeoSignal(mantleTh232Spectrum, mantleUncertainty.Th232),
    K40Beta: getGeoSignal(mantleK40BetaSpectrum, mantleUncertainty.K40Beta),
  };
  const mantle = addTotals(mantleBase);

  const crustBase = {
    U238: getGeoSignal(crustU238Spectrum, crustUncertainty.U238),
    U235: getGeoSignal(crustU235Spectrum, crustUncertainty.U235),
    Th232: getGeoSignal(crustTh232Spectrum, crustUncertainty.Th232),
    K40Beta: getGeoSignal(crustK40BetaSpectrum, crustUncertainty.K40Beta),
  };
  const crust = addTotals(crustBase);

  const totalBase = {
    U238: totalCrustMantleGeoSignal(crust.U238, mantle.U238),
    U235: totalCrustMantleGeoSignal(crust.U235, mantle.U235),
    Th232: totalCrustMantleGeoSignal(crust.Th232, mantle.Th232),
    K40Beta: totalCrustMantleGeoSignal(crust.K40Beta, mantle.K40Beta),
  };
  const total = addTotals(totalBase);

  return {
    mantle: mantle,
    crust: crust,
    total: total,
    heating: {
      U238: mantleHeatingU238,
      U235: mantleHeatingU235,
      Th232: mantleHeatingTh232,
      K40Beta: mantleHeatingK40,
    }
  };
}
