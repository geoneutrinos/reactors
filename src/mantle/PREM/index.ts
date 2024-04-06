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
[   0.00,13.0122,-0.0000099,0.0,0.0],
[  50.71,13.0117,-0.0000335,0.0,0.0],
[ 101.43,13.0100,-0.0000513,0.0,0.0],
[ 152.14,13.0074,-0.0000749,0.0,0.0],
[ 202.85,13.0036,-0.0000947,0.0,0.0],
[ 253.56,12.9988,-0.0001163,0.0,0.0],
[ 304.28,12.9929,-0.0001380,0.0,0.0],
[ 354.99,12.9859,-0.0001578,0.0,0.0],
[ 405.70,12.9779,-0.0001795,0.0,0.0],
[ 456.41,12.9688,-0.0002011,0.0,0.0],
[ 507.13,12.9586,-0.0002209,0.0,0.0],
[ 557.84,12.9474,-0.0002426,0.0,0.0],
[ 608.55,12.9351,-0.0002642,0.0,0.0],
[ 659.26,12.9217,-0.0002859,0.0,0.0],
[ 709.98,12.9072,-0.0003057,0.0,0.0],
[ 760.69,12.8917,-0.0003273,0.0,0.0],
[ 811.40,12.8751,-0.0003490,0.0,0.0],
[ 862.11,12.8574,-0.0003687,0.0,0.0],
[ 912.83,12.8387,-0.0003924,0.0,0.0],
[ 963.54,12.8188,-0.0004102,0.0,0.0],
[1014.25,12.7980,-0.0004338,0.0,0.0],
[1064.96,12.7760,-0.0004535,0.0,0.0],
[1115.68,12.7530,-0.0004753,0.0,0.0],
[1166.39,12.7289,-0.0004931,0.0,0.0],
[1217.50,12.1391,-0.0005167,0.0,0.0],
[1267.43,12.1133,-0.0005285,0.0,0.0],
[1317.76,12.0867,-0.0005444,0.0,0.0],
[1368.09,12.0593,-0.0005603,0.0,0.0],
[1418.42,12.0311,-0.0006158,0.0,0.0],
[1468.76,12.0001,-0.0005543,0.0,0.0],
[1519.09,11.9722,-0.0006120,0.0,0.0],
[1569.42,11.9414,-0.0006279,0.0,0.0],
[1619.75,11.9098,-0.0006477,0.0,0.0],
[1670.08,11.8772,-0.0006656,0.0,0.0],
[1720.41,11.8437,-0.0006855,0.0,0.0],
[1770.74,11.8092,-0.0007054,0.0,0.0],
[1821.07,11.7737,-0.0007232,0.0,0.0],
[1871.40,11.7373,-0.0007449,0.0,0.0],
[1921.74,11.6998,-0.0007669,0.0,0.0],
[1972.07,11.6612,-0.0007868,0.0,0.0],
[2022.40,11.6216,-0.0008087,0.0,0.0],
[2072.73,11.5809,-0.0008305,0.0,0.0],
[2123.06,11.5391,-0.0008524,0.0,0.0],
[2173.39,11.4962,-0.0008762,0.0,0.0],
[2223.72,11.4521,-0.0008981,0.0,0.0],
[2274.05,11.4069,-0.0009239,0.0,0.0],
[2324.38,11.3604,-0.0009476,0.0,0.0],
[2374.72,11.3127,-0.0009696,0.0,0.0],
[2425.05,11.2639,-0.0009974,0.0,0.0],
[2475.38,11.2137,-0.0010213,0.0,0.0],
[2525.71,11.1623,-0.0010491,0.0,0.0],
[2576.04,11.1095,-0.0010729,0.0,0.0],
[2626.37,11.0555,-0.0011007,0.0,0.0],
[2676.70,11.0001,-0.0011266,0.0,0.0],
[2727.03,10.9434,-0.0011564,0.0,0.0],
[2777.36,10.8852,-0.0011820,0.0,0.0],
[2827.70,10.8257,-0.0012120,0.0,0.0],
[2878.03,10.7647,-0.0012398,0.0,0.0],
[2928.36,10.7023,-0.0012676,0.0,0.0],
[2978.69,10.6385,-0.0012994,0.0,0.0],
[3029.02,10.5731,-0.0013292,0.0,0.0],
[3079.35,10.5062,-0.0013590,0.0,0.0],
[3129.68,10.4378,-0.0013888,0.0,0.0],
[3180.01,10.3679,-0.0014206,0.0,0.0],
[3230.34,10.2964,-0.0014521,0.0,0.0],
[3280.68,10.2233,-0.0014862,0.0,0.0],
[3331.01,10.1485,-0.0015160,0.0,0.0],
[3381.34,10.0722,-0.0015498,0.0,0.0],
[3431.67, 9.9942,-0.0016663,0.0,0.0],
[3479.50, 5.7721,-0.0005041,0.0,0.0],
[3531.67, 5.7458,-0.0005276,0.0,0.0],
[3581.33, 5.7196,-0.0005275,0.0,0.0],
[3631.00, 5.4387,-0.0004220,0.0,0.0],
[3681.00, 5.4176,-0.0004280,0.0,0.0],
[3731.00, 5.3962,-0.0004412,0.0,0.0],
[3779.50, 5.3748,-0.0004384,0.0,0.0],
[3829.00, 5.3531,-0.0004404,0.0,0.0],
[3878.50, 5.3313,-0.0004465,0.0,0.0],
[3928.00, 5.3092,-0.0004485,0.0,0.0],
[3977.50, 5.2870,-0.0004525,0.0,0.0],
[4027.00, 5.2646,-0.0004566,0.0,0.0],
[4076.50, 5.2420,-0.0004606,0.0,0.0],
[4126.00, 5.2192,-0.0004626,0.0,0.0],
[4175.50, 5.1963,-0.0004667,0.0,0.0],
[4225.00, 5.1732,-0.0004707,0.0,0.0],
[4274.50, 5.1499,-0.0004747,0.0,0.0],
[4324.00, 5.1264,-0.0004788,0.0,0.0],
[4373.50, 5.1027,-0.0004808,0.0,0.0],
[4423.00, 5.0789,-0.0004869,0.0,0.0],
[4472.50, 5.0548,-0.0004889,0.0,0.0],
[4522.00, 5.0306,-0.0004929,0.0,0.0],
[4571.50, 5.0062,-0.0004949,0.0,0.0],
[4621.00, 4.9817,-0.0004990,0.0,0.0],
[4670.50, 4.9570,-0.0005030,0.0,0.0],
[4720.00, 4.9321,-0.0005091,0.0,0.0],
[4769.50, 4.9069,-0.0005091,0.0,0.0],
[4819.00, 4.8817,-0.0005151,0.0,0.0],
[4868.50, 4.8562,-0.0005152,0.0,0.0],
[4918.00, 4.8307,-0.0005192,0.0,0.0],
[4967.50, 4.8050,-0.0005253,0.0,0.0],
[5017.00, 4.7790,-0.0005293,0.0,0.0],
[5066.50, 4.7528,-0.0005293,0.0,0.0],
[5116.00, 4.7266,-0.0005354,0.0,0.0],
[5165.50, 4.7001,-0.0005374,0.0,0.0],
[5215.00, 4.6735,-0.0005414,0.0,0.0],
[5264.50, 4.6467,-0.0005434,0.0,0.0],
[5314.00, 4.6198,-0.0005495,0.0,0.0],
[5363.50, 4.5926,-0.0005495,0.0,0.0],
[5413.00, 4.5654,-0.0009939,0.0,0.0],
[5462.50, 4.5162,-0.0010343,0.0,0.0],
[5512.00, 4.4650,-0.0010748,0.0,0.0],
[5561.50, 4.4118,-0.0011172,0.0,0.0],
[5611.00, 4.3565,-0.0011580,0.0,0.0],
[5661.00, 4.2986,-0.0011980,0.0,0.0],
[5711.00, 3.9201, 0.0000100,0.0,0.0],
[5761.00, 3.9206, 0.0000240,0.0,0.0],
[5811.00, 3.9218, 0.0000300,0.0,0.0],
[5861.00, 3.9233, 0.0000800,0.0,0.0],
[5911.00, 3.9273, 0.0000880,0.0,0.0],
[5961.00, 3.5068,-0.0009820,0.0,0.0],
[6011.00, 3.4577,-0.0009340,0.0,0.0],
[6061.00, 3.4110,-0.0008940,0.0,0.0],
[6111.00, 3.3663,-0.0008400,0.0,0.0],
[6161.00, 3.3243, 0.0010400,0.0,0.0],
[6206.00, 3.3711, 0.0012378,0.0,0.0],
[6251.00, 3.4268, 0.0018800,0.0,0.0],
[6291.00, 3.5020, 0.0021108,0.0,0.0],
[6328.00, 3.5801, 0.0024360,0.0,0.0],
[6353.00, 2.9200, 0.0000000,0.0,0.0],
[6361.00, 2.6000, 0.0000000,0.0,0.0],
[6367.70, 2.0000, 0.0000000,0.0,0.0],
[6368.00, 1.0200, 0.0000000,0.0,0.0],
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
    const [depth, ...coefs] = [...PREM].reverse().find(((elm) => elm[0] < r))!
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
