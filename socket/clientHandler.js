const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const io = require('./socket')

module.exports = clientHandler = (socket, manager) => {
    console.log('Client contected', socket.id);

    socket.on('register', async (data, cb) => {
        const {name, email, password, password_confirm} = data;
        const errorList = [];
        if (!password.trim().length) {
            errorList.push({password: 'Password is required'});
        }
        if (password.trim() !== password_confirm.trim()) {
            errorList.push({password_confirm: 'Password not matches'});
        }

        try {
            const hashPassword = await bcrypt.hash(password, 10);
            const user = await new User({name, email, password: hashPassword}).save();
            const token = jwt.sign(
                {
                    email,
                    id: user.id.toString(),
                },
                process.env.JWT_SECRET_KEY,
                {expiresIn: '1d'},
            );
            manager.registerUser(user.toJSON, socket.id)
            socket.broadcast.emit('register', manager.getUserById(user.id));
            return cb({user: manager.getUserById(user.id), token});
        } catch (error) {
            if (error.name === 'ValidationError') {
                console.log(error.errors);
                const errorList = {};
                for (let key in error.errors) {
                    errorList[key] = error.errors[key].message;
                }
                return cb({error: 'Registration failed', errorType: 'form', errorList});
            }
        }
    });

    socket.on('login', async ({email, password}, cb) => {
        try {
            const user = await User.findOne({email}).exec();
            if (!user) {
                return cb({error: 'Wrong email', errorType: 'form', errorList: {email: 'Wrong email'}});
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return cb({error: 'Wrong password', errorType: 'form', errorList: {password: 'Wrong password'}});
            }
            const token = jwt.sign({email, id: user.id.toString()}, process.env.JWT_SECRET_KEY, {expiresIn: '1d'});
            manager.addClient(socket.id, user.id);
            socket.broadcast.emit('join', manager.getUserWithParams(user.id, ['location', 'clientId']));
            return cb({user: manager.getUserById(user.id), token});
        } catch (error) {
            console.log(error);
            return cb({error: 'Login failed'});
        }
    });

    socket.on('user', async (token, cb) => {
        if (!token) return cb({error: 'Authorization denied, token is required'});
        try {
            const {email, id} = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await User.findById(id);
            if (!user) return cb({error: 'Token is not valid'});
            manager.addClient(socket.id, user.id);
            socket.broadcast.emit('join', manager.getUserWithParams(user.id, ['location', 'clientId']));
            return cb({user: manager.getUserById(user.id), token});
        } catch (error) {
            return cb({error: 'No user aveilable'});
        }
    });

    socket.on('logout', userId => {
        manager.removeClient(userId);
        socket.broadcast.emit('leave', manager.getUserWithParams(userId, ['location', 'clientId']));
    });

    socket.on('getUsers', (data, cb) => {
        return cb(manager.getUsers());
    });

    socket.on('getMessages', (room, cb) => {
        return cb(manager.getMessages(room));
    });

    socket.on('message', (room, data) => {
        manager.addMessage(room, data);
        socket.broadcast.emit('message', room, data);
    });

    socket.on('showLocation', (userId, location) => {
        manager.showLocation(userId, location);
        socket.broadcast.emit('showLocation', manager.getUserWithParams(userId, ['location']));
    });

    socket.on('hideLocation', userId => {
        manager.hideLocation(userId);
        socket.broadcast.emit('hideLocation', manager.getUserWithParams(userId, ['location']));
    });

    socket.on('updateUserName', (userId, name) => {
        manager.updateUserName(userId, name);
        socket.broadcast.emit('updateUserName', ({_id: userId, name}))
    })

    socket.on('updateUserAvatar', async (userId, avatar) => {
        manager.updateUserAvatar(userId, avatar);
        socket.broadcast.emit('updateUserAvatar', {_id: userId, avatar})
    })

    socket.on('getRooms', (cb) => {
        cb(manager.getRooms())
    })

    socket.on('createRoom', name => {
        manager.createRoom(name);
        socket.broadcast.emit('createRoom', name);
    })

    socket.on('getPrivateMessages', (userId, conectedUserId, cb) => {
        cb(manager.getPrivateMessages(userId, conectedUserId))
    })

    socket.on('privateMessage', (message, conectedUserId, clientId) => {
        manager.addPrivateMessage(message, conectedUserId);
        io.getIO().to(`${clientId}`).emit('privateMessage', message);
    })
};
