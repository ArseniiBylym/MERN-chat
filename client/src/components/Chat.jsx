import React from 'react';
import {UserProfile, ChatBoard, UserList, ChatInput, RoomList} from '.';
import './style.scss';

export const Chat = () => {
    return (
        <div className="Chat bg-light-gray container-fluid">
            <div className="Chat__user row m-0">
                <div className="col-12 p-0">
                    <UserProfile />
                </div>
            </div>
            <div className="Chat__board row m-0">
                <div className="col-8 p-0 pr-3 h-100">
                    <ChatBoard />
                </div>
                <div className="col-4 p-0">
                    <div className="mb-2">
                        <RoomList />
                    </div>
                    <UserList />
                </div>
            </div>
            <div className="Chat__input row m-0">
                <div className="col-12 px-0">
                    <ChatInput />
                </div>
            </div>
        </div>
    );
};
