import React, {useState, useEffect, useContext} from 'react';
import {Map as LeafletMap, LayersControl, TileLayer} from 'react-leaflet';
import {observer} from 'mobx-react-lite';
import {ChatStore, UserStore} from '../store';
import {Icon} from '.';

const {BaseLayer} = LayersControl;

export const Map = observer(props => {
    const [userCoords, setUserCoords] = useState(null);
    const chatStore = useContext(ChatStore);
    const userStore = useContext(UserStore);
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            setUserCoords([position.coords.latitude, position.coords.longitude]);
        });
    }, []);

    const avatars = chatStore.usersWithLocation.map(user => {
        return <Icon key={user._id} {...user} owner={user._id === userStore.user._id} />;
    });

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
                {avatars}
            </LayersControl>
        </LeafletMap>
    );
});
