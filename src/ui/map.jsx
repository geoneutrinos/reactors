import React, { useState } from "react";
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
  setDetector,
  zoom,
}) {
  const color = "#9d00ff";
  const radius = zoom > 6? zoom > 8? zoom > 10? zoom > 12? zoom > 14? 250 : 500 : 1000 : 2000 : 5000 : 10000
  return detectors.map((detector) => {
    const DetectorPopup = (
      <Popup>
        <b>Detector Site:</b> {detector.name}
        <br />
        <b>Overburden:</b> {detector.overburden} mwe
        <br />
        <button
          onClick={() =>
            setDetector({current: detector.name, ...detector})
          }
        >
          Place Detector Here
        </button>
      </Popup>
    );
    return (
      <Circle
        key={detector.name}
        radius={radius}
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
    case "custom":
      return "#000"
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

const CoreCircles = React.memo(function CoreCircles({ cores, customCores, zoom }) {
  console.log(zoom)
  const coreList = Object.values({...cores, ...customCores});
  const radius = zoom > 6? zoom > 8? zoom > 10? zoom > 12? zoom > 14? 250 : 500 : 1000 : 2000 : 5000 : 10000
  return coreList.map((core) => {
    const color = coreCircleColor(core.spectrumType);
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
        radius={radius}
        color={color}
        center={{ lat: core.lat, lon: core.lon }}
      >
        {CorePopup}
      </Circle>
    );
  });
});

const lngRange = (lng) => {
    while (lng > 180) {
      lng = lng - 360;
    }
    while (lng < -180) {
      lng = lng + 360;
    }
    return lng
}

export function NuMap({
  detector,
  setDetector,
  setCore,
  cores,
  customCores,
  detectorList,
}) {
  const [zoom, setZoom] = useState(2)
  const mapMouseMove = (event) => {
    if (detector.current !== 'follow') {
      return null;
    }
    let { lat, lng } = event.latlng;
    lat = parseFloat(lat.toFixed(6))
    lng = parseFloat(lngRange(lng).toFixed(6))
    setDetector({ ...detector, lat: lat, lon: lng })
  }
  const mapStyle = {
    height: "100%",
    cursor: "crosshair",
  };
  const contextMenu = {
    contextmenu: true,
    contextmenuWidth: 175,
    contextmenuItems: [
      {
        text: "Place Detector Here",
        callback: (e) =>
        setDetector({
            current: "custom",
            elevation: 0,
            lat: parseFloat(e.latlng.lat.toFixed(6)),
            lon: parseFloat(lngRange(e.latlng.lng).toFixed(6)),
          }),
      },
      {
        text: "Place Custom Core Here",
        callback: (e) =>
        setCore({
            lat: e.latlng.lat,
            lon: lngRange(e.latlng.lng),
          }),
      },
      "-",
      {
        text: "Follow Cursor",
        callback: (e) => setDetector({ current: "follow",
            elevation: 0,
            lat: parseFloat(e.latlng.lat.toFixed(6)),
            lon: parseFloat(lngRange(e.latlng.lng).toFixed(6)),
       }),
      },
    ],
  };
  return (
    <Map
      onMousemove={mapMouseMove}
      style={mapStyle}
      center={[0, 0]}
      zoom={2}
      {...contextMenu}
      onZoom={(e) => setZoom(e.target._zoom)}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      <Marker position={{ lat: detector.lat, lng: detector.lon }} />

      <LayersControl position="topright">
        <LayersControl.Overlay checked name="Reactor Cores">
          <LayerGroup>
            <CoreCircles cores={cores} customCores={customCores} zoom={zoom}/>
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Detector Locations">
          <LayerGroup>
            <DetectorCircles
              detectors={detectorList}
              setDetector={setDetector}
              zoom={zoom}
            />
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Legend">
          <LayerGroup>
            <Circle
              center={[-60,0]}
              radius={200}
              color={"#ff0000"}/>
            <Circle
              center={[-65,0]}
              radius={200}
              color={"#D69537"}/>
            <Circle
              center={[-69,0]}
              radius={200}
              color={"#009000"}/>
            <Circle
              center={[-73,0]}
              radius={200}
              color={"#00f"}/>
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </Map>
  );
}
