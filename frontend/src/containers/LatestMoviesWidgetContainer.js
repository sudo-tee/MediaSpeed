import React from 'react';
import {connect} from "react-redux";
import {selectLatestMoviesByLibraries} from '../reducers';
import LibraryWidget from "../components/LibraryWidget";
import uuid from 'uuid/v4';
import withRouter from "react-router-dom/es/withRouter";


const LatestMoviesWidgetContainer = ({library, moviesByLibraries, onPlay}) => (
    <LibraryWidget onPlay={onPlay} medias={moviesByLibraries || []} title={'Latest ' + library.name} maxDisplay={6} layout="poster" playable={true}/>
);

function mapStateToProps (state, props) {
    return {
        moviesByLibraries: selectLatestMoviesByLibraries(state)[props.library.uid],
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        //@TODO refator with context API ?...
        onPlay: (media) => {
            let session = uuid(Math.random().toString(36).slice(2) + media.uid);
            ownProps.history.push(`/play/movies/${media.uid}?session=${session}`)
        }
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(LatestMoviesWidgetContainer))
