import React, { useContext } from "react";
import { zip, sum } from "lodash";
import { XSNames, XSAbrev } from "../physics/neutrino-cross-section";
import { SECONDS_PER_YEAR } from "../physics/constants";
import { PhysicsContext } from "../state";
import bins, {binCount} from "../physics/bins"

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

export const OutputDownload = ({ cores, geo, detector, boron8 }) => {
  const { crossSection } = useContext(PhysicsContext);
  const { boron8Rate, boron8Ke } = boron8;

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
    closestActiveCore?.detectorSignal || new Float32Array(binCount).fill(0);

  // custom cores
  const customClosestName = closestCustomCore?.name || "";

  const slectedCores = coreList.filter((core) => core.outputSignal);
  const selectedCoresData = zip(
    ...slectedCores.map((c) => c.detectorSignal)
  ).map((s) => sum(s));
  const backgroundCores = coreList.filter((core) => !core.outputSignal);
  const backgroundCoresData = zip(
    ...backgroundCores.map((c) => c.detectorSignal)
  ).map((s) => sum(s));

  const totalIAEA = zip(...iaeaCores.map((c) => c.detectorSignal)).map((s) =>
    sum(s)
  );
  const totalCustom = zip(...customCores.map((c) => c.detectorSignal)).map(
    (s) => sum(s)
  );

  const customCoreData =
    customClosestName === ""
      ? {}
      : {
          "custom cores": totalCustom,
        };

  const downloadData = {
    "bin center (MeV)": bins,
    "IAEA cores (NIU/MeV)": totalIAEA,
    [`closest IAEA Core- ${closestName} (NIU/MeV)`]: closestSpectrum,
    selectedCores: selectedCoresData,
    backgroundCores: backgroundCoresData,
    ...customCoreData,
  };
  const downloadGeoData = {
    "bin center (MeV)": bins,
    "geo238U (NIU/MeV)": geo.total.U238.spectrum,
    "geo235U (NIU/MeV)": geo.total.U235.spectrum,
    "geo232Th (NIU/MeV)": geo.total.Th232.spectrum,
    "geo40K_beta (NIU/MeV)": geo.total.K40Beta.spectrum,
  };
  const downloadFormatters = {
    "bin center (MeV)": (v) => v.toFixed(3),
  };
  const tMinName = [XSNames.IBDSV2003, XSNames.IBDVB1999].includes(
    crossSection.crossSection
  )
    ? ""
    : `_Tmin${crossSection.elasticScatteringTMin.toFixed(1)}MeV`;

  const downloadFilename = `AntiNu_spec10keV_${detector.current}_${
    XSAbrev[crossSection.crossSection]
  }${tMinName}.csv`
    .replace(/\s/g, "_")
    .replace(/\(|\)/g, "");
  const downloadGeoFilename = `GeoNu_spec10keV_${detector.current}_${
    XSAbrev[crossSection.crossSection]
  }${tMinName}.csv`
    .replace(/\s/g, "_")
    .replace(/\(|\)/g, "");

  if (
    [XSNames.IBDSV2003, XSNames.IBDVB1999].includes(crossSection.crossSection)
  ) {
    delete downloadGeoData.geo40K_beta;
    delete downloadGeoData.geo235U;
  }

  if (sum(selectedCoresData) === 0) {
    delete downloadData.selectedCores;
    delete downloadData.backgroundCores;
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
            "8B Rate (NIU/MeV)": boron8Rate.map(
              (v) => v * 1e1 * SECONDS_PER_YEAR * 1e32
            ),
            "8B Electron KE (/MeV)": boron8Ke,
          }}
          formatters={{
            "8B Rate (NIU/MeV)": (v) => v.toPrecision(7),
            "8B Electron KE (/MeV)": (v) => v.toPrecision(7),
            ...downloadFormatters,
          }}
          filename={`SolarNu_spec100keV_ES_8Bsolar_Tmin${crossSection.elasticScatteringTMin.toFixed(
            1
          )}MeV.csv`}
          buttonTitle={
            <span>
              Solar <sup>8</sup>B{" "}
            </span>
          }
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
