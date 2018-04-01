import {combineReducers} from "redux";

import libraries from "./librariesReducer";
import mainMenu from "./mainMenuReducer";
import movies from "./moviesReducer";
import shows from "./showsReducer";
import seasons from "./seasonsReducer";
import episodes from "./episodesReducer";
import fileSystem from "./fileSystemReducer";
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

export const selectMovieList = createSelector(selectMovieHash, (movieHash) => values(movieHash));
export const selectShowList = createSelector(selectShowHash, (showHash) => values(showHash));
export const selectLibraryList = createSelector([selectLibraryHash], (libraryHash) => values(libraryHash));
export const selectSeasonsList = createSelector([selectSeasonHash], (seasonHash) => values(seasonHash));
export const selectEpisodesList =createSelector([selectEpisodeHash], (episodeHash) => values(episodeHash));

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

export const selectEpisodesForCurrentSeason = (state, seasonUid) => {
    const episodesUids = selectEpisodesUidsBySeasonUid(state)[seasonUid] || [];
    return episodesUids.map(episodeUid => selectEpisodeHash(state)[episodeUid]);
};


export const selectSeasonsForCurrentShow = (state, showUid) => {
    const seasonsUids = selectSeasonsUidsByShowsUid(state)[showUid] || [];
    return seasonsUids.map(seasonUid => selectSeasonHash(state)[seasonUid]);
};

export const selectRandomShowOrMovie = createSelector(
  selectMovieList, selectShowList,
    (movies, shows) => {
      const all = [...movies, ...shows];
      return all[Math.floor(all.length * Math.random())]
    }
);