import {keyBy, isEmpty} from 'lodash'

export const REQUEST_LIBRARIES = 'REQUEST_LIBRARIES';
export const RECEIVE_LIBRARIES = 'RECEIVE_LIBRARIES';
export const INVALIDATE_LIBRARIES = 'INVALIDATE_LIBRARIES';
export const SELECT_LIBRARY = 'SELECT_LIBRARY';
export const REQUEST_LIBRARY_SCAN = 'REQUEST_LIBRARY_SCAN';
export const LIBRARY_SCAN_STARTED = 'LIBRARY_SCAN_STARTED';
export const LIBRARY_SCAN_ENDED = 'LIBRARY_SCAN_ENDED';
export const CHECK_SCAN_STATUS = 'CHECK_SCAN_STATUS';

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

export function selectLibrary(uid) {
    return {
        type: SELECT_LIBRARY,
        uid
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
                        handle = setTimeout(() => dispatch(checkScanStatus(uid)), 2000)
                    }
                }
            )
    }
}

export function startLibraryscanScan(uid) {

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
