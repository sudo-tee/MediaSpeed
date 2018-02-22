import { matchPath } from 'react-router-dom';
export const MEDIA_SELECTED = 'MEDIA_SELECTED';

export function routeChanged(location) {
    return (dispatch) => {

        const mediaMatch = matchPath(location.pathname, {
            path: '/libraries/:libraryUid/:libraryType/:entityUid',
            exact: true,
            strict: false
        });

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

