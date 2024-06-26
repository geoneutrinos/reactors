// I think it's easier just to include the data here since it has basically been fixed since 1981
export const briaudEtAl2023 = [
[258,7.822], // inner core
[362,5.025], // Outer Core
[560,3.559], // LVZ
[1698.6,3.362], // Mantle
[1737.1,2.649], // Crust
]

const layers = 17373;
const maxRadius = 1737.1;
const maxRadiusCubed = maxRadius * maxRadius * maxRadius;
const preFactor = 4 * Math.PI * 1e15 / 3; //1e5 cm/km

const innerCoreLayers = briaudEtAl2023[0][0] * 10;
const outerCoreLayers = briaudEtAl2023[1][0] * 10;
const LVZLayers = briaudEtAl2023[2][0] * 10;
const mantleLayers = briaudEtAl2023[3][0] * 10;
const crustLayers = (briaudEtAl2023[4][0] * 10) + 1;

export const lunarDensity = new Float64Array(layers);
lunarDensity.fill(briaudEtAl2023[0][1], 0, innerCoreLayers);
lunarDensity.fill(briaudEtAl2023[1][1], innerCoreLayers, outerCoreLayers);
lunarDensity.fill(briaudEtAl2023[2][1], outerCoreLayers, LVZLayers);
lunarDensity.fill(briaudEtAl2023[3][1], LVZLayers, mantleLayers);
lunarDensity.fill(briaudEtAl2023[4][1], mantleLayers, crustLayers);

function shellVolume(inner:number, outer:number): number {
    return preFactor * ((outer)**3 - (inner)**3)
}

export const lunarMasses = lunarDensity.map((den, i) => den * shellVolume(i/10, (i+1)/10));

export const lunarIntegral = lunarDensity.map((_, i) => geoIntegrate(i/10, (i+1)/10) * 1.5 / volumeRatio(i/10, (i+1)/10));

export const lunarGeoResponse = lunarDensity.map((den, i) => den * geoIntegrate(i/10, (i+1)/10) * maxRadius * 100 / 2);

function volumeRatio(x: number, y: number): number {
    return shellVolume(x,y) / maxRadiusCubed / preFactor
}

function geoIntegrate(inner: number, outer: number): number {
    const topPlus = 1 + outer / maxRadius
    const bottomPlus = 1 + inner / maxRadius
    const topMinus = 1 - outer / maxRadius
    const bottomMinus = 1 - inner / maxRadius
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

// it looks like we only need two layers from this model, the LVZ and the mantle
// The core(s) are assumed to not contribute and the crust we will get from the seperately modeled crust flux
// ah, but we need the others for the tabulated data
export const innerCoreMass = briaudEtAl2023[0][1] * shellVolume(0, 258)
export const innerCoreGeophysicalResponse = geoIntegrate(0, 258) * briaudEtAl2023[0][1] * maxRadius * 100 / 2
export const outerCoreMass = briaudEtAl2023[1][1] * shellVolume(258, 362)
export const outerCoreGeophysicalResponse = geoIntegrate(258, 362) * briaudEtAl2023[1][1] * maxRadius * 100 / 2
export const lvzMass = briaudEtAl2023[2][1] * shellVolume(362, 560)
export const lvzGeophysicalResponse = geoIntegrate(362, 560) * briaudEtAl2023[2][1] * maxRadius * 100 / 2
export const mantleMass = briaudEtAl2023[3][1] * shellVolume(560, 1698.6)
export const mantleGeophysicalResponse = geoIntegrate(560, 1698.6) * briaudEtAl2023[3][1] * maxRadius * 100 / 2
export const crustMass = briaudEtAl2023[4][1] * shellVolume(1698.6, 1737.1)
export const crustGeophysicalResponse = geoIntegrate(1698.6, 1737.0999999) * briaudEtAl2023[4][1] * maxRadius * 100 / 2
export const lunarMass = innerCoreMass + outerCoreMass + lvzMass + mantleMass + crustMass
