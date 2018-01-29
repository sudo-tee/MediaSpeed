import {REQUEST_LIBRARIES, RECEIVE_LIBRARIES, INVALIDATE_LIBRARIES} from '../actions/librariesActions';

const initialState = {
    isFetching: false,
    didInvalidate: false,
    items: []
};

export default function librariesReducer(state = initialState, action) {
    switch (action.type) {
        case INVALIDATE_LIBRARIES:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case REQUEST_LIBRARIES:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_LIBRARIES:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                items: action.libraries,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
};