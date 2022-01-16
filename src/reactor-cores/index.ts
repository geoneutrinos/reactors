import iaeaDatabase from "./reactor-database/reactors.json";
import { partialInteractionRate } from "../physics/reactor-antineutrinos";
import { neutrinoEnergyFor } from "../physics/reactor-antineutrinos/huber-muller";
import {
  XSNames,
  CrossSection,
} from "../physics/neutrino-cross-section";
import {
  FISSION_ENERGIES,
  ELEMENTARY_CHARGE,
  Isotopes,
} from "../physics/constants";
import { zip, sum } from "lodash";
import { project } from "ecef-projector";
import { Oscillation } from "../physics/neutrino-oscillation";
import bins, {binWidth, binCount} from "../physics/bins";

const {reactors: cores, times, loads } = iaeaDatabase;

export { cores, times, loads };

const SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60;


const cos_deg = (deg: number) => Math.cos(deg * (Math.PI / 180));

interface ReactorFractions {
  [Isotopes.U235]: number;
  [Isotopes.U238]: number;
  [Isotopes.PU239]: number;
  [Isotopes.PU241]: number;
}

interface FissionFractions extends ReactorFractions {}
interface PowerFractions extends ReactorFractions {}

export const POWER_FRACTIONS: { [type: string]: PowerFractions } = {
  LEU: {
    U235: 0.56,
    U238: 0.08,
    PU239: 0.3,
    PU241: 0.06,
  },
  FBR: {
    U235: 0.56,
    U238: 0.08,
    PU239: 0.3,
    PU241: 0.06,
  },
  HEU: {
    U235: 1,
    U238: 0,
    PU239: 0,
    PU241: 0,
  },
  LEU_MOX: {
    U235: 0.39,
    U238: 0.08,
    PU239: 0.42,
    PU241: 0.11,
  },
  FBR_MOX: {
    U235: 0.39,
    U238: 0.08,
    PU239: 0.42,
    PU241: 0.11,
  },
};

export const FISSION_FRACTIONS: { [type: string]: FissionFractions } = {
  GCR: {
    U235: 0.7248,
    U238: 0.0423,
    PU239: 0.2127,
    PU241: 0.0202,
  },
  PHWR: {
    U235: 0.52,
    U238: 0.05,
    PU239: 0.42,
    PU241: 0.01,
  },
   AGR_begin: {
    U235: 0.7667,
    U238: 0.0407,
    PU239: 0.1777,
    PU241: 0.0149,
  },
   AGR_middle: {
    U235: 0.7248,
    U238: 0.0420,
    PU239: 0.2127,
    PU241: 0.0205,
  },
   AGR_end: {
    U235: 0.6829,
    U238: 0.0432,
    PU239: 0.2476,
    PU241: 0.0263,
  },
  VVER_begin: {
    U235: 0.65,
    U238: 0.07,
    PU239: 0.24,
    PU241: 0.04,
  },
   VVER_middle: {
    U235: 0.56,
    U238: 0.07,
    PU239: 0.31,
    PU241: 0.06,
  },
   VVER_end: {
    U235: 0.48,
    U238: 0.07,
    PU239: 0.37,
    PU241: 0.08,
  },
};

function fissionFractionToPowerFraction(
  fissionFractions: FissionFractions
): PowerFractions {
  const total = (Object.keys(
    fissionFractions
  ) as (keyof FissionFractions)[]).reduce(
    (current, isotope) =>
      current + fissionFractions[isotope] * FISSION_ENERGIES[isotope],
    0
  );

  let powerFraction: Partial<{ [key in Isotopes]: number }> = {};
  let isotope: keyof FissionFractions;
  for (isotope in fissionFractions) {
    powerFraction[isotope] =
      (fissionFractions[isotope] * FISSION_ENERGIES[isotope]) / total;
  }

  return powerFraction as PowerFractions;
}

const POWER_FRACTIONS_ALL: {[type: string]: PowerFractions} = {
  GCR: fissionFractionToPowerFraction(FISSION_FRACTIONS.GCR),
  PHWR: fissionFractionToPowerFraction(FISSION_FRACTIONS.PHWR),
  ...POWER_FRACTIONS
}

const spectrumCache: {[index: string]: Float64Array} = {}

const calcSpectrum = (crossSection:CrossSection, powerFractions: PowerFractions): Float64Array => {
  const spectrumCacheKey = JSON.stringify({
    ...powerFractions,
    crossSectionFuncID:crossSection.crossSection,
    esTMim:crossSection.elasticScatteringTMin,
    esTMax:crossSection.elasticScatteringTMax,
  })
  if (spectrumCacheKey in spectrumCache){
    return spectrumCache[spectrumCacheKey]
  }
  return spectrumCache[spectrumCacheKey] = bins.map((Ev) => {
    return Object.keys(Isotopes)
      .map((v) => {
        const isotope: Isotopes = v as Isotopes;
        const powerFraction = powerFractions[isotope];
        const fisionEnery = FISSION_ENERGIES[isotope];
        const neutrinoEnergy = neutrinoEnergyFor(isotope);
        const rate = partialInteractionRate(
          Ev,
          fisionEnery,
          crossSection.crossSectionFunction,
          neutrinoEnergy
        );

        return (
          1e22 * (SECONDS_PER_YEAR / ELEMENTARY_CHARGE) * powerFraction * rate
        );
      })
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  });
}

interface LoadFactor {
  date: Date;
  load: number;
  days: number;
}
interface Direction {
  phi: number;
  elev: number;
}

// eslint-disable-next-line
const LoadFactor = (date: string, load: number): LoadFactor => {
  const dateObj = new Date(date + "-01T00:00:00Z");
  return {
    date: dateObj,
    load: load / 100,
    // This is finding the "zeroith" day of the next month, which will result
    // in the last day of the month we want being returned
    days: new Date(
      Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth() + 1, 0)
    ).getUTCDate(),
  };
};

interface ReactorCore {
  name: string;
  lat: number;
  lon: number;
  elevation: number;
  type: string;
  mox: boolean;
  power: number;
  custom: boolean;
  loads: LoadFactor[];
  x: number;
  y: number;
  z: number;
  spectrumType: string;
  loadOverride?: number;
  lf_cache: { [key: string]: number };
  detectorDistance: number;
  detectorSignal: Float64Array;
  detectorAnySignal: boolean;
  detectorNIU: number;
  direction: Direction;
  powerFractions: PowerFractions;
  outputSignal: boolean;
  shutdown: Date;

  setSignal: (
    dist: number,
    lf: number,
    oscillation: Oscillation,
    crossSection: CrossSection,
    direction: Direction
  ) => ReactorCore;
  loadFactor: (start?: Date, stop?: Date) => number;
  cos: (other: ReactorCore) => number;
}

// eslint-disable-next-line
export function ReactorCore({
  name,
  lat,
  lon,
  elevation,
  power = 0,
  powerFractions,
  type = "custom",
  spectrumType = "custom",
  mox = false,
  custom = false,
  loads = [],
  shutdown = "2100-01",
}: {
  name: string;
  lat: number;
  lon: number;
  elevation: number;
  type: string;
  spectrumType: string;
  mox: boolean;
  power: number;
  custom?: boolean;
  loads: LoadFactor[];
  powerFractions: PowerFractions;
  shutdown: string;
}): ReactorCore {
  const [x, y, z] = project(lat, lon, elevation).map((n) => n / 1000);

  function loadFactor(
    this: ReactorCore,
    start = new Date(Date.UTC(2003, 0)),
    stop = new Date(Date.UTC(2019, 11))
  ) {
    if (this.loadOverride !== undefined) {
      return this.loadOverride;
    }
    if (this.custom === true) {
      return 1;
    }
    const lf_key = JSON.stringify([start, stop]);

    if (this.lf_cache[lf_key] !== undefined) {
      return this.lf_cache[lf_key];
    }

    const loads = this.loads.filter(
      (load) => load.date >= start && load.date <= stop
    );
    const totalDays = loads.reduce((a, b) => a + b.days, 0);
    const weightedLoads = loads.map(
      (load) => load.load * (load.days / totalDays)
    );
    const lf = weightedLoads.reduce((a, b) => a + b);
    this.lf_cache[lf_key] = lf;
    return this.lf_cache[lf_key];
  }

  function setSignal(
    this: ReactorCore,
    dist: number,
    lf: number,
    oscillation: Oscillation,
    crossSection: CrossSection,
    direction: Direction
  ): ReactorCore {
    let spectrum = calcSpectrum(crossSection, this.powerFractions)
    const power = this.power;
    const distsq = dist ** 2;

    if (dist > 200) {
      dist = Math.round(dist);
    }
    let oscillationFunc = oscillation.neutrinoOscillationSpectrum(dist);

    if (crossSection.crossSection === XSNames.ESMUTAU) {
      oscillationFunc = oscillationFunc.map((v) => 1 - v);
    }

    let ESMUTauContirbution = (new Float64Array(bins.length)).fill(0)

    if (crossSection.crossSection === XSNames.ESTOTAL) {
      let ESEratio = bins.map(crossSection.crossSectionElectronAntineutrinoFractionES);
      // we need the origional total specturm for this
      ESMUTauContirbution = spectrum.map(
        (spec, idx) => spec * (1 - ESEratio[idx]) * (1 - oscillationFunc[idx])
      );

      spectrum = spectrum.map((spec, idx) => spec * ESEratio[idx]);
    }

    const signal = spectrum.map((spec, idx) => {
      return (
        ((spec * oscillationFunc[idx] + ESMUTauContirbution[idx]) * power * lf) /
        distsq
      );
    });

    const detectorNIU = sum(signal) * binWidth;
    const detectorAnySignal = detectorNIU > 0;

    return {
      ...this,
      detectorSignal: signal,
      detectorDistance: dist,
      detectorNIU: detectorNIU,
      detectorAnySignal: detectorAnySignal,
      direction: direction,
    };
  }

  function cos(this: ReactorCore, other: ReactorCore) {
    return (
      cos_deg(this.direction.phi - other.direction.phi) *
      cos_deg(this.direction.elev - other.direction.elev)
    );
  }

  return {
    name: name,
    lat: lat,
    lon: lon,
    elevation: elevation,
    type: type,
    mox: mox,
    power: power,
    custom: custom,
    loads: loads,
    x: x,
    y: y,
    z: z,
    spectrumType: spectrumType,
    lf_cache: {},
    powerFractions: powerFractions,
    loadFactor: loadFactor,
    detectorDistance: 0,
    //TODO assumption about bins
    detectorSignal: new Float64Array(binCount).fill(0),
    detectorAnySignal: false,
    detectorNIU: 0,
    setSignal: setSignal,
    direction: { phi: 0, elev: 0 },
    cos: cos,
    outputSignal: false,
    shutdown: new Date(shutdown + "-01T00:00:00Z")
  };
}

const defaultCoreList = Object.keys(cores).map((core) => {
  const c = core as keyof typeof cores;
  const coreParams = cores[c];
  const coreLFs: number[] = loads[c];
  const lat: number = coreParams.lat;
  const lon: number = coreParams.lon;
  const elevation: number = coreParams.elevation;
  const power: number = coreParams.power;
  const shutdown: string = coreParams.shutdown
  const LFs = zip(times, coreLFs).map(([time, load]) => {
    const date: string = time!;
    const lf: number = load!;
    return LoadFactor(date, lf);
  });
  const databaseToKnown: { [key: string]: string } = {
    LEU: "LEU",
    PWR: "LEU",
    BWR: "LEU",
    LWGR: "LEU",
    HWLWR: "LEU",
    PHWR: "PHWR",
    GCR: "GCR",
    HEU: "HEU",
    FBR: "FBR",
  };
  let spectrumType = databaseToKnown[coreParams.type];
  if (coreParams.mox === 1) {
    spectrumType = spectrumType + "_MOX";
  }

  const powerFractions = POWER_FRACTIONS_ALL[spectrumType];
  return ReactorCore({
    name: c,
    lat: lat,
    lon: lon,
    elevation: elevation,
    type: coreParams.type,
    spectrumType: spectrumType,
    powerFractions: powerFractions,
    mox: Boolean(coreParams.mox),
    power: power,
    loads: LFs,
    shutdown: shutdown,
  });
});

export function coreNameSortCompare(a: ReactorCore, b: ReactorCore) {
  const nameCompare = (a: string, b: string) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  };
  if (a.custom === b.custom) {
    return nameCompare(a.name.toUpperCase(), b.name.toUpperCase());
  }
  if (a.custom === true && b.custom === false) {
    return 1;
  }
  if (a.custom === false && b.custom === true) {
    return -1;
  }
  return 0;
}

interface CoresObject {
  [key: string]: ReactorCore;
}

export const defaultCores = defaultCoreList.reduce(
  (previous: CoresObject, current: ReactorCore) => {
    return { ...previous, [current.name]: current };
  },
  {}
);
