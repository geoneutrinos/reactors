const lodash = require('lodash');
const fs = require('fs')
const path = require('path')

const {zip, unzip} = lodash;

const processCarbon12nuebar = () => {
    let extra = path.join(__dirname, "nuebarIBD_c12xsec.dat")
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

const processCarbon12nue = () => {
    let extra = path.join(__dirname, "nueIBD_c12xsec.dat")
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

processCarbon12nuebar()
processCarbon12nue()