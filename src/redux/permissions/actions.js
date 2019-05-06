import {Actions} from "../../helpers/request";

export function fetchPermissions(event) {
    return async dispatch => {
        //const permissions = [rolPermissions.admin_badge]; //ESCARAPELA
        //const permissions = [rolPermissions.admin_staff]; //STAFF
        //const permissions = [rolPermissions.history_invitations]; //HISTORIAL INVITACIONS
        //const permissions = [rolPermissions.admin_invitations]; //ADMINISTRAR INVITACIÓN
        //const permissions = [rolPermissions.admin_ticket]; //TIQUETES
        //const permissions = [rolPermissions.add_attendees]; //AGREGAR ASISTENTE
        //dispatch(fetchPermissionsSuccess(permissions));
        dispatch(fetchPermissionsBegin());
        Actions.get(`api/contributors/events/${event}/me`)
            .then((data)=> {
                const permissions = data.map(item => (item._id));
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