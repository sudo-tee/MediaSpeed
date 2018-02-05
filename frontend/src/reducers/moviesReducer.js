import {REQUEST_MOVIES, RECEIVE_MOVIES, INVALIDATE_MOVIES} from '../actions/moviesActions';

const initialState = {
    isFetching: false,
    didInvalidate: false,
    items: {}
};

export default function moviesReducer(state = initialState, action) {
    switch (action.type) {
        case INVALIDATE_MOVIES:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case REQUEST_MOVIES:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_MOVIES:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                items:  {...state.items, ...action.movies},
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
};
