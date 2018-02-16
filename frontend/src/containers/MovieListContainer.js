import React from 'react';
import MediaList from '../components/MediaList/MediaList';
import {Dimmer, Loader} from 'semantic-ui-react'
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom'
import {fetchMoviesIfNeeded} from '../actions/moviesActions';
import {selectLibraryMovies} from '../reducers';
import {selectLibrary} from '../actions/librariesActions';


class MovieListContainer extends React.Component {

    componentDidMount() {
        this.props.selectLibrary(this.props['library-uid']);
        this.props.fetchMovies();
    }

    componentWillReceiveProps(newProps) {
        if(newProps['library-uid'] !== this.props['library-uid']) {
            this.props.selectLibrary(newProps['library-uid'])
        }
    }

    render() {
        if(this.props.movies.isFetching) return <Dimmer active><Loader /></Dimmer>;
        return <MediaList medias={this.props.movies} />
    }
}

function mapStateToProps (state) {
    return {
        movies: selectLibraryMovies(state)  || []
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchMovies: () => dispatch(fetchMoviesIfNeeded()),
        selectLibrary: (uid) => dispatch(selectLibrary(uid)),
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(MovieListContainer))
