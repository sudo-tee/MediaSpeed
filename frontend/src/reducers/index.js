import {combineReducers} from "redux";

import libraries from "./librariesReducer";
import mainMenu from "./mainMenuReducer";
import movies from "./moviesReducer";
import shows from "./showsReducer";
import seasons from "./seasonsReducer";
import episodes from "./episodesReducer";
import fileSystem from "./fileSystemReducer";
import mediaSelection from "./mediaSelectionReducer";
import playback from "./playBackReducer";
import {createSelector} from 'reselect';
import {values, groupBy} from 'lodash';

export default combineReducers({
    libraries,
    movies,
    shows,
    seasons,
    episodes,
    mainMenu,
    fileSystem,
    mediaSelection,
    playback
});

export const selectMovieHash = (state) => state.movies.items;
export const selectShowHash = (state) => state.shows.items;
export const selectSeasonHash = (state) => state.seasons.items;
export const selectEpisodeHash = (state) => state.episodes.items;

export const selectSeasonsUidsByShowsUid = (state) => state.seasons.byShowUid;
export const selectEpisodesUidsBySeasonUid = (state) => state.episodes.bySeasonUid;

export const selectLibraryHash = (state) => state.libraries.items;
export const selectFoldersSubPath = (state) => state.fileSystem.folders;
export const selectSelectedFolder = (state) => state.fileSystem.selectedFolder;

export const selectCurrentMediaSelection = (state) => state.mediaSelection;
export const selectMovieList = createSelector(selectMovieHash, (movieHash) => values(movieHash));
export const selectShowList = createSelector(selectShowHash, (showHash) => values(showHash));
export const selectLibraryList = createSelector([selectLibraryHash], (libraryHash) => values(libraryHash));
export const selectSeasonsList = createSelector([selectSeasonHash], (seasonHash) => values(seasonHash));
export const selectEpisodesList =createSelector([selectEpisodeHash], (episodeHash) => values(episodeHash));

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

export const selectEpisodesForCurrentSeason = createSelector(
    selectEpisodeHash, selectEpisodesUidsBySeasonUid, selectCurrentMediaSelection,
    (episodeHash, episodesBySeasons, currentMediaSelection) => {
        const episodesUids  = episodesBySeasons[currentMediaSelection.season] || [];
        return episodesUids.map(episodeUid => episodeHash[episodeUid]);
    }
);

export const selectSeasonsForCurrentShow = createSelector(
    selectSeasonHash, selectSeasonsUidsByShowsUid, selectCurrentMediaSelection,
    (seasonHash, seasonsByShow, currentMediaSelection) => {
        const seasonsUids  = seasonsByShow[currentMediaSelection.show] || [];
        return seasonsUids.map(seasonUid => seasonHash[seasonUid]);
    }
);

export const selectRandomShowOrMovie = createSelector(
  selectMovieList, selectShowList,
    (movies, shows) => {
      const all = [...movies, ...shows];
      return all[Math.floor(all.length * Math.random())]
    }
);