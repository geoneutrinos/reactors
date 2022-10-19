// overburden-dependent muon-induced backgrouds

const depthBins = 1000;
const maximumDepth = 10; // km.w.e.
const deltaDepth = maximumDepth / depthBins; // km.w.e.

// make the array of overburdens 0 - 10 km.w.e.
export const depthValues = new Float64Array(depthBins).map(
  (v, i) => i * deltaDepth + deltaDepth / 2
);

// Muon Depth Intensity Relationship (DIR) Eq. 1 in Mei and Hime, PRD 73 (2006) 053004
function muonIntensity(depth: number) {
  const intensityParameter1 = 8.60e-6; // /cm^2/s/sr
  const intensityParameter2 = 0.44e-6; // /cm^2/s/sr
  const overburdenCoefficient1 = 0.45; // km.w.e.
  const overburdenCoefficient2 = 0.87; // km.w.e.
    
  return (intensityParameter1 * Math.exp(-depth / overburdenCoefficient1) + intensityParameter2 * Math.exp(-depth / overburdenCoefficient2));
}
  
