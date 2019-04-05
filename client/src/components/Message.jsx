import React, {useState, useEffect, useContext} from 'react';
import Avatar from '@material-ui/core/Avatar';

export const Message = props => {
    return (
        <div className="Message my-1">
            <div className={`Message__user d-flex flex-row align-items-center ${props.position === 'right' ? 'justify-content-end' : ''}`}>
                {props.position === 'right' && (
                    <div className="text-center mx-2">
                        <small>{new Date(props.date).toLocaleString('en-US', {hour: '2-digit', minute: '2-digit', second: '2-digit'})}</small>
                        <span className="text-primary ml-2 h6">{props.name}</span>
                    </div>
                )}
                <Avatar alt="User" style={{width: 20, height: 20, fontSize: '1rem'}} src={props.avatar || ''}>
                    {props.avatar ? '' : props.name[0].toUpperCase()}
                </Avatar>
                {props.position === 'left' && (
                    <div className="text-center mx-2">
                        <span className="text-primary mr-2 h6">{props.name}</span>
                        <small>{new Date(props.date).toLocaleString('en-US', {hour: '2-digit', minute: '2-digit', second: '2-digit'})}</small>
                    </div>
                )}
            </div>
            <div className="Message__text mx-3">{props.text}</div>
        </div>
    );
};
