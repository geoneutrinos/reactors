// overburden-dependent muon-induced backgrouds

const depthBins = 1000;
const maximumDepth = 10; // km.w.e.
const deltaDepth = maximumDepth / depthBins; // km.w.e.

// make the array of overburdens 0 - 10 km.w.e.
export const depthValues = new Float64Array(depthBins).map(
  (_v, i) => i * deltaDepth + deltaDepth / 2
);

// differential muon intensity corresponding to flat overburden- Eq. 4 in Mei and Hime, PRD 73 (2006) 053004
export function flatOverburdenMuonIntensity(equivalentDepth: number) {
  const intensityParameter4a = 69.97e-6; // /cm^2/s
  const intensityParameter4b = 2.071e-6; // /cm^2/s
  const overburdenCoefficient4a = 0.285; // km.w.e.
  const overburdenCoefficient4b = 0.698; // km.w.e.
    
  return (intensityParameter4a * Math.exp(-equivalentDepth / overburdenCoefficient4a) + intensityParameter4b * Math.exp(-equivalentDepth / overburdenCoefficient4b));
}

// muon-induced neutron flux emerging from rock into cavern- Eq. 13 in Mei and Hime, PRD 73 (2006) 053004
export function neutronInducedFlux(flatDepth: number) {
  const intensityParameter13 = 4.0e-7; // /cm^2/s
  const overburdenCoefficient13 = 0.86; // km.w.e.
    
  return (intensityParameter13 * (overburdenCoefficient13 / flatDepth) * Math.exp(-flatDepth / overburdenCoefficient13));
}

export const muonFlatIntensity = depthValues.map((Dv) => flatOverburdenMuonIntensity(Dv))
export const neutronFlatIntensity = depthValues.map((Dv) => neutronInducedFlux(Dv))
