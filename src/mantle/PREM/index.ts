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
// and assumes linear density changes
const AK135F = [
[   0.00,13.0122, -0.0628],
[  50.71,13.0117, -0.2135],
[ 101.43,13.0100, -0.3267],
[ 152.14,13.0074, -0.4774],
[ 202.85,13.0036, -0.6031],
[ 253.56,12.9988, -0.7411],
[ 304.28,12.9929, -0.8795],
[ 354.99,12.9859, -1.0051],
[ 405.70,12.9779, -1.1433],
[ 456.41,12.9688, -1.2812],
[ 507.13,12.9586, -1.4071],
[ 557.84,12.9474, -1.5453],
[ 608.55,12.9351, -1.6835],
[ 659.26,12.9217, -1.8214],
[ 709.98,12.9072, -1.9474],
[ 760.69,12.8917, -2.0856],
[ 811.40,12.8751, -2.2238],
[ 862.11,12.8574, -2.3489],
[ 912.83,12.8387, -2.5002],
[ 963.54,12.8188, -2.6132],
[1014.25,12.7980, -2.7640],
[1064.96,12.7760, -2.8891],
[1115.68,12.7530, -3.0278],
[1166.39,12.7289, -3.1412],
[1217.50,12.1391, -3.2920],
[1267.43,12.1133, -3.3671],
[1317.76,12.0867, -3.4684],
[1368.09,12.0593, -3.5697],
[1418.42,12.0311, -3.9233],
[1468.76,12.0001, -3.5317],
[1519.09,11.9722, -3.8988],
[1569.42,11.9414, -4.0001],
[1619.75,11.9098, -4.1267],
[1670.08,11.8772, -4.2406],
[1720.41,11.8437, -4.3672],
[1770.74,11.8092, -4.4938],
[1821.07,11.7737, -4.6077],
[1871.40,11.7373, -4.7460],
[1921.74,11.6998, -4.8862],
[1972.07,11.6612, -5.0127],
[2022.40,11.6216, -5.1520],
[2072.73,11.5809, -5.2912],
[2123.06,11.5391, -5.4305],
[2173.39,11.4962, -5.5824],
[2223.72,11.4521, -5.7216],
[2274.05,11.4069, -5.8862],
[2324.38,11.3604, -6.0369],
[2374.72,11.3127, -6.1773],
[2425.05,11.2639, -6.3545],
[2475.38,11.2137, -6.5064],
[2525.71,11.1623, -6.6837],
[2576.04,11.1095, -6.8356],
[2626.37,11.0555, -7.0128],
[2676.70,11.0001, -7.1773],
[2727.03,10.9434, -7.3672],
[2777.36,10.8852, -7.5303],
[2827.70,10.8257, -7.7217],
[2878.03,10.7647, -7.8989],
[2928.36,10.7023, -8.0761],
[2978.69,10.6385, -8.2786],
[3029.02,10.5731, -8.4685],
[3079.35,10.5062, -8.6584],
[3129.68,10.4378, -8.8483],
[3180.01,10.3679, -9.0508],
[3230.34,10.2964, -9.2515],
[3280.68,10.2233, -9.4685],
[3331.01,10.1485, -9.6584],
[3381.34,10.0722, -9.8736],
[3431.67, 9.9942,-10.6161],
[3479.50, 5.7721, -3.2118],
[3531.67, 5.7458, -3.3613],
[3581.33, 5.7196, -3.3606],
[3631.00, 5.4387, -2.6886],
[3681.00, 5.4176, -2.7268],
[3731.00, 5.3962, -2.8111],
[3779.50, 5.3748, -2.7929],
[3829.00, 5.3531, -2.8058],
[3878.50, 5.3313, -2.8444],
[3928.00, 5.3092, -2.8573],
[3977.50, 5.2870, -2.8830],
[4027.00, 5.2646, -2.9088],
[4076.50, 5.2420, -2.9345],
[4126.00, 5.2192, -2.9474],
[4175.50, 5.1963, -2.9731],
[4225.00, 5.1732, -2.9989],
[4274.50, 5.1499, -3.0246],
[4324.00, 5.1264, -3.0504],
[4373.50, 5.1027, -3.0632],
[4423.00, 5.0789, -3.1018],
[4472.50, 5.0548, -3.1147],
[4522.00, 5.0306, -3.1405],
[4571.50, 5.0062, -3.1533],
[4621.00, 4.9817, -3.1791],
[4670.50, 4.9570, -3.2048],
[4720.00, 4.9321, -3.2434],
[4769.50, 4.9069, -3.2434],
[4819.00, 4.8817, -3.2820],
[4868.50, 4.8562, -3.2820],
[4918.00, 4.8307, -3.3078],
[4967.50, 4.8050, -3.3464],
[5017.00, 4.7790, -3.3721],
[5066.50, 4.7528, -3.3721],
[5116.00, 4.7266, -3.4107],
[5165.50, 4.7001, -3.4236],
[5215.00, 4.6735, -3.4493],
[5264.50, 4.6467, -3.4622],
[5314.00, 4.6198, -3.5008],
[5363.50, 4.5926, -3.5008],
[5413.00, 4.5654, -6.3324],
[5462.50, 4.5162, -6.5898],
[5512.00, 4.4650, -6.8472],
[5561.50, 4.4118, -7.1175],
[5611.00, 4.3565, -7.3776],
[5661.00, 4.2986, -7.6325],
[5711.00, 3.9201,  0.0637],
[5761.00, 3.9206,  0.1529],
[5811.00, 3.9218,  0.1911],
[5861.00, 3.9233,  0.5097],
[5911.00, 3.9273,  0.5606],
[5961.00, 3.5068, -6.2563],
[6011.00, 3.4577, -5.9505],
[6061.00, 3.4110, -5.6957],
[6111.00, 3.3663, -5.3516],
[6161.00, 3.3243,  6.6258],
[6206.00, 3.3711,  7.8859],
[6251.00, 3.4268, 11.9775],
[6291.00, 3.5020, 13.4480],
[6328.00, 3.5801, 15.5198],
[6353.00, 2.9200,  0.0000],
[6361.00, 2.6000,  0.0000],
[6367.70, 2.0000,  0.0000],
[6368.00, 1.0200,  0.0000],
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
    return poly(r/maxRadius)
}

export function linearFit(r:number): number {
    const [radius,intercept,slope] = [...AK135F].reverse().find(((elm) => elm[0] < r))!
    return intercept + slope * (r - radius) / maxRadius
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

// PREM
const layerMasses = bins.map(radius => rho(radius) * preFactor * ((radius + offset)**3 - (radius - offset)**3));
export const innerCoreMass = layerMasses
    .slice(1, 12215)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const outerCoreMass = layerMasses
    .slice(12215, 34800)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const lowerMantleMass = layerMasses
    .slice(34800, 57010)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const upperMantleMass = layerMasses
    .slice(57010, 63466)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const lowerCrustMass = layerMasses
    .slice(63466, 63560)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const upperCrustMass = layerMasses
    .slice(63560, 63680)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const oceanMass = layerMasses
    .slice(63680, 63710)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const earthMass = innerCoreMass + outerCoreMass + mantleMass + lowerCrustMass + upperCrustMass + oceanMass;
const layerGeoResponse = bins.map(bin => geoIntegrate(bin) * rho(bin) * maxRadius * 100 / 2);
export const innerCoreGeophysicalResponse = layerGeoResponse
    .slice(1, 12215)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const outerCoreGeophysicalResponse = layerGeoResponse
    .slice(12215, 34800)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const lowerMantleGeophysicalResponse = layerGeoResponse
    .slice(34800, 57010)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const upperMantleGeophysicalResponse = layerGeoResponse
    .slice(57010, 63466)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const lowerCrustGeophysicalResponse = layerGeoResponse
    .slice(63466, 63560)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const upperCrustGeophysicalResponse = layerGeoResponse
    .slice(63560, 63680)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const oceanGeophysicalResponse = layerGeoResponse
    .slice(63680, 63709)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
// AK135F Model
const layerMassesAK135F = bins.map(radius => linearFit(radius) * preFactor * ((radius + offset)**3 - (radius - offset)**3));
export const earthMassAK135F = layerMassesAK135F
    .slice(1, 63710)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const innerCoreMassAK135F = layerMassesAK135F
    .slice(1, 12175)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const outerCoreMassAK135F = layerMassesAK135F
    .slice(12175, 34795)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const lowerMantleMassAK135F = layerMassesAK135F
    .slice(34795, 57110)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const upperMantleMassAK135F = layerMassesAK135F
    .slice(57110, 63530)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const lowerCrustMassAK135F = layerMassesAK135F
    .slice(63530, 63610)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const upperCrustMassAK135F = layerMassesAK135F
    .slice(63610, 63680)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
const layerGeoResponseAK135F = bins.map(bin => geoIntegrate(bin) * linearFit(bin) * maxRadius * 100 / 2);
export const innerCoreGeophysicalResponseAK135F = layerGeoResponseAK135F
    .slice(1, 12175)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const outerCoreGeophysicalResponseAK135F = layerGeoResponseAK135F
    .slice(12175, 34795)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const lowerMantleGeophysicalResponseAK135F = layerGeoResponseAK135F
    .slice(34795, 57110)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const upperMantleGeophysicalResponseAK135F = layerGeoResponseAK135F
    .slice(57110, 63530)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const lowerCrustGeophysicalResponseAK135F = layerGeoResponseAK135F
    .slice(63530, 63610)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
export const upperCrustGeophysicalResponseAK135F = layerGeoResponseAK135F
    .slice(63610, 63680)
    .reduce((Accumulator, CurrentValue) => Accumulator + CurrentValue);
