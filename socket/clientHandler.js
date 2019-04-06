const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

module.exports = clientHandler = (socket, manager) => {
    console.log('Client contected', socket.id);

    socket.on('register', async(data, cb) => {
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
            manager.addClient(socket.id, user.id);
            socket.broadcast.emit('register', user.toJSON(), socket.id)
            return cb({clientId: socket.id, user: user.toJSON(), token});
        } catch (error) {
            if (error.name === 'ValidationError') {
                console.log(error.errors)
                const errorList = {};
                for (let key in error.errors) {
                    errorList[key] = error.errors[key].message
                }
                return cb({error: 'Registration failed', errorType: 'form', errorList});
            }
        }
    });

    socket.on('login', async ({email, password}, cb) => {
        try {
            const user = await User.findOne({email}).exec();
            if (!user) {
                return cb({error: 'Wrong email', errorType: 'form', errorList: {email: 'Wrong email'}})
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return cb({error: 'Wrong password', errorType: 'form', errorList: {password: 'Wrong password'}})
            }
            const token = jwt.sign(
                {email, id: user.id.toString(),},
                process.env.JWT_SECRET_KEY,
                {expiresIn: '1d'},
            );
            manager.addClient(socket.id, user.id);
            socket.broadcast.emit('join', {[user.id]: socket.id})
            return cb({clientId: socket.id, user: user.toJSON(), token});
        } catch (error) {
            return cb({error: 'Login failed'});
        }
    })


    socket.on('user', async (token, cb) => {
        if (!token) return cb({error: 'Authorization denied, token is required'})
        try {
            const {email, id} = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await User.findById(id)
            if (!user)  return cb({error: 'Token is not valid'})
            manager.addClient(socket.id, user.id);
            socket.broadcast.emit('join', {[user.id]: socket.id});
            return cb({clientId: socket.id, user: user.toJSON(), token});
        } catch (error) {
            return cb({error: 'No user aveilable'})
        }
    });


    socket.on('logout', (userId) => {
        manager.removeClient(userId);
        socket.broadcast.emit('leave', userId);
    });

    socket.on('getUsers', (data, cb) => {
        return cb(manager.getUsers());
    })

    socket.on('getClients', (data, cb) => {
        return cb(manager.getClients());
    })

    socket.on('message', (data, cb) => {
        manager.addMessage(data);
        socket.broadcast.emit('message', data)
        return cb(true);
    })

}