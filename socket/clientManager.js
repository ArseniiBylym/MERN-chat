const User = require('../models/User.model');

module.exports = clientManager = () => {
    let users = [];
    let clients = [];
    const messages = [];

    const initUsersFromDB = async () => {
        const result = await User.find().select('-password -__v').exec();
        if(result) users = result;
    }

    const getUsers = () => users

    const getClients = () => clients;

    const addClient = (clientId, userId) => {
        const conectedClient = clients.find(item => item.userId === userId);
        if (conectedClient) {
            conectedClient.clientId = clientId;
        } else {
            clients.push({clientId, userId})
        }
    }

    const removeClient = (clientId) => {
        clients = clients.filter(item => item.clientId !== clientId);
    }

    const addMessage = data => {
        messages.push(data)
    }

    return {
        initUsersFromDB,
        getUsers,
        getClients,
        addClient,
        removeClient,
        addMessage
    }
}
