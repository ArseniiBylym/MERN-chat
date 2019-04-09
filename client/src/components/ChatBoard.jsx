import React, {useContext, useEffect, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {Message} from '.';
import {ChatStore, UserStore} from '../store';

export const ChatBoard = observer(props => {
    const chatStore = useContext(ChatStore);
    const userStore = useContext(UserStore);
    const container = useRef(false);

    useEffect(() => {
        chatStore.fetchMessages('general');
    }, []);
    useEffect(() => {
        if (container.current) {
            container.current.scrollTop = container.current.scrollHeight;
        }
    });

    const messages = chatStore.roomMessages;

    if (messages.length === 0 || !chatStore.users) return null;
    return (
        <div ref={container} className="ChatBoard bg-cream p-2">
            {messages.length > 0 &&
                messages.map(item => {
                    return (
                        <Message
                            key={item.date}
                            position={item.userId === userStore.user._id ? 'right' : 'left'}
                            user={chatStore.users[item.userId]}
                            date={item.date}
                            text={item.text}
                        />
                    );
                })}
        </div>
    );
});
