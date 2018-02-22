import {combineReducers} from "redux";

import libraries from "./librariesReducer";
import mainMenu from "./mainMenuReducer";
import movies from "./moviesReducer";
import shows from "./showsReducer";
import fileSystem from "./fileSystemReducer";
import mediaSelection from "./mediaSelectionReducer";
import {createSelector} from 'reselect';
import {values, groupBy} from 'lodash';

export default combineReducers({
    libraries,
    movies,
    shows,
    mainMenu,
    fileSystem,
    mediaSelection
});

export const selectMovieHash = (state) => state.movies.items;
export const selectShowHash = (state) => state.shows.items;
export const selectSeasonsHash = (sate) => ({});
export const selectEpisodesHash = (sate) => ({});

export const selectLibraryHash = (state) => state.libraries.items;
export const selectFoldersSubPath = (state) => state.fileSystem.folders;
export const selectSelectedFolder = (state) => state.fileSystem.selectedFolder;

export const selectCurrentMediaSelection = (state) => state.mediaSelection;
export const selectMovieList = createSelector(selectMovieHash, (movieHash) => values(movieHash));
export const selectShowList = createSelector(selectShowHash, (showHash) => values(showHash));
export const selectLibraryList = createSelector([selectLibraryHash], (libraryHash) => values(libraryHash));
export const selectSeasonsList = (sate) => [];
export const selectEpisodesList = (sate) => [];

export const selectLibraryMovies = (state) => {
    return selectLatestMoviesByLibraries(state)[state.mediaSelection.library] || []
};

export const selectLibraryShows = (state) => {
    return selectLatestShowsByLibraries(state)[state.mediaSelection.library] || []
};

export const selectLatestMoviesByLibraries = createSelector(
    selectMovieList,
    (movieList) => {
        const sorted = [...movieList].sort((a, b) => new Date(b.meta.created) - new Date(a.meta.created));
        return groupBy(sorted, 'library_uid');
    }
);

export const selectLatestShowsByLibraries = createSelector(
    selectShowList,
    (showList) => {
        const sorted = [...showList].sort((a, b) => new Date(b.meta.created) - new Date(a.meta.created));
        return groupBy(sorted, 'library_uid');
    }
);

export const selectCurrentPresentedMedia = createSelector(
    selectCurrentMediaSelection, selectMovieHash, selectShowHash, selectSeasonsHash, selectEpisodesHash, selectLibraryHash,
    (currentMediaSelection, movies, shows, seasons, episodes, libraries) => {
        if (movies[currentMediaSelection.movie]) return movies[currentMediaSelection.movie];
        if (episodes[currentMediaSelection.episode]) return episodes[currentMediaSelection.episode];
        if (seasons[currentMediaSelection.season]) return seasons[currentMediaSelection.season];
        if (shows[currentMediaSelection.show]) return shows[currentMediaSelection.show];

        const mediasFromLibraryOrAll = (() => {
            if (currentMediaSelection.library && libraries[currentMediaSelection.library]) {
                const library = libraries[currentMediaSelection.library];
                if (library.type === 'movie') return values(movies).filter(movie => movie.library_uid === library.uid);
                if (library.type === 'episode') return values(shows).filter(shows => shows.library_uid === library.uid);
            }

            return [...values(movies), ...values(shows)];
        })();

        return mediasFromLibraryOrAll[Math.floor(mediasFromLibraryOrAll.length * Math.random())];
    }
);

