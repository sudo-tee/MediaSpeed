import {
    REQUEST_FOLDER_LIST,
    RECEIVE_FOLDER_LIST,
    SELECT_CURRENT_FOLDER
} from '../actions/fileSystemActions';

const initialState = {
    isFetching: false,
    selectedFolder: null,
    folders: []
};
export default function fileSystemReducer(state = initialState, action) {
    switch (action.type) {

        case SELECT_CURRENT_FOLDER:
            return {...state, ...{
                selectedFolder: action.path,
            }};
        case REQUEST_FOLDER_LIST:
            return {...state, ...{
                isFetching: true,
            }};
        case RECEIVE_FOLDER_LIST:
            return {...state, ...{
                isFetching: false,
                folders: [...action.folders],
            }};
        default:
            return state
    }
};
