import React, {useContext} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import {observer} from 'mobx-react-lite';
import {IoIosRadioButtonOff, IoIosRadioButtonOn} from 'react-icons/io';
import {ChatStore} from '../store';

export const UserList = observer(props => {
    const chatStore = useContext(ChatStore);

    if (!chatStore.users) return null;
    return (
        <div className="UserList">
            <Paper className="w-100 p-2 d-flex nowrap flex-column">
                {chatStore.usersArray.map(item => {
                    return (
                        <div key={item._id} className="my-1">
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
                                        <span className="text-success h6 ml-auto">
                                            <IoIosRadioButtonOn className="d-block" />
                                        </span>
                                    ) : (
                                        <span className="text-success h6 ml-auto">
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
