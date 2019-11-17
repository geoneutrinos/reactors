import {normalNeutrinoOscilationSpectrum} from './neutrino-oscillation'

describe.each([
    1,
    10,
    100,
    1000,
    6000,
])('normalNuosc(%f)', (dist) => {
    test(`normal nuosc(${dist})`, () => {
        const betweenZeroAndOne = (val:number):boolean => {
            return ((val => 0) && (val <= 1));
        }
        expect(normalNeutrinoOscilationSpectrum(dist).every(betweenZeroAndOne)).toBeTruthy()
    });
})