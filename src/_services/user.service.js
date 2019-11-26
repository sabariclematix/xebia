import config from 'config';
import { authHeader } from '../_helpers';

export const userService = {
    login,
    logout
};

function login(username, password) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}people/?search=${username}`,requestOptions)
        .then(handleResponseData)
        .then(user => {
            if(user.count!=0){
                let users = user.results;
                let returnFilter = Object.keys(users).filter((value,index)=>{
                    return (users[value]['name'] == username && users[value]['birth_year'] == password)
                })
                if(returnFilter && returnFilter[0] ){
                    localStorage.setItem('user', JSON.stringify(users[0]));
                    return users[0];
                }
            }
            
            return Promise.reject('Username & password wrong');
        });
}

function logout() {
    localStorage.removeItem('user');
        // remove user from local storage to log user out
}

function handleResponseData(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}