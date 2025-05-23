import {zip} from 'lodash';
import SunCalc from 'suncalc';

export const EARTH_REGIONS = ["Africa", "Asia", "Europe","Mediterranean Sea", "North America", "Oceania", "Pacific Ocean", "South America"] as const;
export const LUNAR_REGIONS = ["moon"] as const
type RegionsType = typeof EARTH_REGIONS[number] | typeof LUNAR_REGIONS[number]

type DetecorPreset = {
    name: string,
    lat: number,
    lon: number,
    elevation: number,
    overburden: number,
    region: RegionsType,
}

export const presets: DetecorPreset[] = [
    // Moon
    {name: "Apollo 11", lat:0.67416, lon:23.47314, elevation:0, overburden:0, region:"moon"},
    //Africa
    //East Rand Proprietary Mines 3585 m below surface
    {name: "Witwatersrand", lat:-26.213205, lon:28.249712, elevation:0, overburden:9000, region:"Africa"},
    //Huguenot Tunnel east of Paarl SA, surface height 500 m, geoid height 33 m
    {name: "PAUL", lat:-33.730907, lon:19.085144, elevation:533, overburden:2000, region:"Africa"},
    //Asia
    // 22 m.s.l., geoid height 0 m, arXiv:1509.09038
    {name: "Aberdeen Tunnel", lat:22.260857, lon: 114.181084, elevation:22, overburden:611, region:"Asia"},
    {name: "Lake Baikal", lat:51.771, lon: 104.398, elevation:-644.5, overburden:1100, region:"Asia"},
    {name: "Guemseong", lat:35.05, lon: 126.70, elevation:0, overburden:950, region:"Asia"},
    //INO- detector height -1200 m, surface height 2207 m, geoid height -93.33 m
    {name: "INO", lat:9.955514, lon: 77.283654, elevation:914, overburden:3000, region:"Asia"},
    //Jaduguda uranium mine -555 m, 118 m.s.l., geoid height -57 m M.K. Sharan et al. 2021, NIMA 994, 165083
    {name: "Jaduguda", lat:22.6560, lon:86.3529, elevation:61, overburden:1554, region:"Asia"},
    {name: "Jiangmen", lat:22.11827, lon: 112.51867, elevation:-481.25, overburden:2100, region:"Asia"},
    //Jinping- detector height -2400 m, surface height 4000 m, geoid height -29.14 m
    {name: "Jinping", lat:28.15323, lon: 101.7114, elevation:1571, overburden:6720, region:"Asia"},
    //Kamioka- detector height -1000 m, surface height 1368 m, geoid height 43.54 m 
    {name: "Kamioka", lat:36.425659, lon: 137.310508, elevation:412, overburden:2050, region:"Asia"},
    //Kolar Gold Fields- mine closed, overburden from Achar et al., Phys. Lett. 18 (1965) 196
    {name: "Kolar Gold Fields", lat:12.93926, lon: 78.25565, elevation:848, overburden:7500, region:"Asia"},
    // RENO far- estimated location and overburden from arXiv:1003.1391
    {name: "RENO", lat:35.401487, lon: 126.425682, elevation:70, overburden:450, region:"Asia"},
    {name: "TRIDENT", lat:17.4, lon: 114.0, elevation:-3500, overburden:3500, region:"Asia"},
    //Yemilab- detector height -1100 m, surface height 900 m, geoid height 30.34 m
    {name: "Yemilab", lat:37.188639, lon: 128.659406, elevation:-170, overburden:2500, region:"Asia"},
    //Europe
    {name: "Baksan", lat:43.24, lon: 42.70, elevation:1700, overburden:4900, region:"Europe"},
    //Bas Bruit nuclear bunker 500 m below surface in southern France with horizontal access
    {name: "Bas Bruit", lat:43.93517, lon: 5.48518, elevation:0, overburden:500, region: "Europe"},
    //Bergwerk Saar- closed coal mine in southern Germany
    {name: "Bergwerk Saar", lat:49.319, lon: 6.779, elevation: 198, overburden: 2000, region:"Europe"},
    //Boulby- detector height -1100 m, surface height 85 m, geoid height 55.13 m
    {name: "Boulby", lat:54.555129, lon: -0.80089, elevation:-960, overburden:2805, region:"Europe"},
    //Canfranc- lab floor height 1206.47 m, geoid height 58.54 m arXix:1902.00868
    {name: "Canfranc Lab2500", lat:42.77529, lon: -0.529239, elevation:1265, overburden:2450, region:"Europe"},
    {name: "Chooz", lat:50.084758, lon: 4.802295, elevation:250, overburden:300, region:"Europe"},
    //Modane- lab floor height 1263 m, geoid height 62.14 m
    {name: "Modane", lat:45.178547, lon: 6.689201, elevation:1325, overburden:4200, region:"Europe"},
    //LNGS- lab floor height 936.45 m, geoid height 52.1 m
    {name: "LNGS", lat:42.45278, lon: 13.575, elevation:988, overburden:3100, region:"Europe"},
    //Callio Lab- detector height -1410 m, surface height 150 m, geoid height 20.6 m
    {name: "Pyhäsalmi", lat:63.659902, lon: 26.041062, elevation:-1239, overburden:4000, region:"Europe"},
    //Shaft 16- uranium mine in Czech Republic
    {name: "Shaft 16", lat:49.678, lon: 14.06, elevation: 0, overburden: 0, region:"Europe"},
    //Slanic in Romania- salt mine with low background facility
    {name: "Slanic Prahova", lat:45.23618, lon: 25.94173, elevation:0, overburden:205, region:"Europe"},
    //SUNLAB in copper mine with anhydrite and rock salt layers in Poland- AIP Conference Proceedings 1304, 326 (2010)
    {name: "SUNLAB", lat:51.55583, lon: 16.04167, elevation:0, overburden:1400, region: "Europe"},
    //Mediterranean Sea
    {name: "Antares", lat:42.80, lon: 6.17, elevation:-2500, overburden:2500, region:"Mediterranean Sea"},
    {name: "Nestor", lat:36.63, lon: 21.58, elevation:-4000, overburden:4000, region:"Mediterranean Sea"},
    {name: "NEMO Test", lat:37.551, lon: 15.384, elevation:-2080, overburden:2080, region:"Mediterranean Sea"},
    {name: "KM3NeT ARCA", lat:36.26667, lon: 16.10, elevation:-3500, overburden:3500, region:"Mediterranean Sea"},
    {name: "KM3NeT ORCA", lat:42.80, lon: 6.0333, elevation:-2450, overburden:2450, region:"Mediterranean Sea"},
    //North America
    //Fairport- detector height -580 m, surface height 180 m, geoid height -33.24 m
    {name: "Fairport", lat:41.756, lon: -81.286, elevation:-433, overburden:1570, region:"North America"},
    //Henderson molybdenum mine in central Colorado- https://www.phy.bnl.gov/~diwan/talks/talks/virginia%20colloquium/colloquium/UNO_Henderson.pdf
    {name: "Henderson", lat:39.77107, lon: -105.84596, elevation:0, overburden:4000, region:"North America"},
    {name: "KURF", lat:37.38, lon: -80.66, elevation:0, overburden:1400, region:"North America"},
    {name: "Palo Verde", lat:33.390616, lon: -112.872296, elevation:251, overburden:32, region:"North America"},
    {name: "Resolution", lat:33.301336, lon:-111.103363, elevation:0, overburden:5000, region:"North America"},
    //Mt San Jacinto water tunnel in southern California- http://www.sns.ias.edu/~jnb/Laboratory/SanJacinto/visit.pdf
    {name: "San Jacinto", lat:33.81471, lon:-116.67944, elevation:0, overburden:5000, region:"North America"},
    {name: "Soudan", lat:47.82, lon: -92.24, elevation:-210, overburden:1950, region:"North America"},
    //SNOLab- detector height -2092 m, surface height 309 m.s.l., Geoid height -36 m, Ellipsoid height -1819 m arXiv:0902.2776
    {name: "SNOLAB", lat:46.475, lon: -81.20111, elevation:-1819, overburden:6010, region:"North America"},
    //SURF- detector height -1478, surface height 1682 m, geoid height -11.98 m
    {name: "SURF", lat:44.36, lon: -103.76, elevation:192, overburden:4300, region:"North America"},
    //WIPP- detector height -689 m, surface height 1004 m, geoid height -21.48
    {name: "WIPP", lat:32.371667, lon: -103.793611, elevation:294, overburden:1624, region:"North America"},
    //Oceania
    //Stawell- detector height -1050 m, surface height 230 m, geoid height 5.62 m
    {name: "SUPL", lat:-37.07, lon: 142.81, elevation:-812, overburden:2700, region:"Oceania"},
    //Pacific Ocean
    //ACO- geoid height -1 m
    {name: "ACO", lat:22.75, lon: -158, elevation:-4800, overburden:4800, region:"Pacific Ocean"},
    {name: "MARS", lat:36.71, lon: -122.19, elevation:-890, overburden:890, region:"Pacific Ocean"},
    {name: "NEPTUNE", lat:47.77, lon: -127.77, elevation:-2660, overburden:2660, region:"Pacific Ocean"},
    //South America
    {name: "ANDES", lat:-30.25, lon: -69.88, elevation:3800, overburden:4200, region:"South America"},
]

interface Detector {
    current: string,
    lat: number,
    lon: number,
    elevation: number
}

export const detectorENUProjector = (detector: Detector) => {
  type Row = [number, number, number]
  const {sin, cos, atan2, hypot} = Math;
  const lon = detector.lon * Math.PI/180
  const lat = detector.lat * Math.PI/180
  const ECEFtoENU: [Row, Row, Row] = [
    [-sin(lon)           ,  cos(lon)           , 0       ],
    [-sin(lat) * cos(lon), -sin(lat) * sin(lon), cos(lat)],
    [ cos(lat) * cos(lon),  cos(lat) * sin(lon), sin(lat)],
  ]

  return (dxyz:[number, number, number]) => {
    const enu = {
      x: zip(ECEFtoENU[0], dxyz).map(([a, b]) => a! * b!).reduce((a,b) => a +b, 0),
      y: zip(ECEFtoENU[1], dxyz).map(([a, b]) => a! * b!).reduce((a,b) => a +b, 0),
      z: zip(ECEFtoENU[2], dxyz).map(([a, b]) => a! * b!).reduce((a,b) => a +b, 0),
    }

    return {
      phi:atan2(enu.y, enu.x) * (180/Math.PI),
      elev: 90 - atan2(hypot(enu.x, enu.y), enu.z) * (180/Math.PI)
    }
  }
}

export const detectorSunPosition = (detector: Detector, date: Date) => {
  return SunCalc.getPosition(date, detector.lat, detector.lon)
}
