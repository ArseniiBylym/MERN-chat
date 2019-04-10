import {observable, action, decorate, computed} from 'mobx';
import {socket} from '../api/socket';
import {globalStore} from '.';

export class Chat {
    users = null;
    messages = {
        general: [],
    };
    rooms = ['general'];
    activeRoom = 'general';
    focusedCoords = [];

    // Users section
    get usersArray() {
        if (!this.users || !globalStore.userStore.user) return [];
        return Object.values(this.users).filter(user => user._id !== globalStore.userStore.user._id);
    }

    get visibleUsers() {
        if (!this.users) return [];
        return Object.values(this.users)
            .filter(user => user.location)
            .map(user => {
                if (user._id === globalStore.userStore.user._id) {
                    return {
                        ...user,
                        owner: true,
                    };
                }
                return user;
            });
    }

    getUsers = () => {
        socket.getUsers(result => {
            if (result) {
                this.users = result;
            }
        });
    };

    registerUser = user => {
        this.users[user._id] = user;
    };

    joinUser = user => {
        this.users[user._id].location = user.location;
        this.users[user._id].clientId = user.clientId;
    };

    leaveUser = user => {
        if (this.users) {
            this.users[user._id].location = null;
            this.users[user._id].clientId = null;
        }
    };

    updateUserName = user => {
        this.users[user._id].name = user.name;
    };

    updateUserAvatar = user => {
        if (this.users[user._id]) {
            this.users[user._id].avatar = user.avatar;
        }
    };

    focusOnUser = userId => {
        if (!this.users[userId].clientId || !this.users[userId].location) return false;
        this.focusedCoords = [this.users[userId].location.lat, this.users[userId].location.long];
    };
    // Users section

    // Location section
    updateLocation = (userId, location) => {
        if (location) {
            socket.showUserLocation(userId, location);
            this.users[userId].location = location;
        } else {
            socket.hideUserLocation(userId);
            this.users[userId].location = null;
        }
    };

    showLocation = data => {
        if (this.users[data._id]) {
            this.users[data._id].location = data.location;
        }
    };
    hideLocation = data => {
        if (this.users[data._id]) {
            this.users[data._id].location = data.location;
        }
    };
    // Location section

    // Messages section
    fetchMessages = () => {
        socket.getMessages(this.activeRoom, result => {
            this.messages[this.activeRoom] = result;
        });
    };
    recieveMessage = (room = 'general', message) => {
        this.messages[room].push(message);
    };
    sendMessage = text => {
        const message = {
            text,
            userId: globalStore.userStore.user._id,
            date: new Date(),
        };

        socket.sendMessage(this.activeRoom, message);
        this.messages[this.activeRoom].push(message);
    };

    get roomMessages() {
        if (!this.messages[this.activeRoom]) return [];
        if (this.messages[this.activeRoom].length === 0 || !this.users) return [];
        return this.messages[this.activeRoom].map(message => {
            return {
                ...message,
                user: this.users[message.userId],
                owner: message.userId === globalStore.userStore.user._id,
            };
        });
    }
    // Messages section

    // Room section
    getRooms = () => {
        socket.getRooms(result => {
            if (result) {
                this.rooms = result;
                result.forEach(roomName => {
                    if (roomName !== 'general') {
                        this.messages[roomName] = [];
                    }
                });
            }
        });
    };

    createRoom = name => {
        if (this.rooms.includes(name)) return false;
        socket.createRoom(name);
        this.rooms.push(name);
    };

    selectRoom = name => {
        this.activeRoom = name;
    };

    addNewRoom = name => {
        this.rooms.push(name);
        this.messages[name] = [];
    };
}

decorate(Chat, {
    users: observable,
    messages: observable,
    rooms: observable,
    activeRoom: observable,
    focusedCoords: observable,

    usersArray: computed,
    visibleUsers: computed,

    getUsers: action,
    registerUser: action,
    joinUser: action,
    leaveUser: action,
    updateUserName: action,
    updateUserAvatar: action,

    updateLocation: action,

    fetchMessages: action,
    recieveMessage: action,
    sendMessage: action,
    roomMessages: computed,

    getRooms: action,
    selectRoom: action,
    addNewRoom: action,
});
