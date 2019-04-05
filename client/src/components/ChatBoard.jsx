import React, {useState, useContext, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Message} from '.';
import {ChatStore, UserStore} from '../store';

export const ChatBoard = observer(props => {
    const chatStore = useContext(ChatStore);
    const userStore = useContext(UserStore);

    const messages = chatStore.getMessages;

    return (
        <div className="ChatBoard ">
            {messages.length > 0 &&
                messages.map(item => {
                    return <Message key={item.date} position={item.userId === userStore.user._id ? 'right' : 'left'} {...item} />;
                })}
        </div>
    );
});
