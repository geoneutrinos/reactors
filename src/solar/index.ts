import boron8 from "./boron8.json";

import { sum, zip, range, flatten, groupBy } from "lodash";

import {
  CrossSection,
  XSNamesNormal,
  crossSectionElasticScattering,
  NeutrinoType,
} from "../physics/neutrino-cross-section";
import { SECONDS_PER_YEAR } from "../physics/constants";

// we use the default cores to see what the LF date data "looks like"
import { defaultCores } from "../reactor-cores";

// at some point other ephemerical caluclations should be added here

const boron8FluxStatU = 0.014 / 2.345;
const boron8FluxSysU = 0.036 / 2.345;
const boron8U = Math.hypot(boron8FluxStatU, boron8FluxSysU);

export const boron8Bins = boron8.map(([bin, _spec]) => bin);

export const times = flatten(
  range(0, 365, 2).map((jd) => {
    let hours = range(0, 24).map((hour) => {
      let d = new Date("2021-01-01T00:30:00Z");

      d.setUTCDate(jd);
      d.setUTCHours(hour);

      return d;
    });
    return hours;
  })
);

interface Boron8Data {
  boron8Flux: number;
  boron8Rate: number[];
  boron8Ke: number[];
  boron8NIU: number;
  boron8RateU: number[];
  boron8NIUU: number;
  averageSolarDistance: number;
}

interface Boron8Funcs {
  updateRate: (
    this: Boron8,
    crossSection: CrossSection,
    reactorLF: ReactorLF
  ) => Boron8;
}

type Boron8 = Boron8Data & Boron8Funcs;

export const earthSunDist = (date: Date) => {
  const JD = date.valueOf() / 86400000 - 0.5 + 2440588;
  const n = JD - 2451545;
  const g = 357.528 + 0.9856003 * n;
  const R =
    1.00014 -
    0.01671 * Math.cos((g * Math.PI) / 180) -
    0.00014 * Math.cos((g * Math.PI) / 180) ** 2;
  return R;
};

export const earthSunDistances = times.map((date) => earthSunDist(date));

const averageMonthlyDistance = Object.fromEntries(
  Object.entries(groupBy(times, (date) => date.getUTCMonth())).map(
    ([month, dates]) => {
      const avg = sum(dates.map((date) => earthSunDist(date) / dates.length));
      return [month, avg];
    }
  )
);

const b8RateToKE = (b8Rate: number[], crossSection: CrossSection) => {
  const esTmin = crossSection.elasticScatteringTMin;
  const esTmax = crossSection.elasticScatteringTMax;
  const eVtoK = boron8Bins.map((bin) => {
    const Tspec = boron8Bins.map((Tbin) =>
      Tbin < esTmax
        ? Tbin > esTmin
          ? crossSectionElasticScattering(
              bin,
              NeutrinoType.electronNeutrino,
              Tbin - 0.05,
              Tbin + 0.05
            )
          : 0
        : 0
    );
    const totalT = sum(Tspec);
    return Tspec.map((v) => (totalT === 0 ? 0 : v / totalT));
  });
  const newRates = b8Rate.map((v, i) => eVtoK[i].map((v2) => v * v2));
  const integratedBins = zip(...newRates).map((v) => sum(v));
  return integratedBins.map((x) => x * 1e1 * SECONDS_PER_YEAR * 1e32);
};

interface ReactorLF {
  start: Date;
  end: Date;
}

export const defaultBoron8: Boron8 = {
  boron8Flux: 2.345e6, // cm-2 s-1
  boron8Rate: [],
  boron8NIU: 0,
  boron8Ke: [],
  boron8RateU: [],
  boron8NIUU: 0,
  averageSolarDistance: 0,
  updateRate: function (
    this: Boron8,
    crossSection: CrossSection,
    reactorLF: ReactorLF
  ) {
    const newBoron8 = { ...this };

    newBoron8.averageSolarDistance = Object.values(defaultCores)[0]
      .loads.filter(
        (load) => load.date >= reactorLF.start && load.date <= reactorLF.end
      )
      .map((load) => load.date)
      .reduce((accumulator, date, _idx, array) => {
        return (
          accumulator +
          averageMonthlyDistance[date.getUTCMonth()] / array.length
        );
      }, 0);

    newBoron8.boron8Rate = boron8.map(
      ([bin, spec]) =>
        (crossSection[XSNamesNormal.ESNORMAL](bin) *
          spec *
          this.boron8Flux *
          1) /
        newBoron8.averageSolarDistance ** 2
    );
    newBoron8.boron8RateU = boron8.map(
      ([bin, spec]) =>
        ((crossSection[XSNamesNormal.ESNORMAL](bin) *
          spec *
          this.boron8Flux *
          1) /
          newBoron8.averageSolarDistance ** 2) *
        boron8U
    );
    newBoron8.boron8NIU = sum(newBoron8.boron8Rate) * SECONDS_PER_YEAR * 1e32; // targets
    newBoron8.boron8NIUU = sum(newBoron8.boron8RateU) * SECONDS_PER_YEAR * 1e32; // targets
    newBoron8.boron8Ke = b8RateToKE(newBoron8.boron8Rate, crossSection);
    return newBoron8;
  },
};
