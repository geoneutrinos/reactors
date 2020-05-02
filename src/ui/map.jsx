import React from "react";
import {
  Map,
  Popup,
  TileLayer,
  LayerGroup,
  Circle,
  LayersControl,
  Marker,
} from "react-leaflet";
import "leaflet-contextmenu";

import "leaflet-contextmenu/dist/leaflet.contextmenu.css";

const DetectorCircles = React.memo(function DetectorCircles({
  detectors,
  changeDetector,
}) {
  const color = "#9d00ff";
  return detectors.map((detector) => {
    const DetectorPopup = (
      <Popup>
        <b>Detector Name:</b> {detector.name}
        <br />
        <b>Overburden:</b> {detector.overburden} mwe
        <br />
        <button
          onClick={() =>
            changeDetector({
              current: detector.name,
              lat: detector.lat,
              lon: detector.lon,
              elevation: detector.elevation,
            })
          }
        >
          Place Detector Here
        </button>
      </Popup>
    );
    return (
      <Circle
        key={detector.name}
        radius={250}
        color={color}
        center={{ lat: detector.lat, lon: detector.lon }}
      >
        {DetectorPopup}
      </Circle>
    );
  });
});

function coreCircleColor(type) {
  switch (type) {
    case "PHWR":
      return "#ff0000";
    case "GCR":
      return "#D69537";
    case "LEU_MOX":
      return "#00f";
    default:
      return "#009000";
  }
}

const CoreCircles = React.memo(function CoreCircles({ cores }) {
  const coreList = Object.values(cores);
  return coreList.map((core) => {
    const color = coreCircleColor(core.type);
    const CorePopup = (
      <Popup>
        <b>Core Name:</b> {core.name}
        <br />
        <span title="The Reference thermal power of the plant expressed in MW(th). The reactor thermal power is the net heat transferred from the fuel to the coolant.">
          <b>Thermal Capacity:</b>
        </span>{" "}
        {core.power} MW
        <br />
        <b>Position (N,E) </b> {core.lat}, {core.lon}
        <br />
        <b>Elevation</b> {core.elevation} m<br />
        <b>Type:</b> {core.type}&nbsp;
        <b>Mox:</b> {JSON.stringify(core.mox)}
        <br />
        <small>Elevation is height above the WGS84 reference ellipsoid</small>
      </Popup>
    );

    return (
      <Circle
        key={core.name}
        radius={250}
        color={color}
        center={{ lat: core.lat, lon: core.lon }}
      >
        {CorePopup}
      </Circle>
    );
  });
});

export function NuMap({
  onMousemove,
  detector,
  changeDetector,
  cores,
  detectorList,
}) {
  const mapStyle = {
    height: "100%",
    cursor: "crosshair",
  };
  const contextMenu = {
    contextmenu: true,
    contextmenuWidth: 150,
    contextmenuItems: [
      {
        text: "Place Detector Here",
        callback: (e) =>
          changeDetector({
            current: "custom",
            elevation: 0,
            lat: e.latlng.lat,
            lon: e.latlng.lng,
          }),
      },
      "-",
      {
        text: "Follow Cursor",
        callback: (e) => changeDetector({ current: "follow" }),
      },
    ],
  };
  return (
    <Map
      onMousemove={onMousemove}
      style={mapStyle}
      center={[0, 0]}
      zoom={2}
      {...contextMenu}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      <Marker position={{ lat: detector.lat, lng: detector.lon }} />

      <LayersControl position="topright">
        <LayersControl.Overlay checked name="Reactor Cores">
          <LayerGroup>
            <CoreCircles cores={cores} />
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Detector Locations">
          <LayerGroup>
            <DetectorCircles
              detectors={detectorList}
              changeDetector={changeDetector}
            />
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </Map>
  );
}
