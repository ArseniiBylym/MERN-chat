import React, {useState, useEffect} from 'react';
import {Map as LeafletMap, LayersControl, TileLayer, Marker, Popup} from 'react-leaflet';

const {BaseLayer} = LayersControl;

export const Map = props => {
    const [userCoords, setUserCoords] = useState(null);
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            setUserCoords([position.coords.latitude, position.coords.longitude]);
        });
    }, []);

    if (!userCoords) return null;
    return (
        <LeafletMap className="Map" center={userCoords} zoom={14}>
            <LayersControl position="topright">
                <BaseLayer checked name="OpenStreetMap.Mapnik">
                    <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                </BaseLayer>
                <BaseLayer name="OpenStreetMap.BlackAndWhite">
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
                    />
                </BaseLayer>
            </LayersControl>
        </LeafletMap>
    );
};
