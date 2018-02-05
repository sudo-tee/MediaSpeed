import React from 'react';
import {connect} from "react-redux";
import {selectLibraryMovies, selectLibraryShows} from '../reducers';
import BackgroundChanger from "../components/BackgroundChanger/BackgroundChanger";


const BackgroundChangerContainer = ({ movies, shows }) =>
        <BackgroundChanger medias={[...movies, ...shows]} root-element="body"/>;

function mapStateToProps (state) {
    return {
        movies: selectLibraryMovies(state),
        shows: selectLibraryShows(state),
    }
}

export default connect(
    mapStateToProps
)(BackgroundChangerContainer)
