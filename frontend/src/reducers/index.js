import {combineReducers} from "redux";

import libraries from "./librariesReducer";
import mainMenu from "./mainMenuReducer";
import movies from "./moviesReducer";
import shows from "./showsReducer";
import fileSystem from "./fileSystemReducer";
import {createSelector} from 'reselect';
import {values} from 'lodash';

export default combineReducers({
    libraries,
    movies,
    shows,
    mainMenu,
    fileSystem
});

const groupBy = function(list, key) {
    return list.reduce(function(returnValue, currentItem) {
        (returnValue[currentItem[key]] = returnValue[currentItem[key]] || []).push(currentItem);
        return returnValue;
    }, {});
};

export const selectMovieHash = (state) => state.movies.items;
export const selectShowHash = (state) => state.shows.items;
export const selectLibraryHash = (state) => state.libraries.items;
export const selectFoldersSubPath = (state) => state.fileSystem.folders;
export const selectSelectedFolder = (state) => state.fileSystem.selectedFolder;

export const selectCurrentLibrary = (state) => state.libraries.items[state.selectedLibrary];
export const selectMovieList = createSelector(selectMovieHash, (movieHash) => values(movieHash));
export const selectShowList = createSelector(selectShowHash, (showHash) => values(showHash));
export const selectLibraryList = createSelector([selectLibraryHash], (libraryHash) => values(libraryHash));

export const selectLibraryMovies = createSelector(
    selectCurrentLibrary, selectMovieList,
    (library, movieList) => library ? movieList.filter(movie => movie.library_uid === library.uid) : movieList
);

export const selectLibraryShows = createSelector(
    selectCurrentLibrary, selectShowList,
    (library, showsList) => library ? showsList.filter(show => show.library_uid === library.uid) : showsList
);

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

