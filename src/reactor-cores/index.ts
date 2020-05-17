import { reactors as cores, times, loads } from './reactor-database/reactors.json'
import { partialInteractionRate } from '../physics/reactor-antineutrinos'
import { neutrinoEnergyFor } from '../physics/helpers'
import { XSFuncs } from '../physics/neutrino-cross-section'
import { FISSION_ENERGIES, ELEMENTARY_CHARGE ,Isotopes} from '../physics/constants'
import { range, zip, sum } from 'lodash';
import { project } from 'ecef-projector';
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

function spectrum(spectrumType:string, crossSection:(Ev: number) => number){
  return bins.map((Ev) => {
      return Object.keys(Isotopes).map((v) => {
        const isotope: Isotopes = v as Isotopes;
        const fuelFraction = FUEL_FRACTIONS[spectrumType][v];
        const fisionEnery = FISSION_ENERGIES[isotope];
        const neutrinoEnergy = neutrinoEnergyFor(isotope)
        const rate = partialInteractionRate(Ev, fisionEnery, crossSection, neutrinoEnergy)

        return 1e22 * (SECONDS_PER_YEAR/ELEMENTARY_CHARGE) * fuelFraction * rate;

      }).reduce((previousValue, currentValue) => previousValue + currentValue, 0)
  })
}

function fuelMixSpectrum(crossSection:(Ev: number) => number){
  return Object.fromEntries(
    Object.keys(FUEL_FRACTIONS).map((spectrumType) => {
      return [spectrumType, spectrum(spectrumType, crossSection)]
    })
  )
}

const spectrums = Object.fromEntries(
  Object.entries(XSFuncs).map(([name, func]) => [name, fuelMixSpectrum(func)])
)

interface LoadFactor {
  date: Date;
  load: number;
  days: number;
}

const LoadFactor = (date: string, load: number): LoadFactor => {
  const dateObj = new Date(date + "-01T00:00:00Z");
  return {
    date : dateObj,
    load: load / 100,
    // This is finding the "zeroith" day of the next month, which will result
    // in the last day of the month we want being returned
    days: new Date(Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth() + 1)).getUTCDate()
  }
}

interface ReactorCore{
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
 lf_cache: {[key: string]: number};
 detectorDistance: number;
 detectorSignal: Float32Array;
 detectorAnySignal: boolean;
 detectorNIU: number;

 spectrum: (crossSection:string) => Float32Array;
 setCustomLoad: (load:number) => ReactorCore;
 setSignal:  (dist:number, lf:number, massOrdering:string, crossSection:string) => ReactorCore;
 clearCustomLoad: () => ReactorCore;
 loadFactor: (start?:Date, stop?:Date) => number;
}

function ReactorCore({name, lat, lon, elevation, type, mox, power, custom=false, loads}: 
  {name:string, lat: number, lon:number, elevation:number, type:string, mox:boolean, power:number, custom?:boolean, loads:LoadFactor[]}): ReactorCore{
    const [x, y, z] = project(lat, lon, elevation).map((n)=> n/1000);
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
    let spectrumType:string = databaseToKnown[type]
    if (mox === true){
      spectrumType = spectrumType + "_MOX"
    }

  function loadFactor(this: ReactorCore, start = new Date(Date.UTC(2003, 0)), stop = new Date(Date.UTC(2018, 11))){
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

  function setSignal(this: ReactorCore, dist:number, lf:number, massOrdering:string, crossSection:string): ReactorCore{
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

    const detectorNIU = sum(signal) * 0.01
    const detectorAnySignal = (detectorNIU> 0)

    return {...this, detectorSignal:signal, detectorDistance: dist, detectorNIU:detectorNIU, detectorAnySignal: detectorAnySignal}
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
      spectrum: function(crossSection:string) { return spectrums[crossSection][this.spectrumType] },
      setCustomLoad: function(load:number) { return {...this, loadOverride:load}},
      clearCustomLoad: function() { return {...this, loadOverride:undefined}},
      loadFactor: loadFactor,
      detectorDistance: 0,
      detectorSignal: (new Float32Array(1000)).fill(0),
      detectorAnySignal: false,
      detectorNIU: 0,
      setSignal: setSignal,
    }
  }


const defaultCoreList = Object.keys(cores).map((core) =>{
  const c = core as keyof typeof cores;
  const coreParams = cores[c]
  const coreLFs:number[] = loads[c]
  const lat:number = coreParams.lat;
  const lon:number = coreParams.lon;
  const elevation:number = coreParams.elevation;
  const power:number = coreParams.power;
  const LFs = zip(times, coreLFs).map(([time, load]) => {
    const date:string = time!
    const lf:number = load!
    return LoadFactor(date, lf)
  });
  return ReactorCore({
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

export function coreNameSortCompare(a: ReactorCore, b: ReactorCore){
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

interface CoresObject{
  [key: string]: ReactorCore
}

export const defaultCores = defaultCoreList.reduce(
  (previous: CoresObject, current: ReactorCore) => {
    return { ...previous, [current.name]: current }
  }, {})