import React from 'react';
import { Map, Popup, TileLayer, LayerGroup, Circle, LayersControl } from 'react-leaflet'

export class NuMap extends React.Component {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        const CoreCircles = this.props.coreList.map((core) => {
            let color;
            switch (core.spectrumType) {
                case "PHWR":
                    color = "#ff0000";
                    break;
                case "GCR":
                    color = "#D69537";
                    break;
                case "LEU_MOX":
                    color = "#00f";
                    break;
                default:
                    color = "#009000"
            }

            const CorePopup = <Popup>
                <b>Core Name:</b> {core.name}<br />
                <b>Design Power:</b> {core.power} MW<br />
                <b>Position (N,E) </b> {core.lat}, {core.lon}<br />
                <b>Elevation</b> {core.elevation} m<br />
                <b>Type:</b> {core.type}&nbsp;
        <b>Mox:</b> {JSON.stringify(core.mox)}<br />
                <small>Elevation is height above the WGS84 reference ellipsoid</small>
            </Popup>
            return (<Circle key={core.name} radius={250} color={color} center={{ lat: core.lat, lon: core.lon }}>{CorePopup}</Circle>)
        })

        const DetectorCircles = this.props.detectorList.map((detector) => {
            const color = '#9d00ff'
            const DetectorPopup = (
            <Popup>
                <b>Detector Name:</b> {detector.name}<br />
                <b>Overburden:</b> {detector.overburden} mwe<br />
            </Popup>)
            return (<Circle key={detector.name} radius={250} color={color} center={{ lat: detector.lat, lon: detector.lon }}>{DetectorPopup}</Circle>)
        })

        return (
            < Map onMousemove={this.props.onMousemove} style={{ height: "100%" }} center={[0, 0]} zoom={2} >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />

                <LayersControl position="topright">
                    <LayersControl.Overlay checked name='Reactor Cores'>
                        <LayerGroup>
                            {CoreCircles}
                        </LayerGroup>
                    </LayersControl.Overlay>
                    <LayersControl.Overlay checked name='Detector Locations'>
                        <LayerGroup>
                            {DetectorCircles}
                        </LayerGroup>
                    </LayersControl.Overlay>
                </LayersControl>
            </Map>)
    }
}