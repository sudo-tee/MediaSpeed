import {combineReducers} from "redux";

import libraries from "./librariesReducer";
import mainMenu from "./mainMenuReducer";
import movies from "./moviesReducer";
import shows from "./showsReducer";
import {createSelector} from 'reselect';

export default combineReducers({
    libraries,
    movies,
    shows,
    mainMenu
});

const groupBy = function(list, key) {
    return list.reduce(function(returnValue, currentItem) {
        (returnValue[currentItem[key]] = returnValue[currentItem[key]] || []).push(currentItem);
        return returnValue;
    }, {});
};

export const selectCurrentLibrary = (state) => state.libraries.items.find((lib) => lib.uid === state.libraries.selectedLibrary);
export const selectMovieList = (state) => state.movies.items;
export const selectShowList = (state) => state.shows.items;
export const selectLibraryList = (state) => state.libraries.items;

export const selectLibraryMovies = createSelector(
    selectCurrentLibrary, selectMovieList,
    (library, movieList) => library ? movieList.filter(movie => movie.library_uid === library.uid) : movieList
);

export const selectLibraryShows = createSelector(
    selectCurrentLibrary, selectShowList,
    (library, showsList) => library ? showsList.filter(show => show.library_uid === library.uid) : showsList
);

export const selectLatestMoviesByLibraries = createSelector(
    selectLibraryList, selectMovieList,
    (libraries, movieList) => {
        const sorted = [...movieList].sort((a, b) => new Date(b.meta.created) - new Date(a.meta.created));
        return groupBy(sorted, 'library_uid');
    }
);

export const selectLatestShowsByLibraries = createSelector(
    selectLibraryList, selectShowList,
    (libraries, showList) => {
        const sorted = [...showList].sort((a, b) => new Date(b.meta.created) - new Date(a.meta.created));
        return groupBy(sorted, 'library_uid');
    }
);

