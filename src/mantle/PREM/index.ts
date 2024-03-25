import { removeEmitHelper } from "typescript"

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

const layerMasses = bins.map(radius => rho(radius) * preFactor * ((radius + offset)**3 - (radius - offset)**3));
const innerCoreStartIndex = 1;
const innerCoreEndIndex = 12215;
export const innerCoreMass = layerMasses
    .slice(innerCoreStartIndex, innerCoreEndIndex)
    .reduce((innerCoreAccumulator, innerCoreCurrentValue) => innerCoreAccumulator + innerCoreCurrentValue);
const outerCoreStartIndex = 12215;
const outerCoreEndIndex = 34800;
export const outerCoreMass = layerMasses
    .slice(outerCoreStartIndex, outerCoreEndIndex)
    .reduce((outerCoreAccumulator, outerCoreCurrentValue) => outerCoreAccumulator + outerCoreCurrentValue);
const mantleStartIndex = 34800;
const mantleEndIndex = 63466;
export const mantleMass = layerMasses
    .slice(mantleStartIndex, mantleEndIndex)
    .reduce((mantleAccumulator, mantleCurrentValue) => mantleAccumulator + mantleCurrentValue);
const lowerCrustStartIndex = 63466;
const lowerCrustEndIndex = 63560;
export const lowerCrustMass = layerMasses
    .slice(lowerCrustStartIndex, lowerCrustEndIndex)
    .reduce((lowerCrustAccumulator, lowerCrustCurrentValue) => lowerCrustAccumulator + lowerCrustCurrentValue);
const upperCrustStartIndex = 63560;
const upperCrustEndIndex = 63680;
export const upperCrustMass = layerMasses
    .slice(upperCrustStartIndex, upperCrustEndIndex)
    .reduce((upperCrustAccumulator, upperCrustCurrentValue) => upperCrustAccumulator + upperCrustCurrentValue);
export const earthMass = innerCoreMass + outerCoreMass + mantleMass + lowerCrustMass + upperCrustMass;
