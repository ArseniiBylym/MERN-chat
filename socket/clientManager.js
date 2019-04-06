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

    return {
        initUsersFromDB,
        getUsers,
        getClients,
        getMessages,
        addClient,
        removeClient,
        addMessage
    }
}
