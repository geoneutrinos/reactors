import {IBD_THRESHOLD} from "./derived"

export const binStart = 0 // MeV
export const binEnd = 10 // MeV
export const binCount = 1000
export const binAlign = 1e-40 // number in the range (0, 1] 0 is left edge (not inclusive), 1 is right edge

export const binWidth = (binEnd - binStart) / binCount;

// This figures out which bin the IBD threshold is in and ensure that the bin center is always 0.5 binwidths away
const IBD_bin_remainder = IBD_THRESHOLD/binWidth - Math.floor(IBD_THRESHOLD/binWidth)
// we always want the number to be between 0 and 1
//export const binAlign = IBD_bin_remainder < 0.5? IBD_bin_remainder + 0.5 : IBD_bin_remainder - 0.5
export const IBD_threshold_bin = IBD_bin_remainder < 0.5? Math.floor(IBD_THRESHOLD/binWidth) : Math.floor(IBD_THRESHOLD/binWidth) + 1

const calcBins = (binStart:number, binEnd:number, binCount:number, binAlign:number):Float64Array => {
//  const offset = binWidth * binAlign;
// we use midpoint numerical integration
  const offset = binWidth * 0.5
  return new Float64Array(binCount).map((_, i) => binStart + offset + binWidth * i)
}

export const shiftByIBD = (arr:number[]|Float64Array|Float32Array):Float64Array => {
  const output = (new Float64Array(binCount)).fill(0)
  output.set(arr.slice(IBD_threshold_bin))
  return output
}

export default calcBins(binStart, binEnd, binCount, binAlign)
