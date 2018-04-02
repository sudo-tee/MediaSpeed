import React from 'react'
import MediaList from '../components/MediaList';
import {connect} from "react-redux";
import {selectLatestMoviesByLibraries} from '../reducers';
import withRouter from "react-router-dom/es/withRouter";
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

export default withRouter(connect(
    mapStateToProps
)(MovieListContainer))

