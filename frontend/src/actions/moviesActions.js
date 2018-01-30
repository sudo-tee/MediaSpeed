
export const REQUEST_MOVIES = 'REQUEST_MOVIES';
export const RECEIVE_MOVIES = 'RECEIVE_MOVIES';
export const INVALIDATE_MOVIES = 'INVALIDATE_MOVIES';

export function requestMovies() {
    return {
        type: REQUEST_MOVIES
    }
}

function receiveMovies(movies) {
    return {
        type: RECEIVE_MOVIES,
        movies: movies,
        receivedAt: Date.now()
    }
}

export function invalidateMovies() {
    return {
        type: INVALIDATE_MOVIES
    }
}

export function fetchMovies() {

    return function (dispatch) {

        dispatch(requestMovies());

        return fetch('/api/movies')
            .then(
                response => response.json(),
                // Do not use catch, because that will also catch
                // any errors in the dispatch and resulting render,
                // causing a loop of 'Unexpected batch number' errors.
                // https://github.com/facebook/react/issues/6895
                error => console.log('An error occurred.', error)
            )
            .then(json =>
                dispatch(receiveMovies(json))
            )
    }
}

export function shouldFetchMovies(state) {
    const movies = state.movies;

    if (movies.isFetching) {
        return false
    } else if (movies.items.length === 0) {
        return true
    } else {
        return movies.didInvalidate
    }
}

export function fetchMoviesIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetchMovies(getState())) {
            // Dispatch a thunk from thunk!
            return dispatch(fetchMovies())
        } else {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve()
        }
    }
}
