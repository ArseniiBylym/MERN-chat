import React, {useEffect, useContext} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {Home, Login, Register} from './routes';
import {UserStore, ChatStore} from './store';
import {socket} from './api/socket';

const App = props => {
    const userStore = useContext(UserStore);
    const chatStore = useContext(ChatStore);
    useEffect(() => {
        userStore.getUser(); // get all users list
        socket.initHandlers(userStore, chatStore); // init handlers for all incoming sockets
    }, []);

    return (
        <div className="App">
            <BrowserRouter>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route path="/" component={Home} />
                </Switch>
            </BrowserRouter>
        </div>
    );
};

export default App;
