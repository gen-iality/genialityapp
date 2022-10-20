import { Actions } from "../../helpers/request";
import { GetTokenUserFirebase } from "../../helpers/HelperAuth";

export function fetchRol() {
    return async dispatch => {
        const token = await GetTokenUserFirebase();
        dispatch(fetchRolBegin());
        Actions.getAll('/api/contributors/metadata/roles?token=' + token)
            .then((rolData) => {
                const roles = rolData.map(state => ({
                    value: state._id,
                    label: state.name
                }));
                dispatch(fetchRolSuccess(roles));
            })
            .catch((e) => {
                dispatch(fetchRolFailure(e))
            })
    };
}

export const FETCH_ROL_BEGIN = "FETCH_ROL_BEGIN";
export const FETCH_ROL_SUCCESS = "FETCH_ROL_SUCCESS";
export const FETCH_ROL_FAILURE = "FETCH_ROL_FAILURE";

export const fetchRolBegin = () => ({
    type: FETCH_ROL_BEGIN
});

export const fetchRolSuccess = (roles) => ({
    type: FETCH_ROL_SUCCESS,
    payload: roles
});

export const fetchRolFailure = error => ({
    type: FETCH_ROL_FAILURE,
    payload: { error }
});