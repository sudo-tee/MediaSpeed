import {keyBy, isEmpty} from 'lodash'

export const REQUEST_EPISODES = 'REQUEST_EPISODES';
export const RECEIVE_EPISODES = 'RECEIVE_EPISODES';
export const INVALIDATE_EPISODES = 'INVALIDATE_EPISODES';

export function requestEpisodes() {
    return {
        type: REQUEST_EPISODES
    }
}

function receiveEpisodes(episodes, season) {
    return (dispatch) => {
        const bySeasonUid = episodes.reduce( (initial, episode) => {
            initial[episode.season_uid] = initial[episode.season_uid] || [];
            initial[episode.season_uid].push(episode.uid);
            return initial;
        }, {});
        dispatch({
            type: RECEIVE_EPISODES,
            episodes: keyBy(episodes, 'uid'),
            bySeasonUid,
            receivedAt: Date.now()
        })
    }
}

export function invalidateEpisodes() {
    return {
        type: INVALIDATE_EPISODES
    }
}

export function fetchEpisodes(season) {

    return function (dispatch) {

        dispatch(requestEpisodes());

        return fetch(`/api/shows/${season.show_uid}/episodes?sortBy=episode_number`)
            .then(
                response => response.json(),
                // Do not use catch, because that will also catch
                // any errors in the dispatch and resulting render,
                // causing a loop of 'Unexpected batch number' errors.
                // https://github.com/facebook/react/issues/6895
                error => console.log('An error occurred.', error)
            )
            .then(json =>
                dispatch(receiveEpisodes(json))
            )
    }
}

export function shouldFetchEpisodes(state, season) {
    const episodes = state.episodes;

    if (episodes.isFetching) {
        return false
    } else if (!episodes.bySeasonUid[season.uid]) {
        return true
    } else if (isEmpty(episodes.items)) {
        return true
    } else {
        return episodes.didInvalidate
    }
}

export function fetchEpisodesIfNeeded(show) {
    return (dispatch, getState) => {
        if (shouldFetchEpisodes(getState(), show)) {
            // Dispatch a thunk from thunk!
            return dispatch(fetchEpisodes(show))
        } else {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve()
        }
    }
}
