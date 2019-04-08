import React, {useState, useContext, useEffect, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {Message} from '.';
import {ChatStore, UserStore} from '../store';

export const ChatBoard = observer(props => {
    const chatStore = useContext(ChatStore);
    const userStore = useContext(UserStore);
    const container = useRef(false);

    useEffect(() => {
        chatStore.fetchMessages();
    }, []);
    useEffect(() => {
        if (container.current) {
            container.current.scrollTop = container.current.scrollHeight;
        }
    });

    const messages = chatStore.getMessages;

    if (messages.length === 0) return null;
    return (
        <div ref={container} className="ChatBoard bg-cream p-2">
            {messages.length > 0 &&
                messages.map(item => {
                    return <Message key={item.date} position={item.userId === userStore.user._id ? 'right' : 'left'} {...item} />;
                })}
        </div>
    );
});
