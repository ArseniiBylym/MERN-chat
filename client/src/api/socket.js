import io from 'socket.io-client';
import {globalStore} from '../store';
import {BASE_URI} from './config';

class Socket {
    client = io.connect(BASE_URI);

    getUser = (token, cb) => {
        this.client.emit('user', token, cb);
    };

    register = (registerData, cb) => {
        this.client.emit('register', registerData, cb);
    };

    login = (loginData, cb) => {
        this.client.emit('login', loginData, cb);
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

    sendPrivateMessage = (message, conectedUserId, clientId) => {
        this.client.emit('privateMessage', message, conectedUserId, clientId);
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

    fetchPrivateMessages = (userId, clientId, cb) => {
        this.client.emit('getPrivateMessages', userId, clientId, cb);
    };

    initHandlers = () => {
        this.client.on('register', globalStore.chatStore.registerUser);
        this.client.on('join', globalStore.chatStore.joinUser);
        this.client.on('leave', globalStore.chatStore.leaveUser);
        this.client.on('message', globalStore.chatStore.recieveMessage);
        this.client.on('privateMessage', globalStore.chatStore.recievePrivateMessage);
        this.client.on('updateUserName', globalStore.chatStore.updateUserName);
        this.client.on('updateUserAvatar', globalStore.chatStore.updateUserAvatar);
        this.client.on('showLocation', globalStore.chatStore.showLocation);
        this.client.on('hideLocation', globalStore.chatStore.hideLocation);
        this.client.on('updateProfile', globalStore.chatStore.updateProfile);
        this.client.on('createRoom', globalStore.chatStore.addNewRoom);
    };
}

export const socket = new Socket();
