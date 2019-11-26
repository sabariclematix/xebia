import { plantConstants } from '../_constants';
import { plantService } from '../_services';
import { alertActions } from './';


export const plantActions = {
    getPlants,
    clearPlants,
    resetSearchCount
};

function getPlants(plants) {
    return dispatch => {
        dispatch(loading());
        plantService.getPlants(plants)
            .then(
                plant => {
                    if (plants == "") {
                        dispatch(storePlants([]));
                    } else {
                        dispatch(storePlants(plant));
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );

    };

    function storePlants(plant) { return { type: plantConstants.GETPLANTSEARCHLIST, plant }; }
    function loading() { return { type: plantConstants.LOADING } }
    function failure(error) { return { type: plantConstants.GETPLANT_FAILURE, error } }
}

function clearPlants() {
    return dispatch => {
        dispatch({ type: plantConstants.CLEAR })
    }
}

function resetSearchCount() {
    return dispatch => {
        dispatch({ type: plantConstants.RESET })
    }
}