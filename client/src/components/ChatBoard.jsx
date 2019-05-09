import React, {useContext, useEffect, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
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

    const getChatName = () => (
        <Typography align="center" variant="h6">
            {chatStore.respondent ? (
                <span>
                    Private chat - <span className="text-primary">{chatStore.users[chatStore.respondent._id].name}</span>
                </span>
            ) : (
                <span>
                    Public chat - <span className="text-primary">{chatStore.activeRoom}</span>
                </span>
            )}
        </Typography>
    );

    const messages = chatStore.respondent ? chatStore.respondentMessages : chatStore.roomMessages;

    return (
        <div className="ChatBoard">
            <Paper elevation={3} className="ChatBoard__header p2 mb-2">
                {getChatName()}
            </Paper>
            <div ref={container} className="ChatBoard__content pb-5">
                {messages.length ? (
                    messages.map(item => {
                        return <Message key={item.date} {...item} />;
                    })
                ) : (
                    <h6 className="text-center">You have no active messages</h6>
                )}
            </div>
        </div>
    );
});
