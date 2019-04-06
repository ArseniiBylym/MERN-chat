import io from 'socket.io-client';

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

    logout = (userId, cb) => {
        this.client.emit('logout', userId);
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

    initHandlers = chatStore => {
        this.client.on('message', chatStore.recieveMessage);
        this.client.on('register', chatStore.registerUser);
        this.client.on('join', chatStore.joinUser);
        this.client.on('leave', chatStore.leaveUser);
    };
}

export const socket = new Socket();
