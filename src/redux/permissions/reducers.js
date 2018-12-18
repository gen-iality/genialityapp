import {
    FETCH_PERMISSIONS_BEGIN,
    FETCH_PERMISSIONS_SUCCESS,
    FETCH_PERMISSIONS_FAILURE
} from "./actions";

const initialState = {
    items: [],
    loading: true,
    error: null
};

export default function permissionsReducer(
    state = initialState,
    action
) {
    switch (action.type) {
        case FETCH_PERMISSIONS_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case FETCH_PERMISSIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                items: action.payload
            };

        case FETCH_PERMISSIONS_FAILURE:
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
