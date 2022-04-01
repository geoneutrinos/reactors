import {zip} from 'lodash';
import SunCalc from 'suncalc';

type DetecorPreset = {
    name: string,
    lat: number,
    lon: number,
    elevation: number,
    overburden: number,
    region: string,
}
export const presets: DetecorPreset[] = [
    //Asia
    {name: "Guemseong", lat:35.05, lon: 126.70, elevation:0, overburden:950, region:"Asia"},
    //INO- detector height -1200 m, surface height 2207 m, geoid height -93.33
    {name: "INO", lat:9.955514, lon: 77.283654, elevation:914, overburden:3000, region:"Asia"},
    {name: "Jiangmen", lat:22.12, lon: 112.51, elevation:-481.25, overburden:2100, region:"Asia"},
    //Jinping- detector height -2400 m, surface height 4000 m, geoid height -29.14 m
    {name: "Jinping", lat:28.15323, lon: 101.7114, elevation:1571, overburden:6720, region:"Asia"},
    //Kamioka- detector height -1000 m, surface height 1368 m, geoid height 43.54 m 
    {name: "Kamioka", lat:36.425659, lon: 137.310508, elevation:412, overburden:2050, region:"Asia"},
    {name: "Lake Baikal", lat:51.771, lon: 104.398, elevation:-644.5, overburden:1100, region:"Asia"},
    //Yemilab- detector height -1100 m, surface height 900 m, geoid height 30.34 m
    {name: "Yemilab", lat:37.188639, lon: 128.659406, elevation:-170, overburden:2500, region:"Asia"},
    //Europe
    {name: "Baksan", lat:43.24, lon: 42.70, elevation:1700, overburden:4900, region:"Europe"},
    //Boulby- detector height -1100 m, surface height 85 m, geoid height 55.13 m
    {name: "Boulby", lat:54.555129, lon: -0.80089, elevation:-960, overburden:2805, region:"Europe"},
    //Canfranc- lab floor height 1206 m, geoid height 58.54 m
    {name: "Canfranc", lat:42.77529, lon: -0.529517, elevation:1265, overburden:2450, region:"Europe"},
    //Modane- lab floor height 1263 m, geoid height 62.14 m
    {name: "Modane", lat:45.178547, lon: 6.689201, elevation:1325, overburden:4200, region:"Europe"},
    //LNGS- lab floor height 936.45 m, geoid height 52.1 m
    {name: "LNGS", lat:42.45278, lon: 13.575, elevation:988, overburden:3100, region:"Europe"},
    //Callio Lab- detector height -1410 m, surface height 150 m, geoid height 20.6 m
    {name: "Pyhäsalmi", lat:63.659902, lon: 26.041062, elevation:-1239, overburden:4000, region:"Europe"},
    //Mediterranean Sea
    {name: "Antares", lat:42.80, lon: 6.17, elevation:-2500, overburden:2500, region:"Mediterranean Sea"},
    {name: "Nestor", lat:36.63, lon: 21.58, elevation:-4000, overburden:4000, region:"Mediterranean Sea"},
    {name: "NEMO Test", lat:37.551, lon: 15.384, elevation:-2080, overburden:2080, region:"Mediterranean Sea"},
    //North America
    //Fairport- detector height -580 m, surface height 180 m, geoid height -33.24 m
    {name: "Fairport", lat:41.756, lon: -81.286, elevation:-433, overburden:1570, region:"North America"},
    {name: "KURF", lat:37.38, lon: -80.66, elevation:0, overburden:1400, region:"North America"},
    {name: "Soudan", lat:47.82, lon: -92.24, elevation:-210, overburden:1950, region:"North America"},
    //SURF- detector height -1478, surface height 1682 m, geoid height -11.98 m
    {name: "SURF", lat:44.36, lon: -103.76, elevation:192, overburden:4300, region:"North America"},
    //WIPP- detector height -689 m, surface height 1004 m, geoid height -21.48
    {name: "WIPP", lat:32.371667, lon: -103.793611, elevation:294, overburden:1624, region:"North America"},
    //SNOLab- detector height -2070 m, surface height 309 m, Geoid height -33.65 m, Ellipsoid height -1795 m
    {name: "SNOLAB", lat:46.475, lon: -81.20111, elevation:-1795, overburden:6010, region:"North America"},
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
