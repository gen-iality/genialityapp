import {
    FETCH_STATE_BEGIN,
    FETCH_STATE_SUCCESS,
    FETCH_STATE_FAILURE
} from "./actions";

const initialState = {
    items: {},
    loading: false,
    error: null
};

export default function statesReducer(
    state = initialState,
    action
) {
    switch (action.type) {
        case FETCH_STATE_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case FETCH_STATE_SUCCESS:
            return {
                ...state,
                loading: false,
                items: action.payload
            };

        case FETCH_STATE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                items: {}
            };

        default:
            return state;
    }
}
