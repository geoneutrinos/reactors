import lodash from 'lodash';
import fs from 'fs';
import path from 'path';
import papaparse from 'papaparse'

const {zip, unzip} = lodash;

const __dirname = import.meta.dirname;

const {parse} = papaparse

const startDate = new Date("2003-01-01Z")
const endDate = new Date("2022-12-31Z")

const processReactorDB = () => {
    let reactor_base = path.join(__dirname, "reactors.csv")
    let out = path.join(__dirname, "reactors.json")
    let data = fs.readFileSync(reactor_base, 'utf8')
    let reactors_raw = parse(data, {header:true, skipEmptyLines: true, dynamicTyping:true, comments:true}).data
    let times = []
    let LFFiles = new Set() // unlike python, JS Set maintains insertion order
    var dateCursor = startDate

    // calc all the months and files we will load
    while (dateCursor < endDate){
        let year = dateCursor.getUTCFullYear()
        let month = `${dateCursor.getUTCMonth() + 1}`.padStart(2,"0")
        times.push(`${year}-${month}`)
        LFFiles.add(`DB${year}.csv`)
        dateCursor.setUTCMonth(dateCursor.getUTCMonth() + 1)
    }

    let coreNmaes = new Set(reactors_raw.map(core => core.name.trim()))

    let lfFileData = {}
    for (let lfFile of LFFiles){
        let lfPath = path.join(__dirname, lfFile)
        let lfData = fs.readFileSync(lfPath, 'utf8')
        let lfRaw = parse(lfData, {skipEmptyLines: true, dynamicTyping:true}).data
        lfFileData[lfFile] = Object.fromEntries(lfRaw.map(([name, ...lf]) => {
            name = name.trim()
            // this is kinda the best place to check this
            if (!(coreNmaes.has(name))){
                throw new Error(`${lfFile} has a core '${name}' not in master reactors.csv`)
            }
        return [name, lf]
    }))
    }

    let loads = {}
    for (let core of reactors_raw) {
        let name = core.name.trim()
        if (loads[name] === undefined){
            loads[name] = []
        }
        // iter though the loaded... loads
        for (let lfFile of LFFiles){
            let coreLFs = (lfFileData[lfFile][name] || [0,0,0,0,0,0,0,0,0,0,0,0]).map(value => value < 0? 0: value)
            if (coreLFs.length !== 12){
                throw new Error("Bad LF data length")
            }
            loads[name].push(...coreLFs)
        }
    }

    let reactors = {}

    for (let core of reactors_raw) {
        reactors[core.name.trim()] = {...core}
        delete reactors[core.name].name
    }
    //console.log(reactors)

    fs.writeFileSync(out,JSON.stringify({reactors, times, loads}), 'utf-8')
}

processReactorDB()
