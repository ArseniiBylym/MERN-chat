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
            console.log('conected', result);
            if (result) {
                const obj = {};
                result.forEach(item => {
                    obj[item.userId] = item.clientId;
                });
                this.conectedUsers = obj;
            }
            console.log(this.conectedUsers);
        });
    };

    updateUsersHandler = user => {
        const updatedUsers = this.conectedUsers.map(item => {
            if (item.id === user.id) return user;
            return item;
        });
        this.conectedUsers = updatedUsers;
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
