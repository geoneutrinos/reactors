import { reactors as cores, times, loads } from './reactor-database/reactors.json'
import { partialInteractionRate } from '../physics/reactor-antineutrinos'
import { neutrinoEnergyFor } from '../physics/helpers'
import {crossSectionSV2003, crossSectionVB1999, crossSectionElectronAntineutrinoES, crossSectionMuTauAntineutrinoES} from '../physics/neutrino-cross-section'
import { FISSION_ENERGIES, ELEMENTARY_CHARGE ,Isotopes} from '../physics/constants'
import { range, zip, sum } from 'lodash';
import { project } from 'ecef-projector';
import {LazyGetter} from 'lazy-get-decorator';
import { invertedNeutrinoOscilationSpectrum, normalNeutrinoOscilationSpectrum } from '../physics/neutrino-oscillation'

export { cores, times, loads };

const SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60;

function mevRange(count = 1000, start = 0, stop = 10) {
  // TODO figure out how to deal with a start not a zero
  const binSize = (stop - start) / count;
  return new Float32Array(range(binSize / 2, stop, binSize))
}

const bins = mevRange();

const FUEL_FRACTIONS: {[type: string]: {[key: string]: number}} = {
  "LEU": {
    "U235":  0.56,
    "U238":  0.08, 
    "PU239": 0.30,
    "PU241": 0.06
  },
  "FBR": {
    "U235":  0.56,
    "U238":  0.08, 
    "PU239": 0.30,
    "PU241": 0.06
  },
  "HEU": {
    "U235":  1,
    "U238":  0, 
    "PU239": 0,
    "PU241": 0
  },
  "GCR": {
    "U235":  0.7248,
    "U238":  0.0423, 
    "PU239": 0.2127,
    "PU241": 0.0202
  },
  "PHWR": {
    "U235":  0.52,
    "U238":  0.05, 
    "PU239": 0.42,
    "PU241": 0.01
  },
  "LEU_MOX": {
    "U235":  0.39,
    "U238":  0.08, 
    "PU239": 0.42,
    "PU241": 0.11
  },
  "FBR_MOX": {
    "U235":  0.39,
    "U238":  0.08, 
    "PU239": 0.42,
    "PU241": 0.11
  }
}


class LoadFactor {
  date: Date;
  load: number;
  days: number;

  constructor({ date, load}: 
    { date: string; load: number}
    ) {
    this.date = new Date(date);
    this.load = load / 100;
    // This is finding the "zeroith" day of the next month, which will result
    // in the last day of the month we want being returned
    this.days = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
  }
}

export class ReactorCore {
  name: string;
  lat: number;
  lon: number;
  elevation: number;
  type: string;
  mox: boolean;
  power: number; // this is the design power of the core
  loads: LoadFactor[];
  x: number;
  y: number;
  z: number;
  custom: boolean;
  loadOverride?: number

  lf_cache: {[key: string]: number};
  detectorDistance: number;
  detectorSignal: Float32Array;
  detectorAnySignal: boolean;
  detectorNIU: number;

  constructor({name, lat, lon, elevation, type, mox, power, custom=false, loads}: 
    {name:string, lat: number, lon:number, elevation:number, type:string, mox:boolean, power:number, custom?:boolean, loads:LoadFactor[]}){
    this.name = name;
    this.lat = lat;
    this.lon = lon;
    this.elevation = elevation;
    [this.x, this.y, this.z] = project(lat, lon, elevation).map((n)=> n/1000);
    this.type = type;
    this.mox = mox;
    this.power = power;
    this.custom = custom;
    this.loads = loads;
    this.lf_cache = {};
    this.detectorDistance = 0;
    this.detectorSignal = (new Float32Array(1000)).fill(0);
    this.detectorAnySignal= false;
    this.detectorNIU = 0;
  }

  static sortCompare(a: ReactorCore, b: ReactorCore){
    const nameCompare = (a: string, b:string) => {
      if (a < b) {return -1};
      if (a > b) {return 1};
      return 0;
    }
    if (a.custom === b.custom){
      return nameCompare(a.name.toUpperCase(), b.name.toUpperCase())
    }
    if (a.custom === true && b.custom === false){return 1}
    if (a.custom === false && b.custom === true){return -1}
    return 0;
  }

  loadFactor(start = new Date("2003-01"), stop = new Date("2018-12")){
    if (this.loadOverride !== undefined){
      return this.loadOverride;
    }
    if (this.custom === true){
      return 1;
    }
    const lf_key = JSON.stringify([start, stop]);

    if (this.lf_cache[lf_key] !== undefined){
      return this.lf_cache[lf_key]
    }

    const loads = this.loads.filter((load) => (load.date >= start) && (load.date <= stop));
    const totalDays = loads.reduce((a,b) => a + b.days, 0);
    const weightedLoads = loads.map((load) => load.load * (load.days/totalDays));
    const lf =  weightedLoads.reduce((a,b) => a + b);
    this.lf_cache[lf_key] = lf;
    return this.lf_cache[lf_key]
  }

  @LazyGetter()
  get spectrumSV2003(){
    return bins.map((Ev) => {
        return Object.keys(Isotopes).map((v) => {
          const isotope: Isotopes = v as Isotopes;
          const fuelFraction = FUEL_FRACTIONS[this.spectrumType][v];
          return 1e22 * (SECONDS_PER_YEAR/ELEMENTARY_CHARGE) * fuelFraction * partialInteractionRate(Ev, FISSION_ENERGIES[isotope], crossSectionSV2003, neutrinoEnergyFor(isotope))
        }).reduce((previousValue, currentValue) => previousValue + currentValue, 0)
    })
  }

  @LazyGetter()
  get spectrumVB1999(){
    return bins.map((Ev) =>{
      return Object.keys(Isotopes).map((v) => {
        const isotope: Isotopes = v as Isotopes;
        const fuelFraction = FUEL_FRACTIONS[this.spectrumType][v];
        return 1e22 * (SECONDS_PER_YEAR/ELEMENTARY_CHARGE) * fuelFraction * partialInteractionRate(Ev, FISSION_ENERGIES[isotope], crossSectionVB1999, neutrinoEnergyFor(isotope))
      }).reduce((previousValue, currentValue) => previousValue + currentValue, 0)
    })
  }

  @LazyGetter()
  get spectrumESANTI(){
    return bins.map((Ev) =>{
      return Object.keys(Isotopes).map((v) => {
        const isotope: Isotopes = v as Isotopes;
        const fuelFraction = FUEL_FRACTIONS[this.spectrumType][v];
        return 1e22 * (SECONDS_PER_YEAR/ELEMENTARY_CHARGE) * fuelFraction * partialInteractionRate(Ev, FISSION_ENERGIES[isotope], crossSectionElectronAntineutrinoES, neutrinoEnergyFor(isotope))
      }).reduce((previousValue, currentValue) => previousValue + currentValue, 0)
    })
  }

  @LazyGetter()
  get spectrumESMUTAU(){
    return bins.map((Ev) =>{
      return Object.keys(Isotopes).map((v) => {
        const isotope: Isotopes = v as Isotopes;
        const fuelFraction = FUEL_FRACTIONS[this.spectrumType][v];
        return 1e22 * (SECONDS_PER_YEAR/ELEMENTARY_CHARGE) * fuelFraction * partialInteractionRate(Ev, FISSION_ENERGIES[isotope], crossSectionMuTauAntineutrinoES, neutrinoEnergyFor(isotope))
      }).reduce((previousValue, currentValue) => previousValue + currentValue, 0)
    })
  }

  @LazyGetter()
  get spectrumType(): string{
    const databaseToKnown:{ [key: string]: string; } = {
       "LEU": "LEU",
       "PWR": "LEU",
       "BWR": "LEU",
       "LWGR": "LEU",
       "HWLWR": "LEU",
       "PHWR": "PHWR",
       "GCR": "GCR",
       "HEU": "HEU",
       "FBR": "FBR",
    }
    let t = databaseToKnown[this.type]
    if (this.mox === true){
      return t + "_MOX"
    }
    return t
  }

  spectrum(method:string){
    switch (method){
      case "ESMUTAU":
        return this.spectrumESMUTAU;
      case "ESANTI":
        return this.spectrumESANTI;
      case "VB1999":
        return this.spectrumVB1999;
      case "SV2004":
      default:
        return this.spectrumSV2003;
    }
  }

  setCustomLoad = (load:number): ReactorCore => {
    const newCore = this
    newCore.loadOverride = load;
    return newCore;
  }

  clearCustomLoad = (): ReactorCore => {
    const newCore = this
    delete newCore.loadOverride;
    return newCore;
  }

  setSignal(dist:number, lf:number, massOrdering:string, crossSection:string): ReactorCore{
    const newCore = this
    const spectrum = this.spectrum(crossSection);
    const power = this.power;
    const distsq = dist ** 2;

    if (dist > 100){
      dist = Math.round(dist)
    }

    let oscillation: Float32Array;
    switch (massOrdering){
      case ("inverted"):
        oscillation = invertedNeutrinoOscilationSpectrum(dist);
        break;
      case ("normal"):
      default:
        oscillation = normalNeutrinoOscilationSpectrum(dist);
        break
    }

    if (crossSection === "ESMUTAU"){
      oscillation = oscillation.map((v) => 1 - v)
    }

    const signal = spectrum.map((spec, idx) => {
      return (spec * oscillation[idx] * power * lf)/distsq
    })

    newCore.detectorSignal = signal;
    newCore.detectorDistance = dist;
    newCore.detectorNIU = sum(signal) * 0.01
    newCore.detectorAnySignal = (newCore.detectorNIU> 0)

    return newCore
  }
}

const defaultCoreList = Object.keys(cores).map((core) =>{
  const c = core as keyof typeof cores;
  const coreParams = cores[c]
  const coreLFs:number[] = loads[c]
  const lat:number = coreParams.lat as number;
  const lon:number = coreParams.lon as number;
  const elevation:number = coreParams.elevation as number;
  const power:number = coreParams.power as number;
  const LFs = zip(times, coreLFs).map(([time, load]) => {
    const date:string = time!
    const lf:number = load!
    return new LoadFactor({date: date, load: lf})
  });
  return new ReactorCore({
    name: c,
    lat: lat,
    lon: lon,
    elevation: elevation,
    type: coreParams.type,
    mox: Boolean(coreParams.mox),
    power: power,
    loads: LFs
  })
});

interface CoresObject{
  [key: string]: ReactorCore
}

export const defaultCores = defaultCoreList.reduce(
  (previous: CoresObject, current: ReactorCore) => {
    return { ...previous, [current.name]: current }
  }, {})