import {
    FETCH_ROL_BEGIN,
    FETCH_ROL_SUCCESS,
    FETCH_ROL_FAILURE
} from "./actions";

const initialState = {
    items: [],
    loading: false,
    error: null
};

export default function rolesReducer(
    state = initialState,
    action
) {
    switch (action.type) {
        case FETCH_ROL_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case FETCH_ROL_SUCCESS:
            return {
                ...state,
                loading: false,
                items: action.payload
            };

        case FETCH_ROL_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                items: []
            };

        default:
            return state;
    }
}
