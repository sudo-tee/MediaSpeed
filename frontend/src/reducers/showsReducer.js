import {REQUEST_SHOWS, RECEIVE_SHOWS, INVALIDATE_SHOWS} from '../actions/showsActions';
import {INVALIDATE_LIBRARIES} from '../actions/librariesActions';


const initialState = {
    isFetching: false,
    didInvalidate: false,
    items: {}
};

export default function showsReducer(state = initialState, action) {
    switch (action.type) {
        case INVALIDATE_SHOWS:
        case INVALIDATE_LIBRARIES:
            return {...state, ...{
                didInvalidate: true
            }};
        case REQUEST_SHOWS:
            return {...state, ...{
                isFetching: true,
                didInvalidate: false
            }};
        case RECEIVE_SHOWS:
            return {...state, ...{
                isFetching: false,
                didInvalidate: false,
                items:  {...state.items, ...action.shows},
                lastUpdated: action.receivedAt
            }};
        default:
            return state
    }
};
