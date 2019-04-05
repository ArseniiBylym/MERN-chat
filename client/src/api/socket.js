import io from 'socket.io-client';
import {ChatStore} from '../store';

class Socket {
    client = io.connect('http://localhost:5000');

    getUser = (token, cb) => {
        this.client.emit('user', token, cb);
    };

    register = (userData, cb) => {
        this.client.emit('register', userData, cb);
    };

    login = ({email, password}, cb) => {
        this.client.emit('login', {email, password}, cb);
    };

    logout = (email, cb) => {
        this.client.emit('logout', email, cb);
    };

    getUsers = cb => {
        this.client.emit('getUsers', null, cb);
    };

    getClients = cb => {
        this.client.emit('getClients', null, cb);
    };

    sendMessage = (data, cb) => {
        this.client.emit('message', data, cb);
    };

    initHandlers = (userStore, chatStore) => {
        this.client.on('message', chatStore.recieveMessage);
        // this.client.on('update users', ChatStore.updateUsersHandler);
    };
}

export const socket = new Socket();
