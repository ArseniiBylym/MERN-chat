import React, {useEffect, useContext} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {Home, Login, Register} from './routes';
import {UserStore} from './store';

const App = props => {
    const userStore = useContext(UserStore);
    useEffect(() => {
        userStore.getUser();
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
