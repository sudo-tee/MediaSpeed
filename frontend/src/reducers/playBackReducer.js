import {START_SESSION, STOP_SESSION} from '../actions/playBackActions';

const initialState = {
    session: null
};

export default function plabackReducer(state = initialState, action) {
    switch (action.type) {
        case START_SESSION:
            return {...state, ...{
                session: action.session
            }};
        case STOP_SESSION:
            return {...state, ...{
                session: null
            }};
        default:
            return state
    }
};