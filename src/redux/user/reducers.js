import {ADD_LOGIN_INFO, SHOW_MENU} from "./actions";

const initialState = {data:{},menu:true};

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
        case SHOW_MENU:
            return {
                ...state,
                menu: !state.menu
            };
        default:
            return state;
    }
}
