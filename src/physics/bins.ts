export const binStart = 0 // MeV
export const binEnd = 10 // MeV
export const binCount = 1000
export const binAlign = 0.5 // number between 0 and 1, 0 is left edge, 1 is right edge


const calcBins = (binStart:number, binEnd:number, binCount:number, binAlign:number):Float64Array => {
  const binWidth = (binEnd - binStart) / binCount;
  const offset = binWidth * binAlign;
  return new Float64Array(binCount).map((_, i) => binStart + offset + binWidth * i)
}

export default calcBins(binStart, binEnd, binCount, binAlign)