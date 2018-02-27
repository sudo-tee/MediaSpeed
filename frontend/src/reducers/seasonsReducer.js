import {REQUEST_SEASONS, RECEIVE_SEASONS, RECEIVE_SEASON, INVALIDATE_SEASONS} from '../actions/seasonsActions';
import {INVALIDATE_LIBRARIES} from '../actions/librariesActions';


const initialState = {
    isFetching: false,
    didInvalidate: false,
    items: {},
    byShowUid: {}
};

export default function seasonsReducer(state = initialState, action) {
    switch (action.type) {
        case INVALIDATE_SEASONS:
        case INVALIDATE_LIBRARIES:
            return {
                ...state, ...{
                    didInvalidate: true
                }
            };
        case REQUEST_SEASONS:
            return {
                ...state, ...{
                    isFetching: true,
                    didInvalidate: false
                }
            };
        case RECEIVE_SEASONS:
            return {
                ...state, ...{
                    isFetching: false,
                    didInvalidate: false,
                    items: {...state.items, ...action.seasons},
                    byShowUid: {
                        ...state.byShowUid,
                        ...{[action.show.uid]: Object.keys(action.seasons)}
                    },
                    lastUpdated: action.receivedAt
                }
            };
        case RECEIVE_SEASON:
            return {
                ...state, ...{
                    isFetching: false,
                    didInvalidate: false,
                    items: {...state.items, ...{[action.season.uid]: action.season}},
                    byShowUid: {
                        ...state.byShowUid,
                        ... {[action.season.show_uid]: [...(state.byShowUid[action.season.show_uid] || []), [action.season.uid]]}
                    },
                    lastUpdated: action.receivedAt
                }
            };
        default:
            return state
    }
};
