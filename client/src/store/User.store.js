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
                return;
            }
            this.fetching = false;
            this.fetchedSuccess = true;
            this.user = result.user;
            localStorage.setItem('userToken', result.token);
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
            this.fetchedSuccess = true;
            this.user = result.user;
            localStorage.setItem('userToken', result.token);
            return result.user;
        });
    };

    loginUser = ({email, password}) => {
        this.fetching = true;
        return socket.login({email, password}, result => {
            if (result.error) {
                this.fetching = false;
                this.fetchedFailed = true;
                if (result.errorType === 'form') {
                    this.loginError = result.errorList;
                    return result.error;
                }
            }
            this.fetching = false;
            this.fetchedSuccess = true;
            this.user = result.user;
            localStorage.setItem('userToken', result.token);
            return result.user;
        });
    };

    logoutUser = () => {
        socket.logout(this.user._id);
        this.user = null;
        localStorage.removeItem('userToken');
    };

    leaveUser = async () => {
        socket.logout(this.user._id);
    };

    clearError = (type, name) => {
        delete this[type][name];
    };

    updateUserName = name => {
        socket.updateUserName(this.user._id, name);
        this.user.name = name;
    };

    updateUserAvatar = avatar => {
        socket.updateUserAvatar(this.user._id, avatar);
        this.user.avatar = avatar;
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
    leaveUser: action,
    updateUserName: action,
    updateUserAvatar: action,
});
