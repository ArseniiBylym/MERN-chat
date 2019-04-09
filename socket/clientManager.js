const User = require('../models/User.model');

module.exports = clientManager = () => {
    const users = {};
    const rooms = ['general'];
    const messages = {
        general: []
    };

    const initUsersFromDB = async () => {
        try {
            const result = await User.find().exec();
            if(result) {
                result.forEach(item => {
                    users[item._id.toString()] = {
                        ...item.toJSON(),
                        location: null, 
                        clientId: null,
                    }
    
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getUsers = () => users;
    const getUserById = userId => users[userId];
    const getUserWithParams = (_id, params) => {
        const data = {_id}
        params.forEach(item => data[item] = users[_id][item]) 
        return data;
    }
    const getMessages = (room = 'general') => messages[room];
    const getAllMessages = () => messages;

    const registerUser = (user, clientId) => {
        users[user._id] = {
            ...user,
            location: null,
            clientId,
        };
    }

    const addClient = (clientId, userId) => {
        users[userId].clientId = clientId;
    }

    const removeClient = (userId) => {
        users[userId].clientId = null;
        users[userId].location = null;
    }

    const addRoom = roomName => rooms.push(roomName);

    const getRooms = () => rooms;

    const addMessage = (room = 'general', message) => {
        messages[room].push(message);
    }

    const showLocation = (userId, location) => {
        users[userId].location = location;
    }

    const hideLocation = userId => {
        users[userId].location = null;
    }

    const updateUserName = async (userId, name) => {
        try {
            let user = await User.findById(userId).exec();
            user.name = name;
            user.save()
        } catch (error) {
            console.log(error);
        }
    }

    const updateUserAvatar = async (userId, avatar) => {
        try {
            let user = await User.findById(userId).exec();
            user.avatar = avatar;
            await user.save()
            return;
        } catch (error) {
            console.log(error);
        }
    }

    return {
        initUsersFromDB,
        getUsers,
        getMessages,
        addClient,
        removeClient,
        addMessage,
        showLocation,
        hideLocation,
        addRoom,
        getRooms,
        getUserById,
        getUserWithParams,
        updateUserName,
        updateUserAvatar,
        registerUser,
        getAllMessages
    }
}
