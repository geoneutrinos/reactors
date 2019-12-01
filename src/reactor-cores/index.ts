import { reactors as cores, times, loads } from './reactor-database/reactors.json'
import { partialInteractionRate } from '../physics/reactor-antineutrinos'
import { neutrinoEnergyFor } from '../physics/helpers'
import {crossSectionSV2003, crossSectionVB1999} from '../physics/neutrino-cross-section'
import { FISSION_ENERGIES, Isotopes} from '../physics/constants'
import { range, memoize, zip } from 'lodash';
import { project } from 'ecef-projector';

export { cores, times, loads };

function mevRange(count = 1000, start = 0, stop = 10) {
  // TODO figure out how to deal with a start not a zero
  const binSize = (stop - start) / count;
  return new Float64Array(range(binSize / 2, stop, binSize))
}

const bins = mevRange();

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

    //this.spectrumSV2003 = bins.map((Ev) => {
    //  return Object.keys(Isotopes).map((v) => {
    //    const isotope: Isotopes = v as Isotopes;
    //    return partialInteractionRate(Ev, FISSION_ENERGIES[isotope], memoedCrossSectionSV2003, neutrinoEnergyFor(isotope))
    //  }).reduce((previousValue, currentValue) => previousValue + currentValue, 0)
    //})
    //this.spectrumVB1999 = bins.map((Ev) =>{
    //  return Object.keys(Isotopes).map((v) => {
    //    const isotope: Isotopes = v as Isotopes;
    //    return partialInteractionRate(Ev, FISSION_ENERGIES[isotope], crossSectionVB1999, neutrinoEnergyFor(isotope))
    //  }).reduce((previousValue, currentValue) => previousValue + currentValue, 0)
    //})
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
    this.loads = loads
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
}
export const defaultCoreList = Object.keys(cores).map((core) =>{
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