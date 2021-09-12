import {IBD_THRESHOLD} from "./derived"

export const binStart = 0 // MeV
export const binEnd = 10 // MeV
export const binCount = 1000
//export const binAlign = 0.107 // number between 0 and 1, 0 is left edge, 1 is right edge

export const binWidth = (binEnd - binStart) / binCount;

// This figures out which bin the IBD threshold is in and ensure that the bin center is always 0.5 binwidths away
const IBD_bin_remainder = IBD_THRESHOLD/binWidth - Math.floor(IBD_THRESHOLD/binWidth)
// we always want the number to be between 0 and 1
export const binAlign = IBD_bin_remainder < 0.5? IBD_bin_remainder + 0.5 : IBD_bin_remainder - 0.5

const calcBins = (binStart:number, binEnd:number, binCount:number, binAlign:number):Float64Array => {
  const offset = binWidth * binAlign;
  return new Float64Array(binCount).map((_, i) => binStart + offset + binWidth * i)
}

export default calcBins(binStart, binEnd, binCount, binAlign)