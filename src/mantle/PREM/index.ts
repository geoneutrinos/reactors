// I think it's easier just to include the data here since it has basically been fixed since 1981
const PREM = [
[0.0,13.0885,0.0,-8.8381,0.0],
[1221.5,12.5815,-1.2638,-3.6426,-5.5281],
[3480.0,7.9565,-6.4761,5.5283,-3.0807],
[3630.0,7.9565,-6.4761,5.5283,-3.0807],
[5600.0,7.9565,-6.4761,5.5283,-3.0807],
[5701.0,5.3197,-1.4836,0.0,0.0],
[5771.0,11.2494,-8.0298,0.0,0.0],
[5971.0,7.1089,-3.8045,0.0,0.0],
[6151.0,2.6910,0.6924,0.0,0.0],
[6291.0,2.6910,0.6924,0.0,0.0],
[6346.6,2.900,0.0,0.0,0.0],
[6356.0,2.600,0.0,0.0,0.0],
[6368.0,1.020,0.0,0.0,0.0],
[6371.0,0.0,0.0,0.0,0.0],
]

// depth (km), density (g/cm3) are the first two columns from https://ds.iris.edu/spud/earthmodel/1568955
const AK135F = [
[   0.00, 1.0200],
[   3.00, 1.0200],
[   3.00, 2.0000],
[   3.30, 2.0000],
[   3.30, 2.6000],
[  10.00, 2.6000],
[  10.00, 2.9200],
[  18.00, 2.9200],
[  18.00, 3.6410],
[  43.00, 3.5801],
[  80.00, 3.5020],
[  80.00, 3.5020],
[ 120.00, 3.4268],
[ 120.00, 3.4268],
[ 165.00, 3.3711],
[ 210.00, 3.3243],
[ 210.00, 3.3243],
[ 260.00, 3.3663],
[ 310.00, 3.4110],
[ 360.00, 3.4577],
[ 410.00, 3.5068],
[ 410.00, 3.9317],
[ 460.00, 3.9273],
[ 510.00, 3.9233],
[ 560.00, 3.9218],
[ 610.00, 3.9206],
[ 660.00, 3.9201],
[ 660.00, 4.2387],
[ 710.00, 4.2986],
[ 760.00, 4.3565],
[ 809.50, 4.4118],
[ 859.00, 4.4650],
[ 908.50, 4.5162],
[ 958.00, 4.5654],
[1007.50, 4.5926],
[1057.00, 4.6198],
[1106.50, 4.6467],
[1156.00, 4.6735],
[1205.50, 4.7001],
[1255.00, 4.7266],
[1304.50, 4.7528],
[1354.00, 4.7790],
[1403.50, 4.8050],
[1453.00, 4.8307],
[1502.50, 4.8562],
[1552.00, 4.8817],
[1601.50, 4.9069],
[1651.00, 4.9321],
[1700.50, 4.9570],
[1750.00, 4.9817],
[1799.50, 5.0062],
[1849.00, 5.0306],
[1898.50, 5.0548],
[1948.00, 5.0789],
[1997.50, 5.1027],
[2047.00, 5.1264],
[2096.50, 5.1499],
[2146.00, 5.1732],
[2195.50, 5.1963],
[2245.00, 5.2192],
[2294.50, 5.2420],
[2344.00, 5.2646],
[2393.50, 5.2870],
[2443.00, 5.3092],
[2492.50, 5.3313],
[2542.00, 5.3531],
[2591.50, 5.3748],
[2640.00, 5.3962],
[2690.00, 5.4176],
[2740.00, 5.4387],
[2740.00, 5.6934],
[2789.67, 5.7196],
[2839.33, 5.7458],
[2891.50, 5.7721],
[2891.50, 9.9145],
[2939.33, 9.9942],
[2989.66,10.0722],
[3039.99,10.1485],
[3090.32,10.2233],
[3140.66,10.2964],
[3190.99,10.3679],
[3241.32,10.4378],
[3291.65,10.5062],
[3341.98,10.5731],
[3392.31,10.6385],
[3442.64,10.7023],
[3492.97,10.7647],
[3543.30,10.8257],
[3593.64,10.8852],
[3643.97,10.9434],
[3694.30,11.0001],
[3744.63,11.0555],
[3794.96,11.1095],
[3845.29,11.1623],
[3895.62,11.2137],
[3945.95,11.2639],
[3996.28,11.3127],
[4046.62,11.3604],
[4096.95,11.4069],
[4147.28,11.4521],
[4197.61,11.4962],
[4247.94,11.5391],
[4298.27,11.5809],
[4348.60,11.6216],
[4398.93,11.6612],
[4449.26,11.6998],
[4499.60,11.7373],
[4549.93,11.7737],
[4600.26,11.8092],
[4650.59,11.8437],
[4700.92,11.8772],
[4751.25,11.9098],
[4801.58,11.9414],
[4851.91,11.9722],
[4902.24,12.0001],
[4952.58,12.0311],
[5002.91,12.0593],
[5053.24,12.0867],
[5103.57,12.1133],
[5153.50,12.1391],
[5153.50,12.7037],
[5204.61,12.7289],
[5255.32,12.7530],
[5306.04,12.7760],
[5356.75,12.7980],
[5407.46,12.8188],
[5458.17,12.8387],
[5508.89,12.8574],
[5559.60,12.8751],
[5610.31,12.8917],
[5661.02,12.9072],
[5711.74,12.9217],
[5762.45,12.9351],
[5813.16,12.9474],
[5863.87,12.9586],
[5914.59,12.9688],
[5965.30,12.9779],
[6016.01,12.9859],
[6066.72,12.9929],
[6117.44,12.9988],
[6168.15,13.0036],
[6218.86,13.0074],
[6269.57,13.0100],
[6320.29,13.0117],
[6371.00,13.0122],
]

export const layers = 63710;
export const maxRadius = 6371;
export const binWidth = maxRadius / layers;
export const offset = binWidth * 0.5;
export const bins = new Float64Array(layers).map((_, i) => 0 + offset + binWidth * i);
export const preFactor = 4 * Math.PI * 1e15 / 3;

/**
 * polynomial(a0, a1, ... , an) generates a function f(x) that will compute the power series in the form:
 * 
 * f(x) = a0 + a1x + a2x^2 +... 
 * 
 * @param coefficients {number[]}
 * @returns function f(x)
 */
export function polynomial(...coefficients:number[]) {
    return (x:number):number => {
        return coefficients.reduce((previous, currernt, index) =>{
            return previous + currernt * x ** index
        })
    }
}

/**
 * 
 * @param r {number} radius of the layer
 */
export function rho(r:number): number {
    // The layer we want will be the first layer with a boundry lower than our target when searched from the top
    const [depth, ...coefs] = [...PREM].reverse().find(((elm) => elm[0] < r))!
    const poly = polynomial(...coefs)
    return poly(r/6371)
}

export function geoIntegrate(x: number): number {
    const topPlus = 1 + (x+offset) / maxRadius
    const bottomPlus = 1 + (x-offset) / maxRadius
    const topMinus = 1 - (x+offset) / maxRadius
    const bottomMinus = 1 - (x-offset) / maxRadius
    const termPlus1 = (Math.log(topPlus) / 2 - 0.25) * topPlus**2
    const termPlus2 = (Math.log(bottomPlus) / 2 - 0.25) * bottomPlus**2
    const termPlus3 = topPlus * Math.log(topPlus) - topPlus
    const termPlus4 = bottomPlus * Math.log(bottomPlus) - bottomPlus
    const termMinus1 = (Math.log(topMinus) / 2 - 0.25) * topMinus**2
    const termMinus2 = (Math.log(bottomMinus) / 2 - 0.25) * bottomMinus**2
    const termMinus3 = topMinus * Math.log(topMinus) - topMinus
    const termMinus4 = bottomMinus * Math.log(bottomMinus) - bottomMinus
    return (termPlus1 - termPlus2 - termPlus3 + termPlus4 - termMinus1 + termMinus2 + termMinus3 - termMinus4)
}

export function volumeRatio(x: number): number {
    return ((x+offset)**3 - (x-offset)**3) / maxRadius**3
}

const layerMasses = bins.map(radius => rho(radius) * preFactor * ((radius + offset)**3 - (radius - offset)**3));
const innerCoreStartIndex = 1;
const innerCoreEndIndex = 12215;
export const innerCoreMass = layerMasses
    .slice(innerCoreStartIndex, innerCoreEndIndex)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
const outerCoreStartIndex = 12215;
const outerCoreEndIndex = 34800;
export const outerCoreMass = layerMasses
    .slice(outerCoreStartIndex, outerCoreEndIndex)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
const mantleStartIndex = 34800;
const mantleEndIndex = 63466;
export const mantleMass = layerMasses
    .slice(mantleStartIndex, mantleEndIndex)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
const lowerCrustStartIndex = 63466;
const lowerCrustEndIndex = 63560;
export const lowerCrustMass = layerMasses
    .slice(lowerCrustStartIndex, lowerCrustEndIndex)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
const upperCrustStartIndex = 63560;
const upperCrustEndIndex = 63680;
export const upperCrustMass = layerMasses
    .slice(upperCrustStartIndex, upperCrustEndIndex)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
const oceanStartIndex = 63680;
const oceanEndIndex = 63710;
export const oceanMass = layerMasses
    .slice(oceanStartIndex, oceanEndIndex)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const earthMass = innerCoreMass + outerCoreMass + mantleMass + lowerCrustMass + upperCrustMass + oceanMass;
const layerGeoResponse = bins.map(bin => geoIntegrate(bin) * rho(bin) * maxRadius * 100 / 2);
export const innerCoreGeophysicalResponse = layerGeoResponse
    .slice(innerCoreStartIndex, innerCoreEndIndex)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const outerCoreGeophysicalResponse = layerGeoResponse
    .slice(outerCoreStartIndex, outerCoreEndIndex)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const mantleGeophysicalResponse = layerGeoResponse
    .slice(mantleStartIndex, mantleEndIndex)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const lowerCrustGeophysicalResponse = layerGeoResponse
    .slice(lowerCrustStartIndex, lowerCrustEndIndex)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const upperCrustGeophysicalResponse = layerGeoResponse
    .slice(upperCrustStartIndex, upperCrustEndIndex)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const oceanGeophysicalResponse = layerGeoResponse
    .slice(oceanStartIndex, oceanEndIndex - 1)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
