import {keyBy, isEmpty} from 'lodash'

export const REQUEST_SHOWS = 'REQUEST_SHOWS';
export const RECEIVE_SHOWS = 'RECEIVE_SHOWS';
export const INVALIDATE_SHOWS = 'INVALIDATE_SHOWS';

export function requestShows() {
    return {
        type: REQUEST_SHOWS
    }
}

function receiveShows(shows) {
    return {
        type: RECEIVE_SHOWS,
        shows: keyBy(shows, 'uid'),
        receivedAt: Date.now()
    }
}

export function invalidateShows() {
    return {
        type: INVALIDATE_SHOWS
    }
}

export function fetchShows() {

    return function (dispatch) {

        dispatch(requestShows());

        return fetch('/api/shows')
            .then(
                response => response.json(),
                // Do not use catch, because that will also catch
                // any errors in the dispatch and resulting render,
                // causing a loop of 'Unexpected batch number' errors.
                // https://github.com/facebook/react/issues/6895
                error => console.log('An error occurred.', error)
            )
            .then(json =>
                dispatch(receiveShows(json))
            )
    }
}

export function shouldFetchShows(state) {
    const shows = state.shows;

    if (shows.isFetching) {
        return false
    } else if (isEmpty(shows.items)) {
        return true
    } else {
        return shows.didInvalidate
    }
}

export function fetchShowsIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchShows(getState())) {
            // Dispatch a thunk from thunk!
            return dispatch(fetchShows())
        } else {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve()
        }
    }
}
