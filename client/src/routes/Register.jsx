import React, {useState, useContext} from 'react';
import {Redirect, Link} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {observer} from 'mobx-react-lite';
import {UserStore} from '../store';

const defaultForm = {
    name: '',
    email: '',
    password: '',
    password_confirm: '',
};

export const Register = observer(props => {
    const [form, setForm] = useState(defaultForm);
    const userStore = useContext(UserStore);

    const onChangeHandler = e => {
        if (userStore.registerError && userStore.registerError[e.target.name]) {
            userStore.clearError('registerError', e.target.name);
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
        userStore.registerUser(form);
    };

    const getError = name => {
        return userStore.registerError && userStore.registerError[name];
    };

    if (!userStore.fetchedSuccess && !userStore.fetchedFailed) return null;
    if (userStore.user) {
        return <Redirect to="/home" />;
    }

    return (
        <div className="Register custom__root_container container d-flex align-items-center justify-content-center">
            <div className="row w-100">
                <div className="Register__form col-6 mx-auto d-flex flex-column  ">
                    <h4 className="text-center text-primary">Register form</h4>
                    <TextField
                        error={getError('name')}
                        name="name"
                        type="text"
                        label="Name"
                        value={form.name}
                        onChange={onChangeHandler}
                        onKeyUp={onKeyUpHandler}
                        margin="normal"
                        helperText={getError('name')}
                    />
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
                    <TextField
                        error={getError('password_confirm')}
                        name="password_confirm"
                        type="password"
                        label="Confirm password"
                        value={form.password_confirm}
                        onChange={onChangeHandler}
                        onKeyUp={onKeyUpHandler}
                        margin="normal"
                        helperText={getError('password_confirm')}
                    />
                    <Button className="mt-3" variant="contained" color="primary" onClick={submitForm}>
                        Register
                    </Button>
                    <Link className="text-center text-primary my-3" to="/login">
                        Already have account
                    </Link>
                </div>
            </div>
        </div>
    );
});
