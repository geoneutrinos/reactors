import { ELEMENTARY_CHARGE, ELECTRON_REST_MASS } from "../physics/constants";
import { IBD_THRESHOLD } from "../physics/derived";
import { s2t12, c2t12 } from "../physics/neutrino-oscillation";

export const energyValues = new Float32Array(1000).map((v, i) => i / 10 + .05);

const xsection = energyValues.map(xSection);

// todo: pass avgE as parameter to single function that still maps 
export const fluxSpectrumNue = energyValues.map(nueSpecCCSN);
export const fluxSpectrumAnu = energyValues.map(anuSpecCCSN);
export const fluxSpectrumNux = energyValues.map(nuxSpecCCSN);

export const fluxNOSpectrumNue = fluxSpectrumNux.map((v) => v);

const fluxNOSpectrumAnuT1 = fluxSpectrumAnu.map((v) => v * c2t12);
const fluxNOSpectrumAnuT2 = fluxSpectrumNux.map((v) => v * s2t12);
export const fluxNOSpectrumAnu = fluxNOSpectrumAnuT1.map((v, i) => v + fluxNOSpectrumAnuT2[i]); 

const fluxNOSpectrumNuxT1 = fluxSpectrumNux.map((v) => v * (2 + c2t12));
const fluxNOSpectrumNuxT2 = fluxSpectrumNue.map((v) => v);
const fluxNOSpectrumNuxT3 = fluxSpectrumAnu.map((v) => v * s2t12);
const fluxNOSpectrumNuxT123 = fluxNOSpectrumNuxT1.map((v, i) => v + fluxNOSpectrumNuxT2[i] + fluxNOSpectrumNuxT3[i]);
export const fluxNOSpectrumNux = fluxNOSpectrumNuxT123.map((v) => v / 4);

function nueSpecCCSN(Ev: number) {
  const enu_tot = 5e52 * 1e-13 / ELEMENTARY_CHARGE; // MeV
  const d_ccsn = 10 * 3.086e21; // cm
  const beta = 4;
  const avgE = 12;

  const prefix = (beta ** beta) / ( 4 * Math.PI * 6 * avgE * avgE );

  const energy_factor = ( ( Ev / avgE ) ** (beta - 1) ) * Math.exp(-beta * Ev / avgE);

  return prefix * enu_tot * energy_factor / d_ccsn / d_ccsn;
}

function anuSpecCCSN(Ev: number) {
  const enu_tot = 5e52 * 1e-13 / ELEMENTARY_CHARGE; // MeV
  const d_ccsn = 10 * 3.086e21; // cm
  const beta = 4;
  const avgE = 15;

  const prefix = (beta ** beta) / ( 4 * Math.PI * 6 * avgE * avgE );

  const energy_factor = ( ( Ev / avgE ) ** (beta - 1) ) * Math.exp(-beta * Ev / avgE);

  return prefix * enu_tot * energy_factor / d_ccsn / d_ccsn;
}

function nuxSpecCCSN(Ev: number) {
  const enu_tot = 5e52 * 1e-13 / ELEMENTARY_CHARGE; // MeV
  const d_ccsn = 10 * 3.086e21; // cm
  const beta = 4;
  const avgE = 18;

  const prefix = (beta ** beta) / ( 4 * Math.PI * 6 * avgE * avgE );

  const energy_factor = ( ( Ev / avgE ) ** (beta - 1) ) * Math.exp(-beta * Ev / avgE);

  return prefix * enu_tot * energy_factor / d_ccsn / d_ccsn;
}

function xSection(Ev: number) {
  const a = -0.07056;
  const b = 0.02018;
  const c = -0.001953;

  const sv = a + (b * Math.log(Ev)) + (c * Math.log(Ev) ** 3);
  const sve = Ev ** sv;
  
  const Ee = Math.max(ELECTRON_REST_MASS, Ev - IBD_THRESHOLD + ELECTRON_REST_MASS);
  
  const Pe = Math.sqrt(Ee ** 2 - ELECTRON_REST_MASS ** 2);

  return 1e-43 * Pe * Ee * sve;
}
