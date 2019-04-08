import React, {useRef} from 'react';
import L from 'leaflet';
import {Marker, Popup} from 'react-leaflet';
import PlaceIconBlue from '../resources/img/place_image-blue.svg';
import PlaceIconRed from '../resources/img/place_image-red.svg';

export const Icon = props => {
    const markerRef = useRef(null);

    const icon = L.icon({
        iconUrl: props.owner ? PlaceIconBlue : PlaceIconRed,
        iconSize: [38, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
    });

    return (
        <Marker ref={markerRef} position={[props.location.lat, props.location.long]} icon={icon}>
            <Popup closeOnClick={false} closeButton={false} autoClose={false} keepInView={true} idOpen={true}>
                <div className="custom__user_map_icon">
                    <img alt="user" src={props.avatar} />
                </div>
            </Popup>
        </Marker>
    );
};
