export const START_SESSION = 'START_SESSION';
export const STOP_SESSION = 'STOP_SESSION';

export function startSession(sessionId, media) {
    return {
        type: START_SESSION,
        session: sessionId
    }
}

export function stopSession(sessionId, media) {

    return function (dispatch) {

        return fetch(`/hls/${media.type}/${media.uid}/stop?session=${sessionId}`, {method: 'POST'})
            .then(
                response => response.json(),
                error => console.log('An error occurred.', error)
            )
            .then(json => {
                    return dispatch({
                        type: STOP_SESSION
                    })
                }
            )
    }
}
