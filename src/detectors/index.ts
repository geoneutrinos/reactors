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
    {name: "INO", lat:9.95, lon: 77.28, elevation:317, overburden:3000, region:"Asia"},
    {name: "Jiangmen", lat:22.12, lon: 112.51, elevation:-481.25, overburden:2100, region:"Asia"},
    {name: "Jinping", lat:28.15, lon: 101.71, elevation:1500, overburden:6720, region:"Asia"},
    {name: "Kamioka", lat:36.41, lon: 137.30, elevation:368, overburden:2050, region:"Asia"},
    {name: "Lake Baikal", lat:51.771, lon: 104.398, elevation:-644.5, overburden:1100, region:"Asia"},
    {name: "Yemilab", lat:37.188639, lon: 128.659406, elevation:-35, overburden:2500, region:"Asia"},
    //Europe
    {name: "Baksan", lat:43.24, lon: 42.70, elevation:1700, overburden:4900, region:"Europe"},
    {name: "Boulby", lat:54.555129, lon: -0.80089, elevation:-1050, overburden:2805, region:"Europe"},
    {name: "Canfranc", lat:42.77, lon: -0.57, elevation:1080, overburden:2450, region:"Europe"},
    {name: "Modane", lat:45.14, lon: 6.69, elevation:1263, overburden:4200, region:"Europe"},
    {name: "LNGS", lat:42.45, lon: 13.58, elevation:936.45, overburden:3100, region:"Europe"},
    {name: "Pyhäsalmi", lat:63.66, lon: 26.04, elevation:0, overburden:4000, region:"Europe"},
    // Mediterranean Sea
    {name: "Antares", lat:42.80, lon: 6.17, elevation:-2500, overburden:2500, region:"Mediterranean Sea"},
    {name: "Nestor", lat:36.63, lon: 21.58, elevation:-4000, overburden:4000, region:"Mediterranean Sea"},
    {name: "NEMO Test", lat:37.551, lon: 15.384, elevation:-2080, overburden:2080, region:"Mediterranean Sea"},
    // North America
    {name: "Morton", lat:41.7551, lon: -81.2860, elevation:-426, overburden:1570, region:"North America"},
    {name: "Cargill", lat:41.4942, lon: -81.7183, elevation:-426, overburden:1700, region:"North America"},
    {name: "Goderich", lat:43.74720, lon: -81.72565, elevation:-337, overburden:1375, region:"North America"},
    {name: "Ojibway", lat:42.256364, lon: -83.10482, elevation:-100, overburden:725, region:"North America"},
    {name: "KURF", lat:37.38, lon: -80.66, elevation:0, overburden:1400, region:"North America"},
    {name: "Soudan", lat:47.82, lon: -92.24, elevation:-210, overburden:1950, region:"North America"},
    {name: "SURF", lat:44.36, lon: -103.76, elevation:192, overburden:4300, region:"North America"},
    {name: "WIPP", lat:32.37, lon: -103.79, elevation:1039, overburden:1600, region:"North America"},
    {name: "SNOLAB", lat:46.47, lon: -81.20, elevation:309, overburden:6010, region:"North America"},
    // Oceania
    {name: "SUPL", lat:-37.07, lon: 142.81, elevation:-794, overburden:2700, region:"Oceania"},
    // Pacific Ocean
    {name: "ACO", lat:22.75, lon: -158, elevation:-4800, overburden:4800, region:"Pacific Ocean"},
    {name: "MARS", lat:36.71, lon: -122.19, elevation:-890, overburden:890, region:"Pacific Ocean"},
    {name: "NEPTUNE", lat:47.77, lon: -127.77, elevation:-2660, overburden:2660, region:"Pacific Ocean"},
    // South America
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
