import React, {useContext, useState, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import {ChatStore} from '../store';

export const RoomList = observer(props => {
    const chatStore = useContext(ChatStore);
    const [modal, setModal] = useState(false);
    const [newRoom, setNewRoom] = useState('');

    const modalHandler = e => {
        if (newRoom) setNewRoom('');
        setModal(!modal);
    };

    const roomClickHandler = roomName => e => {
        chatStore.selectRoom(roomName);
    };

    const createNewRoom = () => {
        if (!newRoom) return false;
        setModal(false);
        chatStore.createRoom(newRoom);
    };

    const textChangeHandler = e => {
        setNewRoom(e.target.value);
    };

    const keyUpHandler = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            createNewRoom();
        }
    };

    return (
        <div className="RoomList">
            <Paper className="w-100 d-flex nowrap flex-column">
                <Typography align="center" color="primary" variant="h6">
                    Chat list
                </Typography>
                <List component="nav">
                    {chatStore.rooms.map(room => {
                        return (
                            <ListItem key={room} button selected={chatStore.activeRoom === room} onClick={roomClickHandler(room)} className="py-1">
                                <ListItemText primary={room} />
                            </ListItem>
                        );
                    })}
                </List>
                <Fab onClick={modalHandler} color="primary" aria-label="add" style={{width: 36, height: 36, marginLeft: 'auto', marginBottom: 5, marginRight: 5}}>
                    +
                </Fab>
            </Paper>
            <Dialog open={modal} onClose={modalHandler}>
                <DialogTitle style={{padding: 30, minWidth: 500}}>Add new chat room</DialogTitle>
                <DialogContent style={{padding: 30}}>
                    <TextField autoFocus margin="dense" label="New room name" type="text" fullWidth onChange={textChangeHandler} onKeyUp={keyUpHandler} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={modalHandler} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={createNewRoom} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
});
