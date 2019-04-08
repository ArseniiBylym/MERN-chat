import React, {useState, useEffect, useContext} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import {observer} from 'mobx-react-lite';
import {FaSignOutAlt} from 'react-icons/fa';
import {UserStore, ChatStore} from '../store';
import {toBase64} from '../resources/helpers/file';

export const UserProfile = observer(props => {
    const [switcher, setSwitcher] = useState(false);
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
            userStore.updateProfile({avatar: file});
        });
    };

    if (!userStore.user) return null;
    return (
        <div className="UserProfile container-fluid my-3 px-0 mx-0">
            <Paper elevation={2} className="row m-0 p-3">
                <div className="col-2 text-center align-items-center ">
                    <label>
                        <input type="file" hidden onChange={changeAvatarHandler} />
                        <Avatar style={{width: 60, height: 60}} alt="User" src={userStore.user.avatar || ''}>
                            {userStore.user.name[0].toUpperCase()}
                        </Avatar>
                    </label>
                </div>
                <div className="col-8 h5 mb-0 d-flex align-items-center">{userStore.user.name}</div>
                <div className="col-2 d-flex align-items-center justify-content-end" onClick={logoutHandler}>
                    <Tooltip title="Logout" placement="top">
                        <FaSignOutAlt className="d-block custom__cursor_pointer" />
                    </Tooltip>
                </div>
                <div className="col-12 d-flex justify-content-end">
                    <div>
                        <FormControlLabel control={<Switch checked={switcher} onChange={showMapHandler} color="primary" />} label={switcher ? 'Hide position' : 'Show position'} />
                    </div>
                </div>
            </Paper>
        </div>
    );
});
