import {observable, action, decorate, computed} from 'mobx';
import {socket} from '../api/socket';

export class User {
    user = null;
    fetching = false;
    fetchedSuccess = false;
    fetchedFailed = false;
    loginError = null;
    registerError = null;

    get fetched() {
        return this.fetchedFailed || this.fetchedSuccess;
    }

    getUser = () => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            this.fetchedFailed = true;
            return false;
        }
        this.fetching = true;
        return socket.getUser(token, result => {
            if (result.error) {
                this.fetchedFailed = true;
                this.fetching = false;
                this.user = null;
                localStorage.removeItem('userToken');
                return result.error;
            }
            this.fetching = false;
            this.fetchedSuccess = true;
            this.user = result.user;
            localStorage.setItem('userToken', result.token);
            return result.user;
        });
    };

    registerUser = data => {
        this.fetching = true;
        return socket.register(data, result => {
            if (result.error) {
                this.fetching = false;
                this.fetchedFailed = true;
                if (result.errorType === 'form') {
                    this.registerError = result.errorList;
                    return result.error;
                }
            }
            this.fetching = false;
            this.user = result.user;
            this.fetchedSuccess = true;
            localStorage.setItem('userToken', result.token);
            return result.user;
        });
    };

    loginUser = ({email, password}) => {
        this.fetching = true;
        return socket.login({email, password}, result => {
            console.log(result);
            if (result.error) {
                this.fetching = false;
                this.fetchedFailed = true;
                if (result.errorType === 'form') {
                    this.loginError = result.errorList;
                    return result.error;
                }
            }
            this.fetching = false;
            this.user = result.user;
            this.fetchedSuccess = true;
            localStorage.setItem('userToken', result.token);
            return result.user;
        });
    };

    logoutUser = () => {
        // return socket.logout(this.user, result => {
        //     if (result.error) {
        //         return false;
        //     }
        // });
        this.user = null;
        localStorage.removeItem('userToken');
    };

    clearError = (type, name) => {
        delete this[type][name];
    };
}

decorate(User, {
    user: observable,
    fetching: observable,
    fetchedSuccess: observable,
    fetchedFailed: observable,
    loginError: observable,
    registerError: observable,
    fetched: computed,
    register: action,
});
