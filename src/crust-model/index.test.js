import { getCrustFlux } from "./"

//Check the out of range lats
describe.each([
    [0, -91],
    [0, 91],
])('getCrustFlux(%i, %i', (lon, lat) => {
    test(`throws on out of range (${lon}, ${lat})`, () => {
        expect(() => getCrustFlux(lon, lat)).toThrowError('lat')
    });
})

//Check the out of range lons
describe.each([
    [-181, 0],
    [181, 0],
])('getCrustFlux(%i, %i', (lon, lat) => {
    test(`throws on out of range (${lon}, ${lat})`, () => {
        expect(() => getCrustFlux(lon, lat)).toThrowError('lon')
    });
})

//if both are out of range, lon should throw first
describe.each([
    [-181, -91],
    [181, -91],
    [-181, 91],
    [181, 91],
])('getCrustFlux(%i, %i', (lon, lat) => {
    test(`throws on out of range (${lon}, ${lat})`, () => {
        expect(() => getCrustFlux(lon, lat)).toThrowError('lon')
    });
})

// test some edge behavior
// The expected values were extracted manually from the excel spreadsheet
describe.each([
    [0, 0, {u:0.915, th:0.836, k:3.998}], // should give the cell with midpoint 0.5,-0.5 (lon,lat)
    [180, 0, {u:0.389, th:0.328, k:1.852}], // should give the cell with midpoint -179.5,-0.5 (lon,lat)
    [-179.9, 0, {u:0.389, th:0.328, k:1.852}], // should give the cell with midpoint -179.5,-0.5 (lon,lat)
    [0, 90, {u:1.476, th:1.395, k:6.207}], // should give the cell with midpoint 0.5,89.5 (lon,lat)

    // The following is around the same cell
    [-157.5, -19.7, {u: 0.360, th:0.298, k:1.735}],
    [-157.5, -19.3, {u: 0.360, th:0.298, k:1.735}],
    [-157.2, -19.3, {u: 0.360, th:0.298, k:1.735}],
    [-157.7, -19.3, {u: 0.360, th:0.298, k:1.735}],
    [-157.99, -19.7, {u: 0.360, th:0.298, k:1.735}],
    [-157.01, -19.3, {u: 0.360, th:0.298, k:1.735}],
    [-157.5, -19.99, {u: 0.360, th:0.298, k:1.735}],
    [-157.5, -19.01, {u: 0.360, th:0.298, k:1.735}],
])('getCrustFlux(%f, %f', (lon, lat, expected) => {
    test(`get expected result (${lon}, ${lat})`, () => {
        expect(getCrustFlux(lon, lat)).toEqual(expected)
    });
})