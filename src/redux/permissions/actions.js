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