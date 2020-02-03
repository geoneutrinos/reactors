import antineutrinoSpectrum40KData from './data/AntineutrinoSpectrum_40K.knt.json';
import antineutrinoSpectrum232ThData from './data/AntineutrinoSpectrum_232Th.knt.json';
import antineutrinoSpectrum235UData from './data/AntineutrinoSpectrum_235U.knt.json';
import antineutrinoSpectrum238UData from './data/AntineutrinoSpectrum_238U.knt.json';

/**
 * 
 * @param antineutrinoSpectrum
 * @param start 
 * @param stop 
 * @param size 
 */
function resample(antineutrinoSpectrum: number[], start:number, stop:number, size:number): Float32Array{
    const output = (new Float32Array(size)).fill(0);
    const binWidth = (stop - start)/size;
    const sliceSize = Math.floor(binWidth * 1000)

    return output.map((v, i) => {
        return antineutrinoSpectrum.slice(i * sliceSize, i * sliceSize + sliceSize).reduce((p, c) => p + c * 100, 0)
    });
}

export const antineutrinoSpectrum40K = resample(antineutrinoSpectrum40KData, 0, 10, 1000)
export const antineutrinoSpectrum232Th = resample(antineutrinoSpectrum232ThData, 0, 10, 1000)
export const antineutrinoSpectrum235U = resample(antineutrinoSpectrum235UData, 0, 10, 1000)
export const antineutrinoSpectrum238U = resample(antineutrinoSpectrum238UData, 0, 10, 1000)