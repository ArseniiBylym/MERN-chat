import {observable, action, decorate, computed} from 'mobx';
import {socket} from '../api/socket';

export class Chat {
    users = null;
    conectedUsers = {};
    messages = [];

    get userList() {
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
});
