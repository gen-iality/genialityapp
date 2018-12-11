/*c*/
import axios from 'axios';
import {Actions} from "../../helpers/request";

export function fetchRolState() {
    return async dispatch => {
        dispatch(fetchRolStateBegin());
        const rols = Actions.getAll('/api/rols'),
            states = Actions.getAll('/api/states');
        axios.all([rols, states])
            .then(axios.spread(function (rolData, stateData) {
                let roles = rolData.map(rol => ({
                    value: rol._id,
                    label: rol.name
                }));
                let states = stateData.map(state => ({
                    value: state._id,
                    label: state.name
                }));
                dispatch(fetchRolStateSuccess(roles,states));
            }))
            .catch((e)=>{
                dispatch(fetchRolStateFailure(e))
            })
    };
}

export const FETCH_ROLSTATE_BEGIN     = "FETCH_ROLSTATE_BEGIN";
export const FETCH_ROLSTATE_SUCCESS   = "FETCH_ROLSTATE_SUCCESS";
export const FETCH_ROLSTATE_FAILURE   = "FETCH_ROLSTATE_FAILURE";

export const fetchRolStateBegin = () => ({
    type: FETCH_ROLSTATE_BEGIN
});

export const fetchRolStateSuccess = (roles,states) => ({
    type: FETCH_ROLSTATE_SUCCESS,
    payload: { roles,states }
});

export const fetchRolStateFailure = error => ({
    type: FETCH_ROLSTATE_FAILURE,
    payload: { error }
});