import { 
  ELEMENTARY_CHARGE,
  ELECTRON_REST_MASS,
  PROTON_REST_MASS,
  FERMI_COUPLING_CONSTANT,
  HBAR_C,
} from "../physics/constants";
import { IBD_THRESHOLD } from "../physics/derived";
import { s2t12, c2t12 } from "../physics/neutrino-oscillation";

import { sum } from "lodash";

export const energyValues = new Float32Array(1000).map((v, i) => i / 10 + .05);

// todo: pass avgE as parameter to single function that still maps 
export const fluxSpectrumNue = energyValues.map(nueSpecCCSN);
export const fluxSpectrumAnu = energyValues.map(anuSpecCCSN);
export const fluxSpectrumNux = energyValues.map(nuxSpecCCSN);

// electron neutrinos
export const fluxNOSpectrumNue = fluxSpectrumNux.map((v) => v);

const fluxIOSpectrumNueT1 = fluxSpectrumNue.map((v) => v * s2t12);
const fluxIOSpectrumNueT2 = fluxSpectrumNux.map((v) => v * c2t12);
export const fluxIOSpectrumNue = fluxIOSpectrumNueT1.map((v, i) => v + fluxIOSpectrumNueT2[i]); 

// electron anti-neutrinos
const fluxNOSpectrumAnuT1 = fluxSpectrumAnu.map((v) => v * c2t12);
const fluxNOSpectrumAnuT2 = fluxSpectrumNux.map((v) => v * s2t12);
export const fluxNOSpectrumAnu = fluxNOSpectrumAnuT1.map((v, i) => v + fluxNOSpectrumAnuT2[i]); 

export const fluxIOSpectrumAnu = fluxSpectrumNux.map((v) => v);

// mu or tau neutrinos and antineutrinos
const fluxNOSpectrumNuxT1 = fluxSpectrumNux.map((v) => v * (2 + c2t12));
const fluxNOSpectrumNuxT2 = fluxSpectrumNue.map((v) => v);
const fluxNOSpectrumNuxT3 = fluxSpectrumAnu.map((v) => v * s2t12);
const fluxNOSpectrumNuxT123 = fluxNOSpectrumNuxT1.map((v, i) => v + fluxNOSpectrumNuxT2[i] + fluxNOSpectrumNuxT3[i]);
export const fluxNOSpectrumNux = fluxNOSpectrumNuxT123.map((v) => v / 4);

const fluxIOSpectrumNuxT1 = fluxSpectrumNux.map((v) => v * (2 + s2t12));
const fluxIOSpectrumNuxT2 = fluxSpectrumAnu.map((v) => v);
const fluxIOSpectrumNuxT3 = fluxSpectrumNue.map((v) => v * c2t12);
const fluxIOSpectrumNuxT123 = fluxIOSpectrumNuxT1.map((v, i) => v + fluxIOSpectrumNuxT2[i] + fluxIOSpectrumNuxT3[i]);
export const fluxIOSpectrumNux = fluxIOSpectrumNuxT123.map((v) => v / 4);

const xsectionIBD = energyValues.map(xSectionIBD);

export const eventSpectrumIBDnoOsc = fluxSpectrumAnu.map((v, i) => v * xsectionIBD[i] * 1e32);
export const eventSpectrumIBDforNO = fluxNOSpectrumAnu.map((v, i) => v * xsectionIBD[i] * 1e32);
export const eventSpectrumIBDforIO = fluxIOSpectrumAnu.map((v, i) => v * xsectionIBD[i] * 1e32);

export const sumSpectrumIBDnoOsc = sum(eventSpectrumIBDnoOsc) * 0.1;
export const sumSpectrumIBDforNO = sum(eventSpectrumIBDforNO) * 0.1;
export const sumSpectrumIBDforIO = sum(eventSpectrumIBDforIO) * 0.1;

export const eventSpectrumESPnoOsc = fluxSpectrumAnu.map((v, i) => v * xsectionESp[i] * 1e32);
export const eventSpectrumESPforNO = fluxNOSpectrumAnu.map((v, i) => v * xsectionESp[i] * 1e32);
export const eventSpectrumESPforIO = fluxIOSpectrumAnu.map((v, i) => v * xsectionESp[i] * 1e32);

export const sumSpectrumESPnoOsc = sum(eventSpectrumESPnoOsc) * 0.1;
export const sumSpectrumESPforNO = sum(eventSpectrumESPforNO) * 0.1;
export const sumSpectrumESPforIO = sum(eventSpectrumESPforIO) * 0.1;

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

function xSectionIBD(Ev: number) {
  const a = -0.07056;
  const b = 0.02018;
  const c = -0.001953;

  const sv = a + (b * Math.log(Ev)) + (c * Math.log(Ev) ** 3);
  const sve = Ev ** sv;
  
  const Ee = Math.max(ELECTRON_REST_MASS, Ev - IBD_THRESHOLD + ELECTRON_REST_MASS);
  
  const Pe = Math.sqrt(Ee ** 2 - ELECTRON_REST_MASS ** 2);

  return 1e-43 * Pe * Ee * sve;
}

function xSectionESp(Ev: number) {
  const cplus = (( 1.27 / 2 ) ** 2) + (( .4 ) ** 2);
  const cminu = (( 1.27 / 2 ) ** 2) - (( .4 ) ** 2);

const tmax = Ev * Ev * 2 / (Ev * 2 + PROTON_REST_MASS);
// ToDo allow nonzero tmin set with UI
  const tmin = 0;

  const tcon = PROTON_REST_MASS / (4 * Ev * Ev);
  const ccon = (FERMI_COUPLING_CONSTANT ** 2) * (HBAR_C ** 2) * PROTON_REST_MASS / Math.PI;

  return ccon * ( (cplus * (tmax - tmin)) + ( (cminu * tcon * ((tmax * tmax) - (tmin * tmin)) ) );
}
