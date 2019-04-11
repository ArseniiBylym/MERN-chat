const User = require('../models/User.model');

module.exports = clientManager = () => {
    const users = {};
    const rooms = ['general'];
    const messages = {
        general: [],
    };
    const privateMessages = {};

    const initUsersFromDB = async () => {
        try {
            const result = await User.find().exec();
            if (result) {
                result.forEach(item => {
                    users[item._id.toString()] = {
                        ...item.toJSON(),
                        location: null,
                        clientId: null,
                    };
                    privateMessages[item._id.toString()] = {};
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getUsers = () => users;
    const getUserById = userId => users[userId];
    const getUserWithParams = (_id, params) => {
        const data = {_id};
        params.forEach(item => (data[item] = users[_id][item]));
        return data;
    };

    const getAllMessages = () => messages;
    const getMessages = (room = 'general') => messages[room];
    const addMessage = (room = 'general', message) => {
        messages[room].push(message);
    };
    const getPrivateMessages = (userId, conectedUserId) => {
        if (!privateMessages[userId] || !privateMessages[userId][conectedUserId]) return [];
        return privateMessages[userId][conectedUserId];
    };
    const addPrivateMessage = (message, conectedUserId) => {
        if (!privateMessages[message.userId] || !privateMessages[message.userId][conectedUserId]) {
            privateMessages[message.userId][conectedUserId] = [];
        }
        privateMessages[message.userId][conectedUserId].push(message);

        if (!privateMessages[conectedUserId] || !privateMessages[conectedUserId][message.userId]) {
            privateMessages[conectedUserId][message.userId] = [];
        }
        privateMessages[conectedUserId][message.userId].push(message);
    };

    const registerUser = (user, clientId) => {
        users[user._id] = {
            ...user,
            location: null,
            clientId,
        };
        privateMessages[user._id.toString()] = {};
    };

    const addClient = (clientId, userId) => {
        users[userId].clientId = clientId;
    };

    const removeClient = userId => {
        users[userId].clientId = null;
        users[userId].location = null;
    };

    const getRooms = () => rooms;

    const createRoom = roomName => {
        rooms.push(roomName);
        messages[roomName] = [];
    };

    const showLocation = (userId, location) => {
        users[userId].location = location;
    };

    const hideLocation = userId => {
        users[userId].location = null;
    };

    const updateUserName = async (userId, name) => {
        try {
            const user = await User.findById(userId).exec();
            user.name = name;
            await user.save();
            users[userId].name = name;
        } catch (error) {
            console.log(error);
        }
    };

    const updateUserAvatar = async (userId, avatar) => {
        try {
            const user = await User.findById(userId).exec();
            user.avatar = avatar;
            await user.save();
            users[userId].avatar = avatar;
        } catch (error) {
            console.log(error);
        }
    };

    return {
        initUsersFromDB,
        getUsers,
        getMessages,
        addClient,
        removeClient,
        addMessage,
        showLocation,
        hideLocation,
        createRoom,
        getRooms,
        getUserById,
        getUserWithParams,
        updateUserName,
        updateUserAvatar,
        registerUser,
        getAllMessages,
        getPrivateMessages,
        addPrivateMessage,
    };
};
