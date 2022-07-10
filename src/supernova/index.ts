import { ELEMENTARY_CHARGE, ELECTRON_REST_MASS } from "../physics/constants";
import { IBD_THRESHOLD } from "../physics/derived";

const deltaE = 0.1;

const energies = [];

for (let i=0; i<1000; i++) {
  energyNu = i * deltaE + deltaE / 2;
  energies.push(energyNu)
};

const xsection = energies.map(xSection);

const fluxSpectrum = energies.map(nuSpecCCSN);

function nuSpecCCSN(Ev: number) {
  const enu_tot = 5e52 * 1e-13 / ELEMENTARY_CHARGE; // MeV
  const d_ccsn = 10 * 3.086e21; // cm
  const beta = 4;
  const avgE = 15;

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
