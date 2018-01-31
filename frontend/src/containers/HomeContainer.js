import React from 'react';
import {connect} from "react-redux";
import Home from "../components/Home";
import {selectLibrary} from '../actions/librariesActions';
import {fetchMoviesIfNeeded} from '../actions/moviesActions';
import {fetchShowsIfNeeded} from '../actions/showsActions';
import {selectLatestMoviesByLibraries, selectLatestShowsByLibraries, selectLibraryList} from '../reducers';


class HomeContainer extends React.Component {
    componentDidMount() {
        this.props.selectLibrary(null);
        this.props.fetchMovies();
        this.props.fetchShows();
    }

    render() {
        return <Home shows={this.props.movies} movies={this.props.shows} libraries={this.props.movies.items}/>
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
        movies: state.movies,
        shows: state.shows,
        libraries: selectLibraryList(state),
        moviesByLibraries: selectLatestMoviesByLibraries(state),
        showsByLibraries: selectLatestShowsByLibraries(state),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer)
