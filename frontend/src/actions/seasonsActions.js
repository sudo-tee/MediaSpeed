import {keyBy, isEmpty} from 'lodash'

export const REQUEST_SEASONS = 'REQUEST_SEASONS';
export const RECEIVE_SEASONS = 'RECEIVE_SEASONS';
export const INVALIDATE_SEASONS = 'INVALIDATE_SEASONS';

export function requestSeasons() {
    return {
        type: REQUEST_SEASONS
    }
}

function receiveSeasons(seasons, show) {
    return {
        type: RECEIVE_SEASONS,
        seasons: keyBy(seasons, 'uid'),
        show: show,
        receivedAt: Date.now()
    }
}

export function invalidateSeasons() {
    return {
        type: INVALIDATE_SEASONS
    }
}

export function fetchSeasons(show) {

    return function (dispatch) {

        dispatch(requestSeasons());

        return fetch(`/api/shows/${show.uid}/seasons?sortBy=season_number`)
            .then(
                response => response.json(),
                // Do not use catch, because that will also catch
                // any errors in the dispatch and resulting render,
                // causing a loop of 'Unexpected batch number' errors.
                // https://github.com/facebook/react/issues/6895
                error => console.log('An error occurred.', error)
            )
            .then(json =>
                dispatch(receiveSeasons(json, show))
            )
    }
}

export function shouldFetchSeasons(state, show) {
    const seasons = state.seasons;
console.log('shouldFetchSeasons', seasons.byShowUid[show.uid], show);
    if (seasons.isFetching) {
        return false
    } else if (!seasons.byShowUid[show.uid]) {
        return true
    } else if (isEmpty(seasons.items)) {
        return true
    } else {
        return seasons.didInvalidate
    }
}

export function fetchSeasonsIfNeeded(show) {
    return (dispatch, getState) => {
        if (shouldFetchSeasons(getState(), show)) {
            // Dispatch a thunk from thunk!
            return dispatch(fetchSeasons(show))
        } else {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve()
        }
    }
}
