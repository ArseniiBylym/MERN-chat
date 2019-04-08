import React from 'react';
import {UserProfile, ChatBoard, UserList, ChatInput} from '.';
import './style.scss';

export const Chat = props => {
    return (
        <div className="Chat container-fluid">
            <div className="row m-0">
                <div className="col-12">
                    <UserProfile />
                </div>
                <div className="col-8 p-0 px-1">
                    <ChatBoard />
                </div>
                <div className="col-4 p-0 px-1">
                    <UserList />
                </div>
            </div>
            <ChatInput />
        </div>
    );
};
