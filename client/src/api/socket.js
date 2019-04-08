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

    updateProfile = (userId, data) => {
        this.client.emit('updateProfile', userId, data);
    };

    showUserLocation = (userId, location) => {
        console.log(location);
        this.client.emit('showLocation', userId, location);
    };

    hideUserLocation = userId => {
        console.log(userId);
        this.client.emit('hideLocation', userId);
    };

    getClients = cb => {
        this.client.emit('getClients', null, cb);
    };

    sendMessage = (data, cb) => {
        this.client.emit('message', data, cb);
    };

    getMessages = cb => {
        this.client.emit('getMessages', cb);
    };

    initHandlers = chatStore => {
        this.client.on('message', chatStore.recieveMessage);
        this.client.on('register', chatStore.registerUser);
        this.client.on('join', chatStore.joinUser);
        this.client.on('leave', chatStore.leaveUser);
        this.client.on('updateUser', chatStore.updateUser);
        this.client.on('showLocation', chatStore.showLocation);
        this.client.on('hideLocation', chatStore.hideLocation);
        this.client.on('updateProfile', chatStore.updateProfile);
    };
}

export const socket = new Socket();
