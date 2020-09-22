import {TypesApi} from "../../helpers/request";

export function fetchTypes() {
    return async dispatch => {
        dispatch(fetchTypesBegin());
        try {
            const types = await TypesApi.getAll();
            dispatch(fetchTypesSuccess(types));
        }catch (e) {
            dispatch(fetchTypesFailure(e))

        }
    };
}

export const FETCH_TYPES_BEGIN     = "FETCH_TYPES_BEGIN";
export const FETCH_TYPES_SUCCESS   = "FETCH_TYPES_SUCCESS";
export const FETCH_TYPES_FAILURE   = "FETCH_TYPES_FAILURE";

export const fetchTypesBegin = () => ({
    type: FETCH_TYPES_BEGIN
});

export const fetchTypesSuccess = types => ({
    type: FETCH_TYPES_SUCCESS,
    payload: { types }
});

export const fetchTypesFailure = error => ({
    type: FETCH_TYPES_FAILURE,
    payload: { error }
});