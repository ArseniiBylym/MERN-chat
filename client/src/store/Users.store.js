import {observable, action, decorate, computed} from 'mobx';
import {socket} from '../api/socket';

export class Users {
    users = null;

    getUsers = () => {
        socket.getUsers(result => {
            if (result) this.users = result;
        });
    };
}

decorate(Users, {
    users: observable,
    getUsers: action,
});
