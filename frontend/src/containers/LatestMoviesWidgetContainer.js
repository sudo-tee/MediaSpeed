import React from 'react';
import {connect} from "react-redux";
import {selectLatestMoviesByLibraries} from '../reducers';
import LibraryWidget from "../components/LibraryWidget";


const LatestMoviesWidgetContainer = ({library, moviesByLibraries}) => (
    <LibraryWidget medias={moviesByLibraries || []} title={'Latest ' + library.name} maxDisplay={6} layout="poster"/>
);

function mapStateToProps (state, props) {
    return {
        moviesByLibraries: selectLatestMoviesByLibraries(state)[props.library.uid],
    }
}

export default connect(
    mapStateToProps
)(LatestMoviesWidgetContainer)
