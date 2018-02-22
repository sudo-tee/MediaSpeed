import {keyBy, isEmpty} from 'lodash'

export const REQUEST_LIBRARIES = 'REQUEST_LIBRARIES';
export const RECEIVE_LIBRARIES = 'RECEIVE_LIBRARIES';
export const INVALIDATE_LIBRARIES = 'INVALIDATE_LIBRARIES';
export const REQUEST_LIBRARY_SCAN = 'REQUEST_LIBRARY_SCAN';
export const LIBRARY_SCAN_STARTED = 'LIBRARY_SCAN_STARTED';
export const LIBRARY_SCAN_ENDED = 'LIBRARY_SCAN_ENDED';
export const LIBRARY_SCAN_STATUS_UPDATED = 'LIBRARY_SCAN_STATUS_UPDATED';
export const UPDATE_LIBRARY_STARTED = 'UPDATE_LIBRARY_STARTED';
export const UPDATE_LIBRARY_ENDED = 'UPDATE_LIBRARY_ENDED';
export const UPDATE_LIBRARY_FAILED = 'UPDATE_LIBRARY_FAILED';
export const CREATE_LIBRARY_STARTED = 'CREATE_LIBRARY_STARTED';
export const CREATE_LIBRARY_ENDED = 'CREATE_LIBRARY_ENDED';
export const CREATE_LIBRARY_FAILED = 'CREATE_LIBRARY_FAILED';
export const DELETE_LIBRARY_STARTED = 'DELETE_LIBRARY_STARTED';
export const DELETE_LIBRARY_ENDED = 'DELETE_LIBRARY_ENDED';
export const DELETE_LIBRARY_FAILED = 'DELETE_LIBRARY_FAILED';


function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

export function requestLibraries() {
    return {
        type: REQUEST_LIBRARIES
    }
}

export function receiveLibraries(libraries) {
    return {
        type: RECEIVE_LIBRARIES,
        libraries: keyBy(libraries, 'uid'),
        receivedAt: Date.now()
    }
}

export function invalidateLibraries() {
    return {
        type: INVALIDATE_LIBRARIES
    }
}

export function requestLibraryScan(uid) {
    return {
        type: REQUEST_LIBRARY_SCAN,
        uid
    }
}

export function libraryScanStarted(uid) {
    return {
        type: LIBRARY_SCAN_STARTED,
        uid
    }
}

export function libraryScanEnded(uid) {
    return {
        type: LIBRARY_SCAN_ENDED,
        uid
    }
}

export function libraryScanStatusUpdated(library) {
    return {
        type: LIBRARY_SCAN_STATUS_UPDATED,
        library
    }
}

export function checkScanStatus(uid) {
    let handle;
    return function (dispatch) {
        return fetch('/api/libraries/' + uid)
            .then(
                response => response.json(),
                error => console.log('An error occurred.', error)
            )
            .then(json => {
                    if (json.scanning === false) {
                        clearTimeout(handle);
                        return dispatch(libraryScanEnded(uid))
                    } else {
                        dispatch(libraryScanStatusUpdated(json));
                        handle = setTimeout(() => dispatch(checkScanStatus(uid)), 2000)
                    }
                }
            )
    }
}


export function startLibraryScan(uid) {

    return function (dispatch) {

        dispatch(requestLibraryScan(uid));

        return fetch('/api/libraries/' + uid + "/scan", {method: 'POST'})
            .then(
                response => response.json(),
                error => console.log('An error occurred.', error)
            )
            .then(json => {
                    setTimeout(() => dispatch(checkScanStatus(uid)), 2000);
                    return dispatch(libraryScanStarted(uid))
                }
            )
    }
}

export function updateLibrary(library, properties) {
    return function (dispatch) {
        const updatedLibrary =  {...library, ...properties};
        dispatch(updateLibraryStarted(updatedLibrary));

        return fetch('/api/libraries/' + library.uid, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedLibrary)
        })
            .then(handleErrors)
            .then(response => response.json())
            .then(json => dispatch(updateLibraryEnded(json)))
            .catch(error => dispatch(updateLibraryFailed(error)));
    }
}

export function updateLibraryStarted(library) {
    return {
        type: UPDATE_LIBRARY_STARTED,
        library
    }
}

export function updateLibraryEnded(library) {
    return function (dispatch) {
        dispatch(invalidateLibraries());
        return dispatch({
            type: UPDATE_LIBRARY_ENDED,
            library
        })
    }

}

export function updateLibraryFailed(library) {
    return {
        type: UPDATE_LIBRARY_FAILED,
        library
    }
}

export function createLibrary(library, properties) {
    return function (dispatch) {
        const updatedLibrary =  {...library, ...properties};
        dispatch(createLibraryStarted(updatedLibrary));

        return fetch('/api/libraries', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedLibrary)
        })
            .then(handleErrors)
            .then(response => response.json())
            .then(json => dispatch(createLibraryEnded(json)))
            .catch(error => dispatch(createLibraryFailed(error)));
    }
}

export function createLibraryStarted(library) {
    return {
        type: CREATE_LIBRARY_STARTED,
        library
    }
}

export function createLibraryEnded(library) {
    return function (dispatch) {
        dispatch(invalidateLibraries());
        return dispatch({
            type: CREATE_LIBRARY_ENDED,
            library
        })
    }

}

export function createLibraryFailed(library) {
    return {
        type: CREATE_LIBRARY_FAILED,
        library
    }
}

export function deleteLibrary(library, properties) {
    return function (dispatch) {
        const updatedLibrary =  {...library, ...properties};
        dispatch(deleteLibraryStarted(updatedLibrary));

        return fetch('/api/libraries/' + library.uid, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        })
            .then(handleErrors)
            .then(response => response.text())
            .then(text => dispatch(deleteLibraryEnded(library)))
            .catch(error => dispatch(deleteLibraryFailed(error)));
    }
}

export function deleteLibraryStarted(library) {
    return {
        type: DELETE_LIBRARY_STARTED,
        library
    }
}

export function deleteLibraryEnded(library) {
    return function (dispatch) {
        dispatch(invalidateLibraries());
        return dispatch({
            type: DELETE_LIBRARY_ENDED,
            library
        })
    }

}

export function deleteLibraryFailed(library) {
    return {
        type: DELETE_LIBRARY_FAILED,
        library
    }
}


export function fetchLibraries() {

    return function (dispatch) {

        dispatch(requestLibraries());

        return fetch('/api/libraries')
            .then(
                response => response.json(),
                error => console.log('An error occurred.', error)
            )
            .then(json =>
                dispatch(receiveLibraries(json))
            )
    }
}

export function shouldFetchLibraries(state) {
    const libraries = state.libraries;

    if (libraries.isFetching) {
        return false
    } else if (isEmpty(libraries.items)) {
        return true
    } else {
        return libraries.didInvalidate
    }
}

export function fetchLibrariesIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchLibraries(getState())) {
            // Dispatch a thunk from thunk!
            return dispatch(fetchLibraries())
        } else {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve()
        }
    }
}