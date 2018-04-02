import React from 'react';
import {connect} from "react-redux";
import {selectLatestMoviesByLibraries} from '../reducers';
import LibraryWidget from "../components/LibraryWidget";
import withRouter from "react-router-dom/es/withRouter";


const LatestMoviesWidgetContainer = ({library, moviesByLibraries}) => (
    <LibraryWidget medias={moviesByLibraries || []} title={'Latest ' + library.name} maxDisplay={6} layout="poster" playable={true}/>
);

function mapStateToProps (state, props) {
    return {
        moviesByLibraries: selectLatestMoviesByLibraries(state)[props.library.uid],
    }
}

export default withRouter(connect(
    mapStateToProps
)(LatestMoviesWidgetContainer))
