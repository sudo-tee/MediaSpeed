import React from 'react';
import MediaList from '../components/MediaList/MediaList';
import {Dimmer, Loader} from 'semantic-ui-react'
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom'
import {fetchMoviesIfNeeded} from '../actions/moviesActions';


class MovieListContainer extends React.Component {

    componentDidMount() {
        this.props.fetchMovies();
    }

    componentWillReceiveProps(newProps) {
        if(newProps['library-type'] !== this.props['library-type'] ||
           newProps['library-uid'] !== this.props['library-uid']) {
            this.props.fetchMovies();
        }
    }

    render() {

        console.log(this.props);

        if(this.props.movies.isFetching) return <Dimmer active><Loader /></Dimmer>;
        let currentMovies = this.props.movies.items.filter((movie) => movie.library_uid === this.props['library-uid']);
        return <MediaList medias={currentMovies} />
    }
}

function mapStateToProps (state) {
    return {
        movies: state.movies
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchMovies: () => dispatch(fetchMoviesIfNeeded()),
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(MovieListContainer))
