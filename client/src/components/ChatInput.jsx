import React, {useState, useContext} from 'react';
import {observer} from 'mobx-react-lite';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {ChatStore} from '../store';

export const ChatInput = observer(props => {
    const chatStore = useContext(ChatStore);
    const [message, setMessage] = useState('');

    const messageHandler = e => {
        setMessage(e.target.value);
    };

    const sendMessageHandler = () => {
        chatStore.sendMessage(message);
        setMessage('');
    };

    const onKeyUpHandler = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessageHandler();
            return false;
        }
    };

    return (
        <div className="ChatInput p-3 d-flex bg-white align-items-center">
            <TextField
                id="filled-multiline-flexible"
                label="Message"
                multiline
                style={{margin: 0, flexGrow: 1, marginRight: '16px'}}
                rowsMax="1"
                value={message}
                onKeyUp={onKeyUpHandler}
                onChange={messageHandler}
                margin="normal"
                variant="filled"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Button onClick={sendMessageHandler} variant="contained" color="primary" className="align-self-center px-3">
                Send
            </Button>
        </div>
    );
});
