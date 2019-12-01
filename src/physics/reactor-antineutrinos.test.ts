import {neutrinoEnergy} from './reactor-antineutrinos'
import { V_FIT_PARAMS } from './constants'

// These are the values in Table 1 of Strumia & Vissani 2003
describe.each([
    [2, 1.32141],
    [4, 0.29227],
    [6, 0.03805],
    [8, 0.00147],
])('neutrinoEnergyEpectrum', (Ev, expected) => {
    test(`neutrinoEnergyEpectrum(${Ev}, ${expected})`, () => {
        expect(neutrinoEnergy(Ev, ...V_FIT_PARAMS["U235"])).toBeCloseTo(expected, 5)
    });
})