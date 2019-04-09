import {observable, action, decorate, computed} from 'mobx';
import {socket} from '../api/socket';

export class Chat {
    users = null;
    messages = {
        general: [],
    };
    rooms = [];
    activeRoom = 'general';

    // Users section
    get usersArray() {
        if (!this.users) return [];
        return Object.values(this.users);
    }

    get visibleUsers() {
        if (!this.users) return [];
        return Object.values(this.users).filter(user => user.location);
    }

    getUsers = userId => {
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
        this.users[user._id].location = null;
        this.users[user._id].clientId = null;
    };

    updateUserName = user => {
        this.users[user._id].name = user.name;
    };

    updateUserAvatar = user => {
        this.users[user._id].avatar = user.avatar;
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
    sendMessage = (text, userId) => {
        const message = {
            text,
            userId,
            date: new Date(),
        };

        socket.sendMessage(this.activeRoom, message);
        this.messages[this.activeRoom].push(message);
    };

    get roomMessages() {
        return this.messages[this.activeRoom];
    }
    // Messages section
}

decorate(Chat, {
    users: observable,
    messages: observable,
    rooms: observable,
    activeRoom: observable,

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
});
