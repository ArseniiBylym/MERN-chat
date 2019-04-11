import React, {useState, useContext,} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import {observer} from 'mobx-react-lite';
import {FaSignOutAlt} from 'react-icons/fa';
import {UserStore, ChatStore} from '../store';
import {toBase64} from '../resources/helpers/file';

export const UserProfile = observer(props => {
    const [switcher, setSwitcher] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const userStore = useContext(UserStore);
    const chatStore = useContext(ChatStore);

    const showMapHandler = () => {
        if (switcher) {
            chatStore.updateLocation(userStore.user._id);
        } else {
            navigator.geolocation.getCurrentPosition(position => {
                chatStore.updateLocation(userStore.user._id, {lat: position.coords.latitude, long: position.coords.longitude});
            });
        }
        setSwitcher(!switcher);
    };

    const logoutHandler = () => {
        userStore.logoutUser();
    };

    const changeAvatarHandler = e => {
        toBase64(e.target.files[0]).then(file => {
            userStore.updateUserAvatar(file);
        });
    };

    const keyUpHandler = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.target.value) {
                userStore.updateUserName(e.target.value);
            }
            setEditMode(false);
            return false;
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            setEditMode(false);
            return false;
        }
    };

    if (!userStore.user) return null;
    return (
        <div className="UserProfile container-fluid my-3 px-0 mx-0">
            <Paper elevation={2} className="row m-0 p-3">
                <div className="col-2 text-center align-items-center ">
                    <label style={{margin: 0}}>
                        <input type="file" hidden onChange={changeAvatarHandler} />
                        <Avatar style={{width: 60, height: 60}} alt="User" src={userStore.user.avatar || ''}>
                            {userStore.user.name[0].toUpperCase()}
                        </Avatar>
                    </label>
                </div>
                {editMode ? (
                    <TextField autoFocus margin="dense" id="name" label="User name" type="text" defaultValue={userStore.user.name} onKeyUp={keyUpHandler} style={{flexGrow: 1}} />
                ) : (
                    <div onDoubleClick={() => setEditMode(true)} className="col-5 h5 mb-0 d-flex align-items-center">
                        {userStore.user.name}
                    </div>
                )}
                <div className="col-4 d-flex justify-content-end align-items-center">
                    <FormControlLabel
                        style={{margin: 0}}
                        control={<Switch checked={switcher} onChange={showMapHandler} color="primary" />}
                        label={switcher ? 'Hide position' : 'Show position'}
                    />
                </div>
                <div className="col-1 d-flex align-items-center justify-content-end" onClick={logoutHandler}>
                    <Tooltip title="Logout" placement="top">
                        <FaSignOutAlt className="d-block custom__cursor_pointer" />
                    </Tooltip>
                </div>
            </Paper>
        </div>
    );
});
