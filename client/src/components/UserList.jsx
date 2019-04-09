import React, {useContext} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import {observer} from 'mobx-react-lite';
import {IoIosRadioButtonOff, IoIosRadioButtonOn} from 'react-icons/io';
import {ChatStore} from '../store';

export const UserList = observer(props => {
    const chatStore = useContext(ChatStore);

    const userClickHandler = userId => e => {
        chatStore.focusOnUser(userId);
    };

    return (
        <div className="UserList">
            <Paper className="w-100 p-2 d-flex nowrap flex-column">
                {chatStore.usersArray.map(item => {
                    return (
                        <div key={item._id} className="my-1" onClick={userClickHandler(item._id)}>
                            <Chip
                                avatar={
                                    <Avatar alt="User" src={item.avatar || ''}>
                                        {item.avatar ? '' : item.name[0].toUpperCase()}
                                    </Avatar>
                                }
                                label={item.name}
                                variant="outlined"
                                className="justify-content-start w-100"
                                onDelete={() => {}}
                                deleteIcon={
                                    item.clientId ? (
                                        <span className="text-success ml-auto d-flex flex-row nowrap align-items-center">
                                            <span>online</span>
                                            <span className="mb-0 ml-2 h6">
                                                <IoIosRadioButtonOn className="d-block" />
                                            </span>
                                        </span>
                                    ) : (
                                        <span className="text-success h6 ml-auto mb-0">
                                            <IoIosRadioButtonOff className="d-block" />
                                        </span>
                                    )
                                }
                            />
                        </div>
                    );
                })}
            </Paper>
        </div>
    );
});
