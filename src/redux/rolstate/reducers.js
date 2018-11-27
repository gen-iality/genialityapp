import {
    FETCH_ROLSTATE_BEGIN,
    FETCH_ROLSTATE_SUCCESS,
    FETCH_ROLSTATE_FAILURE
} from "./actions";

const initialState = {
    items: {},
    loading: false,
    error: null
};

export default function categoriesReducer(
    state = initialState,
    action
) {
    switch (action.type) {
        case FETCH_ROLSTATE_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case FETCH_ROLSTATE_SUCCESS:
            return {
                ...state,
                loading: false,
                items: action.payload
            };

        case FETCH_ROLSTATE_FAILURE:
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
