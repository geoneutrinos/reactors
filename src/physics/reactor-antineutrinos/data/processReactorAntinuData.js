const lodash = require('lodash');
const fs = require('fs')
const path = require('path')

const {zip, unzip} = lodash;

const processEstinne2018 = () => {
    let extra = path.join(__dirname, "estienne2018.txt")
    let out = path.join(__dirname, "estienne2018.json")

    let columns = [
        "energy",
        "U235_12h",
        "U235_4500d",
        "PU239_15d",
        "PU239_450d",
        "PU241_15d",
        "PU241_450d",
        "U238_450d",
    ]

    let data = fs.readFileSync(extra, 'utf8').split("\n")
    let dataBlock = data.slice(10, -1)
    let lines = dataBlock.map(line => line.split(/\s+/).map(parseFloat))

    // unzip is basically a "transpose"
    let colData = unzip(lines);
    let jsonObj = Object.fromEntries(zip(columns, colData));

    console.group("Parsed Data (Estinne et al 2019)")
    console.table(lines.map(line => Object.fromEntries(zip(columns, line))), columns)
    console.groupEnd()

    fs.writeFileSync(out,JSON.stringify(jsonObj), 'utf-8')
}

const processHuber2011 = () => {
    let extra = path.join(__dirname, "huber2011.txt")
    let out = path.join(__dirname, "huber2011.json")

    let columns = [
        "energy",
        "U235_12h",
        "PU239_3h",
        "PU239_3h_u",
        "PU241_43h",
        "PU241_43h_u",
    ]

    let data = fs.readFileSync(extra, 'utf8').split("\n")
    let dataBlock = data.slice(8, -1)
    let lines = dataBlock.map(line => line.split(/\s+/).map(parseFloat))

    // unzip is basically a "transpose"
    let colData = unzip(lines);
    let jsonObj = Object.fromEntries(zip(columns, colData));

    console.group("Parsed Data (Huber 2011)")
    console.table(lines.map(line => Object.fromEntries(zip(columns, line))), columns)
    console.groupEnd()

    fs.writeFileSync(out,JSON.stringify(jsonObj), 'utf-8')

}
const processMueller2011 = () => {
    let extra = path.join(__dirname, "mueller_et_al2011.txt")
    let out = path.join(__dirname, "mueller_et_al2011.json")

    let columns = [
        "energy",
        "U235_12h",
        "PU239_15d",
        "PU241_15d",
        "U238_12h",
        "U238_450d",
        "U238_450d_u"
    ]

    let data = fs.readFileSync(extra, 'utf8').split("\n")
    let dataBlock = data.slice(8, -1)
    let lines = dataBlock.map(line => line.split(/\s+/).map(parseFloat))

    // unzip is basically a "transpose"
    let colData = unzip(lines);
    let jsonObj = Object.fromEntries(zip(columns, colData));

    console.group("Parsed Data (Mueller et al. 2011)")
    console.table(lines.map(line => Object.fromEntries(zip(columns, line))), columns)
    console.groupEnd()

    fs.writeFileSync(out,JSON.stringify(jsonObj), 'utf-8')

}

const processKopeikin2021 = () => {
    let extra = path.join(__dirname, "kopeikin_et_al2021.txt")
    let out = path.join(__dirname, "kopeikin_et_al2021.json")

    let columns = [
        "energy",
        "U235",
        "U235_u",
        "U238",
        "U238_u",
    ]

    let data = fs.readFileSync(extra, 'utf8').split("\n")
    let dataBlock = data.slice(8, -1)
    let lines = dataBlock.map(line => line.split(/\s+/).map(parseFloat))

    // unzip is basically a "transpose"
    let colData = unzip(lines);
    let jsonObj = Object.fromEntries(zip(columns, colData));

    console.group("Parsed Data (Kopeikin 2021)")
    console.table(lines.map(line => Object.fromEntries(zip(columns, line))), columns)
    console.groupEnd()

    fs.writeFileSync(out,JSON.stringify(jsonObj), 'utf-8')

}


processEstinne2018()
processHuber2011()
processMueller2011()
processKopeikin2021()