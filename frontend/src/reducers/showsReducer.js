import {REQUEST_SHOWS, RECEIVE_SHOWS, INVALIDATE_SHOWS} from '../actions/showsActions';

const initialState = {
    isFetching: false,
    didInvalidate: false,
    items: {}
};

export default function showsReducer(state = initialState, action) {
    switch (action.type) {
        case INVALIDATE_SHOWS:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case REQUEST_SHOWS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_SHOWS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                items:  {...state.items, ...action.shows},
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
};
