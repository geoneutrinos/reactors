import React, { useState } from "react";
import {
  Popup,
  TileLayer,
  LayerGroup,
  Circle,
  LayersControl,
  Marker,
  AttributionControl,
  MapContainer,
  useMapEvent,
} from "react-leaflet";
import { CRS } from "leaflet";
import "leaflet-contextmenu";

import {EARTH_REGIONS, LUNAR_REGIONS} from "../detectors"

import "leaflet-contextmenu/dist/leaflet.contextmenu.css";

const REGIONS = {
  "earth": new Set(EARTH_REGIONS),
  "moon": new Set(LUNAR_REGIONS)
}

const DetectorCircles = React.memo(function DetectorCircles({
  detectors,
  setDetector,
  zoom,
  celestialBody,
}) {
  detectors = detectors.filter(detector => REGIONS[celestialBody].has(detector.region))
  const color = "#9d00ff";
  const radius = zoom > 6? zoom > 8? zoom > 10? zoom > 12? zoom > 14? zoom > 18? 25 : 50 : 500 : 1000 : 2000 : 5000 : 10000
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
    case "FBR":
      return "#00ffff"
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

const CoreCircles = React.memo(function CoreCircles({ cores, zoom, shutdownCores }) {
  let coreList = Object.values({...cores,});
  const radius = zoom > 6? zoom > 8? zoom > 10? zoom > 12? zoom > 14? zoom > 18? 25 : 50 : 500 : 1000 : 2000 : 5000 : 10000

  if (shutdownCores === true){
    coreList = coreList.filter((core) => (core.shutdown < new Date()))
  } else {
    coreList = coreList.filter((core) => (core.shutdown > new Date()))
  }
  return coreList.map((core) => {
    let color = coreCircleColor(core.spectrumType);
    let shutdown = core.shutdown < new Date()
    if (shutdown){
      color = "#777777"
    }
    const CorePopup = (
      <Popup>
        {shutdown && <h5>Core Permanently Shutdown {core.shutdown.toISOString().slice(0,7)}</h5>}
        <b>Core:</b> {core.name}
        <br />
        <b>Type:</b> {core.type}&nbsp;
        <b>Mox:</b> {JSON.stringify(core.mox)}
        <br />
        <span title="The Reference thermal power of the plant expressed in MW(th). The reactor thermal power is the net heat transferred from the fuel to the coolant.">
          <b>Thermal Capacity:</b>
        </span>{" "}
        {core.power} MW
        <br />
        <b>Position (N,E): </b> {core.lat}, {core.lon}
        <br />
        <b>Elevation:</b> {core.elevation} m<br />
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
const latRange = (lat) => {
  if (lat > 90) return 90
  if (lat < -90) return -90
  return lat
}

const MouseMove = ({detector, setDetector}) => {
  const _ = useMapEvent("mousemove", (event) => {
    if (detector.current !== 'follow') {
      return null;
    }
    let { lat, lng } = event.latlng;
    lat = parseFloat(latRange(lat).toFixed(6))
    lng = parseFloat(lngRange(lng).toFixed(6))
    setDetector({ ...detector, lat: lat, lon: lng })
  })
}
const ZoomManager = ({zoom, setZoom}) => {
  const _ = useMapEvent("zoom", (event) => {
    setZoom(event.target._zoom)
  })
}

export function NuMap({
  detector,
  setDetector,
  setCore,
  cores,
  detectorList,
  celestialBody,
}) {
  const [zoom, setZoom] = useState(2)
  const crs = {earth: CRS.EPSG3857, moon: CRS.EPSG4326}[celestialBody]
  const mapStyle = {
    height: "100%",
    cursor: "crosshair",
  };
  const contextMenu = {
    contextmenu: true,
    contextmenuWidth: 225,
    contextmenuItems: [
      {
        text: "Place Detector Here w/ Elevation 0 m",
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
  const tiles = {
    earth: (<TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    />),
    moon: (<TileLayer
      url="https://maptiles.geoneutrinos.org/Lunar_LRO_LOLA_Shade_Global_128ppd_v04/{z}/{x}/{-y}.png"
      attribution='NASA LRO'
      maxNativeZoom={6}
      zoomOffset={1}
      maxZoom={19}
    />)
  }[celestialBody]
  return (
    <MapContainer
      style={mapStyle}
      center={[0, 0]}
      maxBounds={[[-90, -200],[90,200]]}
      maxBoundsViscosity={1}
      zoom={1}
      minZoom={1}
      maxZoom={19}
      {...contextMenu}
      attributionControl={false}
      crs={crs}
    >
      <MouseMove detector={detector} setDetector={setDetector}/>
      <ZoomManager zoom={zoom} setZoom={setZoom} />
      
      {tiles}

      <Marker position={{ lat: detector.lat, lng: detector.lon }} />

      <LayersControl position="topright">
        <LayersControl.Overlay checked name="Shutdown Reactor Cores">
          <LayerGroup>
            <CoreCircles cores={cores} zoom={zoom} shutdownCores={true}/>
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Active Reactor Cores">
          <LayerGroup>
            <CoreCircles cores={cores} zoom={zoom} shutdownCores={false}/>
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Detector Locations">
          <LayerGroup>
            <DetectorCircles
              detectors={detectorList}
              setDetector={setDetector}
              zoom={zoom}
              celestialBody={celestialBody}
            />
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
      <AttributionControl position="bottomright" prefix="<a href='https://leafletjs.com/'>Leaflet</a>" />
    </MapContainer>
  );
}
