import {
    REQUEST_LIBRARIES,
    RECEIVE_LIBRARIES,
    INVALIDATE_LIBRARIES,
    SELECT_LIBRARY,
    REQUEST_LIBRARY_SCAN,
    LIBRARY_SCAN_STARTED,
    LIBRARY_SCAN_ENDED,
    LIBRARY_SCAN_STATUS_UPDATED,
    UPDATED_LIBRARY_STARTED,
    UPDATED_LIBRARY_ENDED
} from '../actions/librariesActions';
import {update} from '../helpers/immutability'

const initialState = {
    isFetching: false,
    didInvalidate: false,
    selectedLibrary: null,
    items: {},
};



export default function librariesReducer(state = initialState, action) {

    switch (action.type) {
        case SELECT_LIBRARY:
            return {...state, ...{
                selectedLibrary: action.uid
            }};
        case INVALIDATE_LIBRARIES:
            return {...state, ...{
                didInvalidate: true
            }};
        case REQUEST_LIBRARIES:
            return {...state, ...{
                isFetching: true,
                didInvalidate: false
            }};
        case RECEIVE_LIBRARIES:
            return {...state, ...{
                isFetching: false,
                didInvalidate: false,
                items: {...state.items, ...action.libraries},
                lastUpdated: action.receivedAt
            }};
        case REQUEST_LIBRARY_SCAN:
            return update(state, {uid:action.uid, scanning: false});
        case LIBRARY_SCAN_STARTED:
            return update(state, {uid:action.uid, scanning: true, scanning_progress:0});
        case LIBRARY_SCAN_ENDED:
            return update(state, {uid:action.uid, scanning: false, scanning_progress:0});
        case UPDATED_LIBRARY_STARTED:
        case UPDATED_LIBRARY_ENDED:
        case LIBRARY_SCAN_STATUS_UPDATED:
            return update(state, action.library);

        default:
            return state
    }
};