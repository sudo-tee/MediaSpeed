import React from 'react';
import MediaList from '../components/MediaList';
import {connect} from "react-redux";
import {selectLibraryMovies} from '../reducers';


function mapStateToProps (state) {
    return {
        medias: selectLibraryMovies(state) || []
    }
}

export default connect(
    mapStateToProps
)(MediaList)

