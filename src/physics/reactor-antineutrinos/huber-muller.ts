import { Isotopes  } from "../constants";

type VFitIsotopes = {
  [key in keyof typeof Isotopes]: number[];
};

// Huber 2011 -> DOI: 10.1103/PhysRevC.84.024617
// Mueller 2011 -> 10.1103/PhysRevC.83.054615
export const V_FIT_PARAMS: VFitIsotopes = {
  U235: [4.367, -4.577, 2.1, -5.294e-1, 6.186e-2, -2.777e-3], // Huber 2011 (phys rev c) table 3
  U238: [4.833e-1, 1.927e-1, -1.283e-1, -6.762e-3, 2.233e-3, -1.536e-4], // Mueller 2011 table 6
  PU239: [4.757, -5.392, 2.563, -6.596e-1, 7.82e-2, -3.536e-3], // Huber 2011 (phys rev c) table 3
  PU241: [2.99, -2.882, 1.278, -3.343e-1, 3.905e-2, -1.754e-3], // Huber 2011 (phys rev c) table 3
};


/**
 * estimate of the differential neutrino energy, usually represented by the symbol lambda
 * @param Ev - Energy of the neutrino in MeV
 * @param c  - One or more unitless fitted coeficients
 */
 export function neutrinoEnergy(Ev:number, ...c: number[]): number{
    const params = c.map((cv, i) => cv * Math.pow(Ev, i));
    return Math.exp(params.reduce((sum, value) => sum + value, 0));
  }

export function neutrinoEnergyFor(isotope: keyof typeof Isotopes){
  return (Ev: number) => {
    let fitParams = V_FIT_PARAMS[isotope]
    return neutrinoEnergy(Ev, ...fitParams);
  }
}