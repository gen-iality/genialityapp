import {Actions} from "../../helpers/request";

export function fetchRol() {
    return async dispatch => {
        dispatch(fetchRolBegin());
        Actions.getAll('/api/permissions/roles')
            .then((rolData)=> {
                let states = rolData.map(state => ({
                    value: state._id,
                    label: state.name
                }));
                dispatch(fetchRolSuccess(states));
            })
            .catch((e)=>{
                dispatch(fetchRolFailure(e))
            })
    };
}

export const FETCH_ROL_BEGIN     = "FETCH_ROL_BEGIN";
export const FETCH_ROL_SUCCESS   = "FETCH_ROL_SUCCESS";
export const FETCH_ROL_FAILURE   = "FETCH_ROL_FAILURE";

export const fetchRolBegin = () => ({
    type: FETCH_ROL_BEGIN
});

export const fetchRolSuccess = (states) => ({
    type: FETCH_ROL_SUCCESS,
    payload: states
});

export const fetchRolFailure = error => ({
    type: FETCH_ROL_FAILURE,
    payload: { error }
});