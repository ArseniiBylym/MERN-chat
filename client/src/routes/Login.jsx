import React, {useEffect, useState, useContext} from 'react';
import GoogleLogin from 'react-google-login';
import {Redirect, Link} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {observer} from 'mobx-react-lite';
import {UserStore} from '../store';

const defaultForm = {
    email: '',
    password: '',
};

export const Login = observer(props => {
    const [form, setForm] = useState(defaultForm);
    const userStore = useContext(UserStore);

    const onChangeHandler = e => {
        if (userStore.loginError && userStore.loginError[e.target.name]) {
            userStore.clearError('loginError', e.target.name);
        }
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const onKeyUpHandler = e => {
        if (e.keyCode === 13) {
            submitForm();
            return false;
        }
    };

    const submitForm = () => {
        userStore.loginUser(form);
    };

    const getError = name => {
        return userStore.loginError && userStore.loginError[name];
    };

    const googleLoginHandler = response => {
        const {email, googleId} = response.profileObj;
        const loginData = {
            email,
            googleId,
        };
        userStore.loginUser(loginData);
    };

    if (!userStore.fetchedSuccess && !userStore.fetchedFailed) return null;
    if (userStore.user) {
        return <Redirect to="/home" />;
    }
    return (
        <div className="Register custom__root_container container d-flex align-items-center justify-content-center">
            <div className="row w-100">
                <div className="Register__form col-6 mx-auto d-flex flex-column  ">
                    <h4 className="text-center text-primary">Login form</h4>
                    <div className="my-4 align-self-center">
                        <GoogleLogin
                            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                            onSuccess={googleLoginHandler}
                            onFailure={googleLoginHandler}
                            buttonText="Login with Google"
                        />
                    </div>
                    <TextField
                        error={getError('email')}
                        name="email"
                        type="email"
                        label="Email"
                        value={form.email}
                        onChange={onChangeHandler}
                        onKeyUp={onKeyUpHandler}
                        margin="normal"
                        helperText={getError('email')}
                    />
                    <TextField
                        error={getError('password')}
                        name="password"
                        type="password"
                        label="Password"
                        value={form.password}
                        onChange={onChangeHandler}
                        onKeyUp={onKeyUpHandler}
                        margin="normal"
                        helperText={getError('password')}
                    />
                    <Button className="mt-3" variant="contained" color="primary" onClick={submitForm}>
                        Login
                    </Button>
                    <Link className="text-center text-primary my-3" to="/register">
                        Create new account
                    </Link>
                </div>
            </div>
        </div>
    );
});
