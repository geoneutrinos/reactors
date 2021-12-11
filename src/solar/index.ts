import boron8 from "./boron8.json";

import { sum, zip } from "lodash";

import {
  CrossSection,
  XSNamesNormal,
  crossSectionElasticScattering,
  NeutrinoType,
} from "../physics/neutrino-cross-section";
import { SECONDS_PER_YEAR } from "../physics/constants";

// at some point other ephemerical caluclations should be added here

export const boron8Bins = boron8.map(([bin, spec]) => bin);

interface Boron8Data {
  boron8Flux: number;
  boron8Rate: number[];
  boron8Ke: number[];
  boron8NIU: number;
}

interface Boron8Funcs {
  updateRate: (this: Boron8, crossSection: CrossSection) => Boron8;
}

type Boron8 = Boron8Data & Boron8Funcs;

const b8RateToKE = (b8Rate: number[], crossSection: CrossSection) => {
  const esTmin = crossSection.elasticScatteringTMin;
  const esTmax = crossSection.elasticScatteringTMax;
  const eVtoK = boron8Bins.map((bin) => {
    const Tspec = boron8Bins.map((Tbin) =>
      Tbin < esTmin
        ? 0
      Tbin > esTmax
        ? 0
        : crossSectionElasticScattering(
            bin,
            NeutrinoType.electronNeutrino,
            Tbin - 0.05,
            Tbin + 0.05
          )
    );
    const totalT = sum(Tspec);
    return Tspec.map((v) => (totalT === 0 ? 0 : v / totalT));
  });
  const newRates = b8Rate.map((v, i) => eVtoK[i].map((v2) => v * v2));
  const integratedBins = zip(...newRates).map((v) => sum(v));
  return integratedBins.map((x) => x * 1e1 * SECONDS_PER_YEAR * 1e32);
};

export const defaultBoron8: Boron8 = {
  boron8Flux: 2.345e6, // cm-2 s-1
  boron8Rate: [],
  boron8NIU: 0,
  boron8Ke: [],
  updateRate: function (this: Boron8, crossSection: CrossSection) {
    const newBoron8 = { ...this };
    newBoron8.boron8Rate = boron8.map(
      ([bin, spec]) =>
        crossSection[XSNamesNormal.ESNORMAL](bin) * spec * this.boron8Flux
    );
    newBoron8.boron8NIU = sum(newBoron8.boron8Rate) * SECONDS_PER_YEAR * 1e32; // targets
    newBoron8.boron8Ke = b8RateToKE(newBoron8.boron8Rate, crossSection);
    return newBoron8;
  },
};
