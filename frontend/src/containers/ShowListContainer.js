import React from 'react'
import MediaList from '../components/MediaList';
import {connect} from "react-redux";
import {selectLatestShowsByLibraries} from '../reducers';
import withRouter from "react-router-dom/es/withRouter";
import BackgroundChanger from "../BackgroundChanger";


const ShowListContainer = (props) =>
    <div>
        <BackgroundChanger media={props.medias[Math.floor(props.medias.length * Math.random())]}/>
        <MediaList {...props}/>
    </div>;

function mapStateToProps (state, ownProps) {
    return {
        medias: selectLatestShowsByLibraries(state)[ownProps['library-uid']] || []
    }
}

export default withRouter(connect(
    mapStateToProps
)(ShowListContainer))
