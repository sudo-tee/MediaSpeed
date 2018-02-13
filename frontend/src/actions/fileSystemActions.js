export const REQUEST_FOLDER_LIST = 'REQUEST_FOLDER_LIST';
export const RECEIVE_FOLDER_LIST = 'RECEIVE_FOLDER_LIST';
export const SELECT_CURRENT_FOLDER = 'SELECT_CURRENT_FOLDER';

export function requestFolderList(path) {
    return {
        type: REQUEST_FOLDER_LIST,
        path
    }
}

export function receiveFolderList(path, folders) {
    return {
        type: RECEIVE_FOLDER_LIST,
        path,
        folders
    }
}

export function fetchFolderList(path) {

    return function (dispatch) {

        dispatch(requestFolderList(path));

        return fetch(`/api/folders?path=${encodeURIComponent(path)}`)
            .then(
                response => response.json(),
                error => console.log('An error occurred.', error)
            )
            .then(json =>
                dispatch(receiveFolderList(path, json))
            )
    }
}

export function navigateToFolder(path) {
    return function (dispatch) {
        dispatch(fetchFolderList(path));
        dispatch({
            type: SELECT_CURRENT_FOLDER,
            path,
        })
    }

}

