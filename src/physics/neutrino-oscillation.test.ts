import {normalNeutrinoOscilationSpectrum, invertedNeutrinoOscilationSpectrum} from './neutrino-oscillation'

const betweenZeroAndOne = (val:number):boolean => {
    return ((val => 0) && (val <= 1));
}

describe.each([
    1,
    10,
    100,
    1000,
    6000,
])('normalNuosc(%f)', (dist) => {
    test(`normal nuosc(${dist})`, () => {
        expect(normalNeutrinoOscilationSpectrum(dist).every(betweenZeroAndOne)).toBeTruthy()
    });
})

describe.each([
    1,
    10,
    100,
    1000,
    6000,
])('invertedNuosc(%f)', (dist) => {
    test(`inverted nuosc(${dist})`, () => {
        expect(invertedNeutrinoOscilationSpectrum(dist).every(betweenZeroAndOne)).toBeTruthy()
    });
})