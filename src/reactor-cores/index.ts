import { reactors as cores, times, loads } from './reactor-database/reactors.json'
import { range } from 'lodash';
import { project } from 'ecef-projector';

export { cores, times, loads };

console.log(cores, times, loads)

function mevRange(count = 1000, start = 0, stop = 10){
  // TODO figure out how to deal with a start not a zero
  const binSize = (stop - start) / count;
  return new Float32Array(range(binSize/2, stop, binSize))
}

class LoadFactor {
    date: Date;
    load: number;
    days: number;

    constructor({ date, load }: { date: string; load: number; }) {
        this.date = new Date(date);
        this.load = load / 100;
        // This is finding the "zeroith" day of the next month, which will result
        // in the last day of the month we want being returned
        this.days = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
    }
}