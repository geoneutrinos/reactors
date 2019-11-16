import {sigma_sv2003, sigma_vb1999} from './neutron-cross-section'

// These are the values in Table 1 of Strumia & Vissani 2003
describe.each([
    [2.25, 0.00735e-41],
    [4.84, 0.116e-41],
    [8.36, 0.451e-41],
    [12.3, 1.05e-41],
])('sigma_sv2003(%f)', (Ev, expected) => {
    test(`sigma_sv2003 returned expected cross section (${Ev}, ${expected})`, () => {
        // The paper says something like "within a few per mille" this is testing 0.003
        // so "3 per mille" which sounds like "a few" to me
        expect(100 * (1-sigma_sv2003(Ev)/expected)).toBeLessThan(0.3)
    });
})

describe.each([
    [2.25, 0.00737],
    [4.84, 0.11850],
    [8.36, 0.47416],
    [12.3, 1.15207],
])('sigma_sv2003(%f)', (Ev, expected) => {
    test(`sigma_vb1999 returned expected cross section (${Ev}, ${expected})`, () => {
        expect(sigma_vb1999(Ev)*1e41).toBeCloseTo(expected, 5)
    });
})