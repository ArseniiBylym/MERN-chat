import React, {useEffect, useContext} from 'react';
import {Redirect} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {Map, Chat} from '../components';

import {UserStore, ChatStore} from '../store';

export const Home = observer(props => {
    const userStore = useContext(UserStore);
    const chatStore = useContext(ChatStore);
    useEffect(() => {
        if (!chatStore.users && userStore.user) {
            chatStore.getUsers(userStore.user._id);
        }
    }, []);

    if (!userStore.fetchedSuccess && !userStore.fetchedFailed) return null;
    if (!userStore.user) {
        return <Redirect to="/login" />;
    }
    return (
        <div className="Home custom__root_container">
            <div className="row m-0">
                <div className="col-6 m-0 p-0">
                    <Map />
                </div>
                <div className="col-6 m-0 p-0">
                    <Chat />
                </div>
            </div>
        </div>
    );
});
