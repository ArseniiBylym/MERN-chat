import io from 'socket.io-client';
import {globalStore} from '../store';

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

    updateUserName = (userId, name) => {
        this.client.emit('updateUserName', userId, name);
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

    getRooms = cb => {
        this.client.emit('getRooms', cb);
    };

    createRoom = name => {
        this.client.emit('createRoom', name);
    };

    initHandlers = () => {
        this.client.on('register', globalStore.chatStore.registerUser);
        this.client.on('join', globalStore.chatStore.joinUser);
        this.client.on('leave', globalStore.chatStore.leaveUser);
        this.client.on('message', globalStore.chatStore.recieveMessage);
        this.client.on('updateUserName', globalStore.chatStore.updateUserName);
        this.client.on('updateUserAvatar', globalStore.chatStore.updateUserAvatar);
        this.client.on('showLocation', globalStore.chatStore.showLocation);
        this.client.on('hideLocation', globalStore.chatStore.hideLocation);
        this.client.on('updateProfile', globalStore.chatStore.updateProfile);
        this.client.on('createRoom', globalStore.chatStore.addNewRoom);
    };
}

export const socket = new Socket();
