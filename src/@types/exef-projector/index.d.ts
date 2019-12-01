declare module 'ecef-projector' {
    export function project(lat: number, lon: number, elevation: number): [number, number, number];
    export function unproject(x: number, y: number, z: number): [number, number, number];
}