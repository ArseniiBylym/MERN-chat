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

    logout = (email, cb) => {
        this.client.emit('logout', email, cb);
    };

    getUsers = cb => {
        this.client.emit('getUsers', null, cb);
    };
}

export const socket = new Socket();
