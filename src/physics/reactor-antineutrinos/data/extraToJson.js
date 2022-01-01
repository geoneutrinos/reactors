const fs = require('fs')
const path = require('path')

const extra = path.join(__dirname, "extraMaterial.txt")

const data = fs.readFileSync(extra, 'utf8').split("\n")

const dataBlock = data.slice(10, -1)

console.log(dataBlock.map(line => line.split(/\s+/).map(parseFloat)))