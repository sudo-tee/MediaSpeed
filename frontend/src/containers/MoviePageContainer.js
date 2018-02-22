import React from 'react';
import {connect} from "react-redux";
import {selectMovieHash} from "../reducers/index";
import MoviePage from "../components/MoviePage";

function mapStateToProps (state, ownProps) {
    return {
        movie: selectMovieHash(state)[ownProps['movie-uid']]
    }
}

export default connect(
    mapStateToProps
)(MoviePage)
