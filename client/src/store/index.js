import {createContext} from 'react';

import {User} from './User.store';
import {Users} from './Users.store';

export const UserStore = createContext(new User());
export const UsersStore = createContext(new Users());
