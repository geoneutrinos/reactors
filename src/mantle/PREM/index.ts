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

const layers = 6371;
export const layerVolumes = new Float64Array(layers).map(
  (_v, i) => 4/3 * math.pi * ((i + 1) ** 3 - i ** 3)
);
export const layerMasses = layerVolumes.map(
    (v,i) => v * rho[i]
);
const totalMass = sum(layerMasses);
