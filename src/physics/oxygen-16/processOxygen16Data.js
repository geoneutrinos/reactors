import lodash from 'lodash';
import fs from 'fs';
import path from 'path';

const {zip, unzip} = lodash;

const __dirname = import.meta.dirname;

const processOxygen16nuebar = () => {
    let extra = path.join(__dirname, "nuebarIBD_o16xsec.dat")
    let out = path.join(__dirname, "nuebarIBDxsec.json")

    let columns = [
        "energy",
        "crossSection"
    ]

    let data = fs.readFileSync(extra, 'utf8').split("\n")
    let lines = data.map(line => line.split(",").map(parseFloat))

    // unzip is basically a "transpose"
    let colData = unzip(lines);
    let jsonObj = Object.fromEntries(zip(columns, colData));

    console.group("Parsed nueBarIBD")
    console.table(lines.map(line => Object.fromEntries(zip(columns, line))), columns)
    console.groupEnd()

    fs.writeFileSync(out,JSON.stringify(jsonObj), 'utf-8')
}

const processOxygen16nue = () => {
    let extra = path.join(__dirname, "nueIBD_o16xsec.dat")
    let out = path.join(__dirname, "nueIBDxsec.json")

    let columns = [
        "energy",
        "crossSection"
    ]

    let data = fs.readFileSync(extra, 'utf8').split("\n")
    let lines = data.map(line => line.split(",").map(parseFloat))

    // unzip is basically a "transpose"
    let colData = unzip(lines);
    let jsonObj = Object.fromEntries(zip(columns, colData));

    console.group("Parsed nueBarIBD")
    console.table(lines.map(line => Object.fromEntries(zip(columns, line))), columns)
    console.groupEnd()

    fs.writeFileSync(out,JSON.stringify(jsonObj), 'utf-8')
}

processOxygen16nuebar()
processOxygen16nue()