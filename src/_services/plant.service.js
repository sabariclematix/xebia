import config from 'config';
import { authHeader } from '../_helpers';

export const plantService = {
    getPlants
};
let controller;
let signal;
function getPlants(plant) {
    if (controller !== undefined) {
        // Cancel the previous request
        controller.abort();
    }
    if ("AbortController" in window) {
        controller = new AbortController;
        signal = controller.signal;
    }
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
        signal
    };

    return fetch(`${config.apiUrl}planets/?search=${plant}`,requestOptions)
        .then(handleResponseData)
        .then(plants => {
            return plants.results;
        });
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