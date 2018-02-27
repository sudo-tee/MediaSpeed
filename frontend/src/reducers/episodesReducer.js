import {REQUEST_EPISODES, RECEIVE_EPISODES, INVALIDATE_EPISODES} from '../actions/episodesActions';
import {INVALIDATE_LIBRARIES} from '../actions/librariesActions';


const initialState = {
    isFetching: false,
    didInvalidate: false,
    items: {},
    bySeasonUid: {}
};

export default function episodesReducer(state = initialState, action) {
    switch (action.type) {
        case INVALIDATE_EPISODES:
        case INVALIDATE_LIBRARIES:
            return {...state, ...{
                didInvalidate: true
            }};
        case REQUEST_EPISODES:
            return {...state, ...{
                isFetching: true,
                didInvalidate: false
            }};
        case RECEIVE_EPISODES:
            return {...state, ...{
                isFetching: false,
                didInvalidate: false,
                items:  {...state.items, ...action.episodes},
                bySeasonUid: {
                    ...state.bySeasonUid,
                    ...action.bySeasonUid
                },
                lastUpdated: action.receivedAt
            }};
        default:
            return state
    }
};
