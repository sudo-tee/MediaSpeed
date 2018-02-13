import {REQUEST_MOVIES, RECEIVE_MOVIES, INVALIDATE_MOVIES} from '../actions/moviesActions';
import {INVALIDATE_LIBRARIES} from '../actions/librariesActions';

const initialState = {
    isFetching: false,
    didInvalidate: false,
    items: {}
};

export default function moviesReducer(state = initialState, action) {
    switch (action.type) {
        case INVALIDATE_MOVIES:
        case INVALIDATE_LIBRARIES:
            return {...state, ...{
                didInvalidate: true
            }};
        case REQUEST_MOVIES:
            return {...state, ...{
                isFetching: true,
                didInvalidate: false
            }};
        case RECEIVE_MOVIES:
            return {...state, ...{
                isFetching: false,
                didInvalidate: false,
                items:  {...state.items, ...action.movies},
                lastUpdated: action.receivedAt
            }};
        default:
            return state
    }
};
