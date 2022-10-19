// overburden-dependent muon-induced backgrouds

const depthBins = 1000;
const maximumDepth = 10; // km.w.e.
const deltaDepth = maximumDepth / depthBins; // km.w.e.

// make the array of overburdens 0 - 10 km.w.e.
export const depthValues = new Float64Array(depthBins).map(
  (v, i) => i * deltaDepth + deltaDepth / 2
);
