import React, {useContext, createContext} from 'react';

import {User} from './User.store';
import {Chat} from './Chat.store';

export const UserStore = createContext(new User());
export const ChatStore = createContext(new Chat());

// export const globalStore = {};

// const GlobalStore = () => {
//     globalStore.userStore = useContext(UserStore);
//     globalStore.chatStore = useContext(ChatStore);
//     return (null)
// };

// GlobalStore();
