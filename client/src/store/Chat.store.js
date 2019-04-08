import {observable, action, decorate, computed} from 'mobx';
import {socket} from '../api/socket';

export class Chat {
    users = null;
    conectedUsers = {};
    messages = [];

    get userList() {
        if (!this.users) return null;
        return this.users.map((item, i) => {
            if (this.conectedUsers[item._id]) {
                return {
                    ...item,
                    conected: true,
                    clientId: this.conectedUsers[item._id],
                };
            }
            return item;
        });
    }

    get usersWithLocation() {
        if (!this.userList) return [];
        const arr = this.userList.slice();
        return arr.filter(item => {
            return item.conected && item.location;
        });
    }

    getUsers = () => {
        socket.getUsers(result => {
            if (result) this.users = result;
        });
    };

    getConectedUsers = () => {
        socket.getClients(result => {
            if (result) {
                const obj = {};
                result.forEach(item => {
                    obj[item.userId] = item.clientId;
                });
                this.conectedUsers = obj;
            }
        });
    };

    registerUser = (user, clientId) => {
        this.users.push(user);
        if (!this.conectedUsers[user._id]) {
            this.conectedUsers[user._id] = clientId;
        }
    };

    joinUser = client => {
        this.conectedUsers = {...this.conectedUsers, ...client};
    };

    leaveUser = userId => {
        if (this.conectedUsers[userId]) {
            delete this.conectedUsers[userId];
        }
    };

    updateUser = user => {
        let currentUser = this.users.find(item => item._id === user._id);
        if (currentUser) {
            currentUser = user;
        }
    };

    updateLocation = (userId, location) => {
        if (location) {
            socket.showUserLocation(userId, location);
            this.showLocation(userId, location);
        } else {
            console.log('111');
            socket.hideUserLocation(userId);
            this.hideLocation(userId);
        }
    };

    showLocation = (userId, location) => {
        const currentUser = this.users.find(item => item._id === userId);
        if (currentUser) {
            console.log(currentUser);
            currentUser.location = location;
        }
    };

    hideLocation = userId => {
        const currentUser = this.users.find(item => item._id === userId);
        if (currentUser) {
            console.log(currentUser);
            delete currentUser.location;
        }
    };

    fetchMessages = () => {
        socket.getMessages(result => {
            this.messages = result;
        });
    };

    get getMessages() {
        return this.messages.map(item => {
            const author = this.users.find(user => user._id === item.userId);
            return {
                ...item,
                ...author,
            };
        });
    }
    recieveMessage = message => {
        this.messages.push(message);
    };
    sendMessage = (text, user) => {
        const data = {
            text,
            userId: user._id,
            date: new Date(),
        };

        return socket.sendMessage(data, result => {
            this.messages.push(data);
        });
    };

    updateProfile = (userId, data) => {
        const currentUser = this.users.find(item => item._id === userId);
        if (currentUser) {
            for (const key in data) {
                if (key) {
                    currentUser[key] = data[key];
                }
            }
        }
    };
}

decorate(Chat, {
    users: observable,
    conectedUsers: observable,
    getUsers: action,
    updateUsersHandler: action,
    userList: computed,
    messages: observable,
    getMessage: action,
    sendMessage: action,
    getMessages: computed,
    updateUser: action,
    showLocation: action,
    hideLocation: action,
    updateLocation: action,
    usersWithLocation: computed,
    updateProfile: action,
});
