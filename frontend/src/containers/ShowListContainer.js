import React from 'react';
import MediaList from '../components/MediaList';
import {connect} from "react-redux";
import {selectLibraryShows} from '../reducers';


function mapStateToProps (state) {
    return {
        medias: selectLibraryShows(state) || []
    }
}

export default connect(
    mapStateToProps
)(MediaList)
