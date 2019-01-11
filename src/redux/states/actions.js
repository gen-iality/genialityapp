import {Actions} from "../../helpers/request";

export function fetchState() {
    return async dispatch => {
        dispatch(fetchStateBegin());
        Actions.getAll('/api/states')
            .then((stateData)=> {
                let states = stateData.map(state => ({
                    value: state._id,
                    label: state.name
                }));
                dispatch(fetchStateSuccess(states));
            })
            .catch((e)=>{
                dispatch(fetchStateFailure(e))
            })
    };
}

export const FETCH_STATE_BEGIN     = "FETCH_STATE_BEGIN";
export const FETCH_STATE_SUCCESS   = "FETCH_STATE_SUCCESS";
export const FETCH_STATE_FAILURE   = "FETCH_STATE_FAILURE";

export const fetchStateBegin = () => ({
    type: FETCH_STATE_BEGIN
});

export const fetchStateSuccess = (states) => ({
    type: FETCH_STATE_SUCCESS,
    payload: states
});

export const fetchStateFailure = error => ({
    type: FETCH_STATE_FAILURE,
    payload: { error }
});