import {MEDIA_SELECTED} from '../actions/routerAction';

const initialState = {library: null,
    movie: null,
    show: null,
    season: null,
    episode: null};

export default function mediaSelectionReducer(state = initialState, action) {
    switch (action.type) {
        case MEDIA_SELECTED:
            return {...state, ...action.selected};
        default:
            return state
    }
};
