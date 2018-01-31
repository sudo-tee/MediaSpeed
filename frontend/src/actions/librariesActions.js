
export const REQUEST_LIBRARIES = 'REQUEST_LIBRARIES';
export const RECEIVE_LIBRARIES = 'RECEIVE_LIBRARIES';
export const INVALIDATE_LIBRARIES = 'INVALIDATE_LIBRARIES';
export const SELECT_LIBRARY = 'SELECT_LIBRARY';

export function requestLibraries() {
    return {
        type: REQUEST_LIBRARIES
    }
}

function receiveLibraries(libraries) {
    return {
        type: RECEIVE_LIBRARIES,
        libraries: libraries,
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

export function fetchLibraries() {

    return function (dispatch) {

        dispatch(requestLibraries());

        return fetch('/api/libraries')
            .then(
                response => response.json(),
                // Do not use catch, because that will also catch
                // any errors in the dispatch and resulting render,
                // causing a loop of 'Unexpected batch number' errors.
                // https://github.com/facebook/react/issues/6895
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
    } else if (libraries.items.length === 0) {
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
