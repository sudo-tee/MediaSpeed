import React from 'react';
import {connect} from "react-redux";
import Home from "../components/Home";
import {selectLibrary} from '../actions/librariesActions';
import {fetchMoviesIfNeeded} from '../actions/moviesActions';
import {fetchShowsIfNeeded} from '../actions/showsActions';
import {selectLibraryList} from '../reducers';


class HomeContainer extends React.Component {
    componentDidMount() {
        this.props.selectLibrary(null);
        this.props.fetchMovies();
        this.props.fetchShows();
    }

    render() {
        return <Home libraries={this.props.libraries}/>
    }
}

function mapDispatchToProps(dispatch) {
    return {
        selectLibrary: (uid) => dispatch(selectLibrary(uid)),
        fetchMovies: () => dispatch(fetchMoviesIfNeeded()),
        fetchShows: () => dispatch(fetchShowsIfNeeded()),
    }
}

function mapStateToProps (state) {
    return {
        libraries: selectLibraryList(state)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer)
