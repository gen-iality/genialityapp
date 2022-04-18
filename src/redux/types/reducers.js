import {
    FETCH_TYPES_BEGIN,
    FETCH_TYPES_SUCCESS,
    FETCH_TYPES_FAILURE
} from "./actions";

const initialState = {
    items: [],
    loading: false,
    error: null
};

export default function typesReducer(
    state = initialState,
    action
) {
    switch (action.type) {
        case FETCH_TYPES_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case FETCH_TYPES_SUCCESS:
            return {
                ...state,
                loading: false,
                items: action.payload.types
            };

        case FETCH_TYPES_FAILURE:
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
