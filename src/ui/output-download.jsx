import React, { useContext } from "react";
import { zip, sum } from "lodash";
import { XSNames, XSAbrev } from "../physics/neutrino-cross-section";
import {SECONDS_PER_YEAR} from "../physics/constants";
import { PhysicsContext } from "../state";

import { Card, Button } from "react-bootstrap";

import { saveAs } from "file-saver";

export const DownloadButton = ({
  data,
  formatters = {},
  filename = "output.csv",
  buttonTitle = "Download",
}) => {
  const onClick = () => {
    const columns = Object.keys(data);

    const defaultFormatters = Object.fromEntries(
      columns.map((col) => [col, (v) => v])
    );
    const finalFormatters = { ...defaultFormatters, ...formatters };

    const formattedColumns = Object.fromEntries(
      columns.map((col) => [
        col,
        Array.from(data[col]).map((v) => finalFormatters[col](v)),
      ])
    );

    const rows = zip(...Object.values(formattedColumns)).map((row) =>
      row.join(", ")
    );

    const file = [columns, ...rows].join("\n");
    saveAs(new Blob([file]), filename);
  };
  return (
    <Button size="sm" variant="success" onClick={onClick}>
      {buttonTitle}
    </Button>
  );
};

export const OutputDownload = ({ cores, spectrum, detector, boron8 }) => {
  const { crossSection } = useContext(PhysicsContext);
  const { boron8Rate } = boron8;

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
  const closestName = closestActiveCore?.name || "none";
  const closestSpectrum =
    closestActiveCore?.detectorSignal || new Float32Array(1000).fill(0);

  // custom cores
  const customClosestName = closestCustomCore?.name || "";

  const totalIAEA = zip(...iaeaCores.map((c) => c.detectorSignal)).map((s) =>
    sum(s)
  );
  const totalCustom = zip(
    ...customCores.map((c) => c.detectorSignal)
  ).map((s) => sum(s));
  const total = zip(
    spectrum.geoTh,
    spectrum.geoU,
    spectrum.geoK,
    totalIAEA,
    totalCustom
  ).map((s) => sum(s));

  const customCoreData =
    customClosestName === ""
      ? {}
      : {
          "custom cores": totalCustom,
        };

  const downloadData = {
    "bin center (MeV)": spectrum.geoU.map((n, i) => 0.005 + i * 0.01),
    total: total,
    "IAEA cores": totalIAEA,
    [`closest IAEA Core (${closestName})`]: closestSpectrum,
    ...customCoreData,
  };
  const downloadGeoData = {
    "bin center (MeV)": spectrum.geoU.map((n, i) => 0.005 + i * 0.01),
    geo238U: spectrum.geoU,
    geo232Th: spectrum.geoTh,
    geo40K_beta: spectrum.geoK,
  };
  const downloadFormatters = {
    "bin center (MeV)": (v) => v.toFixed(3),
  };
  const downloadFilename = `AntiNu_spec10keV_${detector.current}_${
    XSAbrev[crossSection.crossSection]
  }_Tmin${crossSection.elasticScatteringTMin.toFixed(1)}MeV.csv`
    .replace(/\s/g, "_")
    .replace(/\(|\)/g, "");
  const downloadGeoFilename = `GeoNu_spec10keV_${detector.current}_${
    XSAbrev[crossSection.crossSection]
  }_Tmin${crossSection.elasticScatteringTMin.toFixed(1)}MeV.csv`
    .replace(/\s/g, "_")
    .replace(/\(|\)/g, "");

  if (
    [XSNames.IBDSV2003, XSNames.IBDVB1999].includes(crossSection.crossSection)
  ) {
    delete downloadGeoData.geo40K_beta
    delete downloadData.geo40K_beta;
  }

  return (
    <Card>
      <Card.Header>Download Model Output</Card.Header>
      <Card.Body>
        <DownloadButton
          data={downloadData}
          formatters={downloadFormatters}
          filename={downloadFilename}
          buttonTitle={"Reactor"}
        />{" "}
        <DownloadButton
          data={{
            "bin center (MeV)": boron8Rate.map((_, i) => 0.1 + 0.1 * i),
            "boron8 (NIU)": boron8Rate.map(
              (v) => v * 1e1 * SECONDS_PER_YEAR * 1e32
            ),
          }}
          formatters={{
            "boron8 (NIU)": (v) => v.toPrecision(7),
            ...downloadFormatters,
          }}
          filename={`SolarNu_spec100keV_ES_8Bsolar_Tmin${crossSection.elasticScatteringTMin.toFixed(
            1
          )}MeV.csv`}
          buttonTitle={<span>Solar <sup>8</sup>B </span>}
        />{" "}
        <DownloadButton
          data={downloadGeoData}
          formatters={downloadFormatters}
          filename={downloadGeoFilename}
          buttonTitle={"GeoNu"}
        />
      </Card.Body>
    </Card>
  );
};
