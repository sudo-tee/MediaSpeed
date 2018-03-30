import { matchPath } from 'react-router-dom';
import {startSession} from "./playBackActions";
export const MEDIA_SELECTED = 'MEDIA_SELECTED';

export function routeChanged(location) {
    return (dispatch) => {

        const playerRoute = matchPath(location.pathname, {
            path: '/play/:libraryType/:entityUid',
            exact: true,
            strict: false
        });

        if(playerRoute) {
            const params = new URLSearchParams(location.search);
            const session = params.get('session');
            dispatch(startSession(session))
        }

        const mediaRoute = matchPath(location.pathname, {
            path: '/libraries/:libraryUid/:libraryType/:entityUid',
            exact: true,
            strict: false
        });

        const mediaMatch = mediaRoute || playerRoute;

        const libraryMatch = matchPath(location.pathname, {
            path: '/libraries/:libraryUid/:libraryType',
            exact: true,
            strict: false
        });

        const getMediaUid = (type) => {
            if (!mediaMatch) return null;
            return mediaMatch.params.libraryType === type ? mediaMatch.params.entityUid : null
        };

        const getLibraryUid  = () => {
            const match = (libraryMatch || mediaMatch);
            if(!match) return null;

            return match.params.libraryUid
        };

        const dispatchSelected = {library: getLibraryUid(),
            movie: getMediaUid('movies'),
            show: getMediaUid('shows'),
            season: getMediaUid('seasons'),
            episode: getMediaUid('episodes')};

        dispatch({
            type: MEDIA_SELECTED,
            selected: dispatchSelected
        })
    }
}

