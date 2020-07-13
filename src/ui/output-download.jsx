import React from 'react'
import {zip, sum} from 'lodash'

import { Card, Button} from "react-bootstrap";

import { saveAs } from "file-saver";

export const DownloadButton = ({data, formatters = {}, filename = "output.csv", buttonTitle="Download"}) => {
    const onClick = () => {
        const columns = Object.keys(data)

        const defaultFormatters = Object.fromEntries(columns.map(col => [col, (v) => v]))
        const finalFormatters = {...defaultFormatters, ...formatters}

        const formattedColumns = Object.fromEntries(
            columns.map(col => [col, Array.from(data[col]).map(v => finalFormatters[col](v))])
        )

        const rows = zip(...Object.values(formattedColumns)).map(row => row.join(", "))

        const file = [columns, ...rows].join("\n")
        saveAs(new Blob([file]), filename)
    }
    return <Button size="sm" variant="success" onClick={onClick}>{buttonTitle}</Button>
}

export const OutputDownload = ({cores, spectrum, detector, crossSection}) => {

  const coreList = Object.values(cores);
  const closestActiveCore = coreList
    .filter((core) => core.detectorAnySignal)
    .filter((core) => !core.custom)
    .sort((a, b) => a.detectorDistance - b.detectorDistance)[0];

  const iaeaCores = coreList.filter((core) => !core.custom);
  const customCores = coreList.filter((core) => core.custom);
  const closestCustomCore = customCores.sort(
    (a, b) => a.detectorDistance - b.detectorDistance
  )[0];
  // Close Things
  const closestName = closestActiveCore?.name || "";

  // custom cores
  const customClosestName = closestCustomCore?.name || "";

  const totalIAEA = zip(...iaeaCores.map(c => c.detectorSignal)).map(s => sum(s))
  const totalCustom = zip(...customCores.map(c => c.detectorSignal)).map(s => sum(s))
  const total = zip(spectrum.geoTh, spectrum.geoU, spectrum.geoK, totalIAEA, totalCustom).map(s => sum(s))

  const customCoreData = customClosestName === ""? {} : {
       "custom cores": totalCustom,
  }

    const downloadData ={
        "bin center (MeV)": spectrum.geoU.map((n,i) => 0.005 + i * 0.01),
        total: total,
        "IAEA cores": totalIAEA,
        [`closest IAEA Core (${closestName})`]: closestActiveCore.detectorSignal,
        ...customCoreData,
        geoU:spectrum.geoU,
        geoTh:spectrum.geoTh,
        geoK:spectrum.geoK,
    }
    const downloadFormatters = {
        "bin center (MeV)": (v) => v.toFixed(3)
    }
    const downloadFilename = `output_${detector.name}_${crossSection}.csv`.replace(/\s/g, "_").replace(/\(|\)/g, '')

    return <Card>
        <Card.Header>Download Model Output</Card.Header>
        <Card.Body>
        <DownloadButton data={downloadData} formatters={downloadFormatters} filename={downloadFilename}/>
        </Card.Body>
    </Card>
}