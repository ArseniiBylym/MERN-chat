import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';

export const Message = ({position, user, date, text}) => {
    const getMessageTime = messageDate => {
        return new Date(messageDate).toLocaleString('en-US', {hour: '2-digit', minute: '2-digit', second: '2-digit'});
    };

    return (
        <div className="Message my-3">
            <Paper className={`p-2 ${position === 'right' ? 'ml-5' : 'mr-5'}`}>
                <div className={`Message__user d-flex flex-row align-items-center ${position === 'right' ? 'justify-content-end' : ''}`}>
                    {position === 'right' && (
                        <div className="text-center mx-2">
                            <small>{getMessageTime(date)}</small>
                            <span className="text-primary ml-2 h6">{user.name}</span>
                        </div>
                    )}
                    <Avatar alt="User" style={{width: 20, height: 20, fontSize: '1rem'}} src={user.avatar || ''}>
                        {user.avatar ? '' : user.name[0].toUpperCase()}
                    </Avatar>
                    {position === 'left' && (
                        <div className="text-center mx-2">
                            <span className="text-primary mr-2 h6">{user.name}</span>
                            <small>{getMessageTime(date)}</small>
                        </div>
                    )}
                </div>

                <div className="Message__text ml-4">{text}</div>
            </Paper>
        </div>
    );
};
