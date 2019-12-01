import { Isotopes, V_FIT_PARAMS } from './constants'
import {neutrinoEnergy} from './reactor-antineutrinos'

export function neutrinoEnergyFor(isotope: keyof typeof Isotopes){
  return (Ev: number) => {
    let fitParams = V_FIT_PARAMS[isotope]
    return neutrinoEnergy(Ev, ...fitParams);
  }
}