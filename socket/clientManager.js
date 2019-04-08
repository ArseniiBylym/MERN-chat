const User = require('../models/User.model');

module.exports = clientManager = () => {
    let users = [];
    let clients = [];
    const messages = [];

    const initUsersFromDB = async () => {
        const result = await User.find().select('-password -__v').exec();
        if(result) {
            users = result.map(item => {
                return {...item.toObject(), location: null};
            });
        }
    }

    const getUsers = () => users
    const getClients = () => clients;
    const getMessages = () => messages;

    const addClient = (clientId, userId) => {
        const conectedClient = clients.find(item => item.userId === userId);
        if (conectedClient) {
            conectedClient.clientId = clientId;
        } else {
            clients.push({clientId, userId})
        }
    }

    const removeClient = (userId) => {
        clients = clients.filter(item => item.userId !== userId);
    }

    const addMessage = data => {
        messages.push(data)
    }

    showLocation = (userId, location) => {
        let currentUser = users.find(item => item._id.toString() === userId);
        if (currentUser) {
            currentUser.location = location;
        }
    }

    hideLocation = userId => {
        const currentUser = users.find(item => item._id.toString() === userId);
        if (currentUser) {
            currentUser.location = null;
        }
    }

    updateProfile = async (userId, data) => {
        try {
            let user = await User.findById(userId).exec();
            let currentUser = users.find(item => item._id.toString() === userId);
            console.log(user)
            for (let key in data) {
                user[key] = data[key];
                currentUser[key] = data[key];
            }
            user.save();
        } catch (error) {
            console.log(error);
        }

    }

    return {
        initUsersFromDB,
        getUsers,
        getClients,
        getMessages,
        addClient,
        removeClient,
        addMessage,
        showLocation,
        hideLocation,
        updateProfile
    }
}
