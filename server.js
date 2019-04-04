const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
require('dotenv').config();

const clientHandler = require('./socket/clientHandler');
const clientManager = require('./socket/clientManager');

const userController = require('./controllers/user.controller');


const app = express();

app.use(helmet());
app.use(bodyParser.json({limit: '50mb'}))

// Error handling
app.use((error, req, res, next) => {
    console.log(red(err));
    const {statusCode = 500, message} = error;
    return res.status(statusCode).json(message);
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

mongoose.connect(process.env.MONGO_DB_URI, {useNewUrlParser: true})
    .then(() => {
        const server = app.listen(process.env.PORT || 5000);
        console.log(`Server listening on port ${process.env.PORT || 5000}`)

        const io = require('./socket/socket').init(server);
        const manager = clientManager();
        manager.initUsersFromDB()
        io.on('connection', socket => clientHandler(socket, manager))

    })
    .catch(error => console.log(error))