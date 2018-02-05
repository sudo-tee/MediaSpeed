import {
    REQUEST_LIBRARIES,
    RECEIVE_LIBRARIES,
    INVALIDATE_LIBRARIES,
    SELECT_LIBRARY,
    REQUEST_LIBRARY_SCAN,
    LIBRARY_SCAN_STARTED,
    LIBRARY_SCAN_ENDED
} from '../actions/librariesActions';

const initialState = {
    isFetching: false,
    didInvalidate: false,
    selectedLibrary: null,
    items: {}
};
export default function librariesReducer(state = initialState, action) {
    let items = {...state.items};

    switch (action.type) {
        case SELECT_LIBRARY:
            return Object.assign({}, state, {
                selectedLibrary: action.uid
            });
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
                items: {...state.items, ...action.libraries},
                lastUpdated: action.receivedAt
            });
        case REQUEST_LIBRARY_SCAN:
            items[action.uid].scanning = false;

            return Object.assign({}, state, {
                items: {...state.items, ...items}
            });
        case LIBRARY_SCAN_STARTED:
            items[action.uid].scanning = true;
            return Object.assign({}, state, {
                items: {...state.items, ...items}
            });
        case LIBRARY_SCAN_ENDED:
            items[action.uid].scanning = false;
            return Object.assign({}, state, {
                didInvalidate: true,
                items: {...state.items, ...items}
            });

        default:
            return state
    }
};
