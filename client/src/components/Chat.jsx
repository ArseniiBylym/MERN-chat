import React from 'react';
import {UserProfile, ChatBoard, UserList} from '.';
import './style.scss';

export const Chat = props => {
    return (
        <div className="Chat container-fluid">
            <div className="row m-0">
                <div className="col-12">
                    <UserProfile />
                </div>
                <div className="col-6">
                    <ChatBoard />
                </div>
                <div className="col-6">
                    <UserList />
                </div>
            </div>
        </div>
    );
};
