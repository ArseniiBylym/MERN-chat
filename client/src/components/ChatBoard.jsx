import React, {useContext, useEffect, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {Message} from '.';
import {ChatStore} from '../store';

export const ChatBoard = observer(props => {
    const chatStore = useContext(ChatStore);
    const container = useRef(false);

    useEffect(() => {
        chatStore.fetchMessages();
    }, [chatStore.activeRoom]);
    useEffect(() => {
        if (container.current) {
            container.current.scrollTop = container.current.scrollHeight;
        }
    });
    useEffect(() => {
        chatStore.fetchPrivateMessages();
    }, [chatStore.respondent]);

    const messages = chatStore.respondent ? chatStore.respondentMessages : chatStore.roomMessages;
    // const messages = chatStore.roomMessages;

    return (
        <div ref={container} className="ChatBoard bg-cream p-2">
            {messages.length ? (
                messages.map(item => {
                    return <Message key={item.date} {...item} />;
                })
            ) : (
                <h6 className="text-center">You have no active messages</h6>
            )}
        </div>
    );
});
