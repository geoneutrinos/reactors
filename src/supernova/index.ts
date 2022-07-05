import { ELEMENTARY_CHARGE } from "../physics/constants";
import { memoize } from 'lodash';
import bins, {binWidth, binCount} from "../physics/bins";

function NuSpecCCSN(Ev:number): number{
  const enu_tot = 5e52 * 1e-13 / ELEMENTARY_CHARGE;  // MeV
  const d_ccsn = 10 * 3.086e21; // cm
  const prefix = (4 ** 4) / ( 4 * Math.PI * 6 * 15 * 15 );
  const energy_factor = ( ( Ev / 15 ) ** 3 ) * Math.exp(Ev * 4 / 15);
  return prefix*enu_tot*energy_factor/d_ccsn/d_ccsn
}
