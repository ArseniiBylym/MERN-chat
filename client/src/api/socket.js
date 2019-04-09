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

    logout = userId => {
        this.client.emit('logout', userId);
    };

    getUsers = cb => {
        this.client.emit('getUsers', null, cb);
    };

    updataUserName = (userId, name) => {
        this.client.emit('updataUserName', userId, name);
    };

    updateUserAvatar = (userId, avatar) => {
        this.client.emit('updateUserAvatar', userId, avatar);
    };

    showUserLocation = (userId, location) => {
        this.client.emit('showLocation', userId, location);
    };

    hideUserLocation = userId => {
        this.client.emit('hideLocation', userId);
    };

    getClients = cb => {
        this.client.emit('getClients', null, cb);
    };

    sendMessage = (room, message) => {
        this.client.emit('message', room, message);
    };

    getMessages = (room, cb) => {
        this.client.emit('getMessages', room, cb);
    };

    initHandlers = chatStore => {
        this.client.on('register', chatStore.registerUser);
        this.client.on('join', chatStore.joinUser);
        this.client.on('leave', chatStore.leaveUser);
        this.client.on('message', chatStore.recieveMessage);
        this.client.on('updateUserName', chatStore.updateUserName);
        this.client.on('updateUserAvatar', chatStore.updateUserAvatar);
        this.client.on('showLocation', chatStore.showLocation);
        this.client.on('hideLocation', chatStore.hideLocation);
        this.client.on('updateProfile', chatStore.updateProfile);
    };
}

export const socket = new Socket();
