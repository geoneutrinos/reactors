
const degrees = (radians:number) => radians * (180 / Math.PI)
const radians = (degrees:number) => degrees * (Math.PI / 180)

// variables used
// a: radius of semi-major axis
// b: radius of semi-minor axis
// f: flattening
// e: first eccentricity
// eprime: second eccentricity

const earth = { // WGS84
    a: 6_378_137,
    f: 1/298.257223563,
}

const moon = { // NASA 2008 "standardized lunar coordinate system for the lunar reconnaissance orbiter and lunar datasets"
    a: 1_737_400,
    f: 0
}

const ellipsoidParamesFunc = (a:number, f:number) => {
    const b = a * (1 - f)
    const e = Math.sqrt((a ** 2 - b ** 2)/ (a ** 2))
    const eprime = Math.sqrt((a ** 2 - b ** 2)/ (b ** 2))
    return {a,b,f,e,eprime}
}

const ellipsoidParames = {
    earth: ellipsoidParamesFunc(earth.a, earth.f),
    moon: ellipsoidParamesFunc(moon.a, moon.f),
}



export const project = (lat: number, lon: number, elevation: number, body: "earth"| "moon" = "earth"): [number, number, number] => {
    const {a, b, e } = ellipsoidParames[body]
    const latr = radians(lat)
    const lonr = radians(lon)
    const N = a / Math.sqrt(1 - e**2 * Math.sin(latr) ** 2) // Radius of Curvature (meters)
    const x = (N + elevation) * Math.cos(latr) * Math.cos(lonr)
    const y = (N + elevation) * Math.cos(latr) * Math.sin(lonr)
    const z = ((b ** 2 / a ** 2) * N + elevation) * Math.sin(latr)
    return [x,y,z]
}