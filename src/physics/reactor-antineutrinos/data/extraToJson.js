const lodash = require('lodash');
const fs = require('fs')
const path = require('path')

const extra = path.join(__dirname, "extraMaterial.txt")
const out = path.join(__dirname, "extraMaterial.json")

const {zip, unzip} = lodash;

const columns = [
    "energy",
    "U235_12h",
    "U235_4500d",
    "PU239_15d",
    "PU239_450d",
    "PU241_15d",
    "PU241_450d",
    "U238_450d",
]

const data = fs.readFileSync(extra, 'utf8').split("\n")
const dataBlock = data.slice(10, -1)
const lines = dataBlock.map(line => line.split(/\s+/).map(parseFloat))

// unzip is basically a "transpose"
const colData = unzip(lines);
const jsonObj = Object.fromEntries(zip(columns, colData));

console.group("Parsed Data")
console.table(lines.map(line => Object.fromEntries(zip(columns, line))), columns)
console.groupEnd()

fs.writeFileSync(out,JSON.stringify(jsonObj), 'utf-8')