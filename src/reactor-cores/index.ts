import { reactors as cores, times, loads } from './reactor-database/reactors.json'
import { partialInteractionRate } from '../physics/reactor-antineutrinos'
import { neutrinoEnergyFor } from '../physics/helpers'
import {crossSectionSV2003, crossSectionVB1999} from '../physics/neutrino-cross-section'
import { FISSION_ENERGIES, Isotopes} from '../physics/constants'
import { range, memoize, zip } from 'lodash';
import { project } from 'ecef-projector';

export { cores, times, loads };

const memoedCrossSectionSV2003 = memoize(crossSectionSV2003)

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
  u235: number;
  u238: number;
  pu239: number;
  pu241: number;

  spectrumSV2003: Float64Array;
  spectrumVB1999: Float64Array;

  constructor({ date, load, u235, u238, pu239, pu241 }: 
    { date: string; load: number; u235: number; u238: number; pu239: number; pu241: number}
    ) {
    this.date = new Date(date);
    this.load = load / 100;
    // This is finding the "zeroith" day of the next month, which will result
    // in the last day of the month we want being returned
    this.days = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();

    if ((u235 + u238 + pu239 + pu241) !== 1){
      throw new RangeError("The ratios of the nuclear isotopes must sum to one");
    }

    this.u235 = u235;
    this.u238 = u238;
    this.pu239 = pu239;
    this.pu241 = pu241;

    this.spectrumSV2003 = bins.map((Ev) => {
      return Object.keys(Isotopes).map((v) => {
        const isotope: Isotopes = v as Isotopes;
        return partialInteractionRate(Ev, FISSION_ENERGIES[isotope], memoedCrossSectionSV2003, neutrinoEnergyFor(isotope))
      }).reduce((previousValue, currentValue) => previousValue + currentValue, 0)
    })
    this.spectrumVB1999 = bins.map((Ev) =>{
      return Object.keys(Isotopes).map((v) => {
        const isotope: Isotopes = v as Isotopes;
        return partialInteractionRate(Ev, FISSION_ENERGIES[isotope], crossSectionVB1999, neutrinoEnergyFor(isotope))
      }).reduce((previousValue, currentValue) => previousValue + currentValue, 0)
    })
  }
}
Object.keys(cores).map((core) =>{
  const c = core as keyof typeof cores;
  const coreParams = cores[c]
  const coreLFs = loads[c]
  console.log(zip(times, coreLFs).map(([time, load]) => {
    const date:string = time!
    const lf:number = load!
    return new LoadFactor({date: date, load: lf, u235: 1, u238: 0, pu239: 0, pu241: 0})
  }));
})