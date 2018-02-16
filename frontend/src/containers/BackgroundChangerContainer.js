import React from 'react';
import {connect} from "react-redux";
import {selectLibraryMovies, selectLibraryShows, selectMovieList, selectShowList, selectCurrentLibrary} from '../reducers';
import BackgroundChanger from "../components/BackgroundChanger/BackgroundChanger";


const BackgroundChangerContainer = ({ movies, shows , allMovies, allShows, currentLibrary }) => {


    if(currentLibrary && currentLibrary.type === 'movie') {
        return <BackgroundChanger medias={movies} root-element="body"/>
    }

    if(currentLibrary && currentLibrary.type === 'episode') {
        return <BackgroundChanger medias={shows} root-element="body"/>
    }

    return <BackgroundChanger medias={[...allMovies, ...allShows]} root-element="body"/>;
};

function mapStateToProps (state) {
    return {
        currentLibrary: selectCurrentLibrary(state),
        movies: selectLibraryMovies(state),
        shows: selectLibraryShows(state),
        allMovies: selectMovieList(state),
        allShows: selectShowList(state),
    }
}

export default connect(
    mapStateToProps
)(BackgroundChangerContainer)
