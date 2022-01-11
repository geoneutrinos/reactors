import {piecewise, scaleLinear} from 'd3';
import extra from './data/estienne2018.json';

const interpolatedU238 = piecewise(extra.U238_450d)
const scale = scaleLinear().domain([extra.energy[0], extra.energy[extra.energy.length -1]]).clamp(true)

export function u238fit(eV:number): number {
  return interpolatedU238(scale(eV))
}

/**
 * estimate of the differential neutrino energy, usually represented by the symbol lambda
 * @param Ev - Energy of the neutrino in MeV
 * @param c  - One or more unitless fitted coeficients
 */
export function neutrinoEnergy(Ev:number, ...c: number[]): number{
  const params = c.map((cv, i) => cv * Math.pow(Ev, i));
  return Math.exp(params.reduce((sum, value) => sum + value, 0));
}

/**
 * Returns the partial internation rate which has not been scaled for 
 * thermal power of a core, had the neutrinos oscilated, or had the 
 * distance taken into account.
 * 
 * @param Ev - Energy of the neutrino in MeV
 * @param Q - Energy per fision of some nuclei
 * @param crossSection - Fuction which takes the neutrino enery in MeV and returns the cross section in cm^-2
 * @param energySpectrum - function which takes the neutnrio enery in MeV and eturns the differential neutrino enery
 */
export function partialInteractionRate(Ev: number, Q: number, crossSection:(Ev:number)=>number, neutrinoEnergyFunction:(Ev: number) => number): number{
  return neutrinoEnergyFunction(Ev) * 1/Q * crossSection(Ev)/(4 * Math.PI);
}