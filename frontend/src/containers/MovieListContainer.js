import React from 'react'
import MediaList from '../components/MediaList';
import {connect} from "react-redux";
import {selectLatestMoviesByLibraries} from '../reducers';
import withRouter from "react-router-dom/es/withRouter";
import uuid from 'uuid/v4';
import BackgroundChanger from "../BackgroundChanger";


const MovieListContainer = (props) =>
    <div>
        <BackgroundChanger media={props.medias[Math.floor(props.medias.length * Math.random())]}/>
        <MediaList {...props}/>
    </div>;



function mapStateToProps (state, ownProps) {
    return {
        medias: selectLatestMoviesByLibraries(state)[ownProps['library-uid']] || []
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
)(MovieListContainer))

