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

// derived from the first two columns, depth (km), density (g/cm3), from https://ds.iris.edu/spud/earthmodel/1568955
// and recast as PREM-like parameters
const AK135F = [
[   0.00,13.0122, -0.0629,0.0,0.0],
[  50.71,13.0117, -0.2135,0.0,0.0],
[ 101.43,13.0100, -0.3267,0.0,0.0],
[ 152.14,13.0074, -0.4773,0.0,0.0],
[ 202.85,13.0036, -0.6030,0.0,0.0],
[ 253.56,12.9988, -0.7412,0.0,0.0],
[ 304.28,12.9929, -0.8794,0.0,0.0],
[ 354.99,12.9859, -1.0051,0.0,0.0],
[ 405.70,12.9779, -1.1433,0.0,0.0],
[ 456.41,12.9688, -1.2812,0.0,0.0],
[ 507.13,12.9586, -1.4071,0.0,0.0],
[ 557.84,12.9474, -1.5454,0.0,0.0],
[ 608.55,12.9351, -1.6835,0.0,0.0],
[ 659.26,12.9217, -1.8213,0.0,0.0],
[ 709.98,12.9072, -1.9474,0.0,0.0],
[ 760.69,12.8917, -2.0855,0.0,0.0],
[ 811.40,12.8751, -2.2238,0.0,0.0],
[ 862.11,12.8574, -2.3489,0.0,0.0],
[ 912.83,12.8387, -2.5002,0.0,0.0],
[ 963.54,12.8188, -2.6132,0.0,0.0],
[1014.25,12.7980, -2.7640,0.0,0.0],
[1064.96,12.7760, -2.8890,0.0,0.0],
[1115.68,12.7530, -3.0279,0.0,0.0],
[1166.39,12.7289, -3.1412,0.0,0.0],
[1217.50,12.1391, -3.2920,0.0,0.0],
[1267.43,12.1133, -3.3671,0.0,0.0],
[1317.76,12.0867, -3.4684,0.0,0.0],
[1368.09,12.0593, -3.5697,0.0,0.0],
[1418.42,12.0311, -3.9234,0.0,0.0],
[1468.76,12.0001, -3.5317,0.0,0.0],
[1519.09,11.9722, -3.8989,0.0,0.0],
[1569.42,11.9414, -4.0001,0.0,0.0],
[1619.75,11.9098, -4.1266,0.0,0.0],
[1670.08,11.8772, -4.2405,0.0,0.0],
[1720.41,11.8437, -4.3672,0.0,0.0],
[1770.74,11.8092, -4.4938,0.0,0.0],
[1821.07,11.7737, -4.6077,0.0,0.0],
[1871.40,11.7373, -4.7460,0.0,0.0],
[1921.74,11.6998, -4.8862,0.0,0.0],
[1972.07,11.6612, -5.0127,0.0,0.0],
[2022.40,11.6216, -5.1520,0.0,0.0],
[2072.73,11.5809, -5.2913,0.0,0.0],
[2123.06,11.5391, -5.4305,0.0,0.0],
[2173.39,11.4962, -5.5823,0.0,0.0],
[2223.72,11.4521, -5.7215,0.0,0.0],
[2274.05,11.4069, -5.8862,0.0,0.0],
[2324.38,11.3604, -6.0369,0.0,0.0],
[2374.72,11.3127, -6.1774,0.0,0.0],
[2425.05,11.2639, -6.3545,0.0,0.0],
[2475.38,11.2137, -6.5065,0.0,0.0],
[2525.71,11.1623, -6.6837,0.0,0.0],
[2576.04,11.1095, -6.8355,0.0,0.0],
[2626.37,11.0555, -7.0128,0.0,0.0],
[2676.70,11.0001, -7.1773,0.0,0.0],
[2727.03,10.9434, -7.3673,0.0,0.0],
[2777.36,10.8852, -7.5303,0.0,0.0],
[2827.70,10.8257, -7.7216,0.0,0.0],
[2878.03,10.7647, -7.8988,0.0,0.0],
[2928.36,10.7023, -8.0761,0.0,0.0],
[2978.69,10.6385, -8.2786,0.0,0.0],
[3029.02,10.5731, -8.4685,0.0,0.0],
[3079.35,10.5062, -8.6583,0.0,0.0],
[3129.68,10.4378, -8.8483,0.0,0.0],
[3180.01,10.3679, -9.0508,0.0,0.0],
[3230.34,10.2964, -9.2515,0.0,0.0],
[3280.68,10.2233, -9.4685,0.0,0.0],
[3331.01,10.1485, -9.6585,0.0,0.0],
[3381.34,10.0722, -9.8736,0.0,0.0],
[3431.67, 9.9942,-10.6160,0.0,0.0],
[3479.50, 5.7721, -3.2118,0.0,0.0],
[3531.67, 5.7458, -3.3612,0.0,0.0],
[3581.33, 5.7196, -3.3606,0.0,0.0],
[3631.00, 5.4387, -2.6886,0.0,0.0],
[3681.00, 5.4176, -2.7268,0.0,0.0],
[3731.00, 5.3962, -2.8111,0.0,0.0],
[3779.50, 5.3748, -2.7930,0.0,0.0],
[3829.00, 5.3531, -2.8058,0.0,0.0],
[3878.50, 5.3313, -2.8444,0.0,0.0],
[3928.00, 5.3092, -2.8572,0.0,0.0],
[3977.50, 5.2870, -2.8831,0.0,0.0],
[4027.00, 5.2646, -2.9087,0.0,0.0],
[4076.50, 5.2420, -2.9345,0.0,0.0],
[4126.00, 5.2192, -2.9474,0.0,0.0],
[4175.50, 5.1963, -2.9731,0.0,0.0],
[4225.00, 5.1732, -2.9989,0.0,0.0],
[4274.50, 5.1499, -3.0246,0.0,0.0],
[4324.00, 5.1264, -3.0503,0.0,0.0],
[4373.50, 5.1027, -3.0633,0.0,0.0],
[4423.00, 5.0789, -3.1018,0.0,0.0],
[4472.50, 5.0548, -3.1147,0.0,0.0],
[4522.00, 5.0306, -3.1405,0.0,0.0],
[4571.50, 5.0062, -3.1533,0.0,0.0],
[4621.00, 4.9817, -3.1791,0.0,0.0],
[4670.50, 4.9570, -3.2048,0.0,0.0],
[4720.00, 4.9321, -3.2434,0.0,0.0],
[4769.50, 4.9069, -3.2434,0.0,0.0],
[4819.00, 4.8817, -3.2820,0.0,0.0],
[4868.50, 4.8562, -3.2821,0.0,0.0],
[4918.00, 4.8307, -3.3078,0.0,0.0],
[4967.50, 4.8050, -3.3464,0.0,0.0],
[5017.00, 4.7790, -3.3721,0.0,0.0],
[5066.50, 4.7528, -3.3721,0.0,0.0],
[5116.00, 4.7266, -3.4108,0.0,0.0],
[5165.50, 4.7001, -3.4236,0.0,0.0],
[5215.00, 4.6735, -3.4494,0.0,0.0],
[5264.50, 4.6467, -3.4622,0.0,0.0],
[5314.00, 4.6198, -3.5009,0.0,0.0],
[5363.50, 4.5926, -3.5008,0.0,0.0],
[5413.00, 4.5654, -6.3324,0.0,0.0],
[5462.50, 4.5162, -6.5898,0.0,0.0],
[5512.00, 4.4650, -6.8472,0.0,0.0],
[5561.50, 4.4118, -7.1175,0.0,0.0],
[5611.00, 4.3565, -7.3776,0.0,0.0],
[5661.00, 4.2986, -7.6325,0.0,0.0],
[5711.00, 3.9201,  0.0637,0.0,0.0],
[5761.00, 3.9206,  0.1529,0.0,0.0],
[5811.00, 3.9218,  0.1911,0.0,0.0],
[5861.00, 3.9233,  0.5097,0.0,0.0],
[5911.00, 3.9273,  0.5606,0.0,0.0],
[5961.00, 3.5068, -6.2563,0.0,0.0],
[6011.00, 3.4577, -5.9505,0.0,0.0],
[6061.00, 3.4110, -5.6957,0.0,0.0],
[6111.00, 3.3663, -5.3516,0.0,0.0],
[6161.00, 3.3243,  6.6258,0.0,0.0],
[6206.00, 3.3711,  7.8859,0.0,0.0],
[6251.00, 3.4268, 11.9775,0.0,0.0],
[6291.00, 3.5020, 13.4480,0.0,0.0],
[6328.00, 3.5801, 15.5197,0.0,0.0],
[6353.00, 2.9200,  0.0000,0.0,0.0],
[6361.00, 2.6000,  0.0000,0.0,0.0],
[6367.70, 2.0000,  0.0000,0.0,0.0],
[6368.00, 1.0200,  0.0000,0.0,0.0],
[6371.00, 0.0,0.0,0.0,0.0],
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
    const [depth, ...coefs] = [...AK135F].reverse().find(((elm) => elm[0] < r))!
    const poly = polynomial(...coefs)
    return poly(r/maxRadius)
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
