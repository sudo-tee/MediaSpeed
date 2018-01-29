import {SELECT_MENU_ITEM, TOGGLE_MENU} from '../actions/mainMenuActions';

const initialState = {
    visible: true
};

export default function mainMenuReducer(state = initialState, action) {
    switch (action.type) {
        case TOGGLE_MENU:
            return Object.assign({}, state, {
                visible: !state.visible
            });
        default:
            return state
    }
};