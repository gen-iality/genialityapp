import {ADD_LOGIN_INFO} from "./actions";

const initialState = {data:{}};

export default function userReducer(
    state = initialState,
    action
) {
    switch (action.type) {
        case ADD_LOGIN_INFO:
            return {
                ...state,
                data: action.data
            };
        default:
            return state;
    }
}
