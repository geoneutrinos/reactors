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
    [0, 0, {u:0.91460944, th:0.83559626, k:3.99834172}], // should give the cell with midpoint 0.5,-0.5 (lon,lat)
    [180, 0, {u:0.38942915, th:0.32793336, k:1.85241163}], // should give the cell with midpoint -179.5,-0.5 (lon,lat)
    [-179.9, 0, {u:0.38942915, th:0.32793336, k:1.85241163}], // should give the cell with midpoint -179.5,-0.5 (lon,lat)
    [0, 90, {u:1.47552052, th:1.39473895, k:6.20690978}], // should give the cell with midpoint 0.5,89.5 (lon,lat)
])('getCrustFlux(%i, %i', (lon, lat, expected) => {
    test(`get expected result (${lon}, ${lat})`, () => {
        expect(getCrustFlux(lon, lat)).toEqual(expected)
    });
})