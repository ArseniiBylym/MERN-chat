const User = require('../models/User.model');

module.exports = clientManager = () => {
    let users = [];
    const clients = new Map();

    const initUsersFromDB = async () => {
        const result = await User.find().select('-password -__v').exec();
        if(result) users = result;
    }

    const getUsers = () => users

    const getClients = () => clients;

    const addClient = (clientId, user) => {
        clients.set(clientId, user)
    }

    const removeClient = (clientId) => {
        clients.delete(clientId);
    }

    return {
        initUsersFromDB,
        getUsers,
        getClients,
        addClient,
        removeClient,
    }
}
