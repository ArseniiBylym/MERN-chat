import React, {useState, useEffect, useContext} from 'react';
import {Map as LeafletMap, LayersControl, TileLayer} from 'react-leaflet';
import {observer} from 'mobx-react-lite';
import {ChatStore} from '../store';
import {Icon} from '.';

const {BaseLayer} = LayersControl;

export const Map = observer(props => {
    const [userCoords, setUserCoords] = useState(null);
    const chatStore = useContext(ChatStore);
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            setUserCoords([position.coords.latitude, position.coords.longitude]);
        });
    }, []);

    const avatars = chatStore.visibleUsers.map(user => {
        return <Icon key={user._id} {...user} />;
    });
    const focusCoords = () => {
        if (chatStore.focusedCoords.length === 0) {
            return userCoords || null;
        }
        return chatStore.focusedCoords;
    };

    if (!userCoords) return null;
    return (
        <LeafletMap className="Map" center={focusCoords()} zoom={16}>
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
                {avatars}
            </LayersControl>
        </LeafletMap>
    );
});
