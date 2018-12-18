import {Actions} from "../../helpers/request";

export function fetchPermissions(event) {
    return async dispatch => {
        dispatch(fetchPermissionsBegin());
        Actions.get(`api/contributors/events/${event}/me`)
            .then((data)=> {
                const permissions = data.map(item => (item._id));
                //const permissions = ['5c192450f33bd450a6022e36']; //ESCARAPELA
                //const permissions = ['5c192400f33bd41b9070cb34']; //STAFF
                //const permissions = ['5c192428f33bd46c102ec974']; //HISTORIAL INVITACIONS
                //const permissions = ['5c09261df33bd415e22dcdb2']; //TIQUETES
                //const permissions = ['5c092604f33bd415490d4892']; //EDICIÒN EVENTOS
                //const permissions = ['5c192408f33bd41b9070cb35']; //AGREGAR ASISTENTE
                //const permissions = ['5c192410f33bd41b9070cb36']; //ENVIAR INVITACIÒN
                //const permissions = ['5c192421f33bd46c102ec973']; //ENVIAR TIQUETE
                dispatch(fetchPermissionsSuccess(permissions));
            })
            .catch((e)=>{
                dispatch(fetchPermissionsFailure(e))
            })
    };
}

export const FETCH_PERMISSIONS_BEGIN     = "FETCH_PERMISSIONS_BEGIN";
export const FETCH_PERMISSIONS_SUCCESS   = "FETCH_PERMISSIONS_SUCCESS";
export const FETCH_PERMISSIONS_FAILURE   = "FETCH_PERMISSIONS_FAILURE";

export const fetchPermissionsBegin = () => ({
    type: FETCH_PERMISSIONS_BEGIN
});

export const fetchPermissionsSuccess = (permissions) => ({
    type: FETCH_PERMISSIONS_SUCCESS,
    payload: permissions
});

export const fetchPermissionsFailure = error => ({
    type: FETCH_PERMISSIONS_FAILURE,
    payload: { error }
});