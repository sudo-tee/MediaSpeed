import React from 'react';
import MediaList from '../components/MediaList/MediaList';
import {Dimmer, Loader} from 'semantic-ui-react'
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom'
import {fetchShowsIfNeeded} from '../actions/showsActions';


class MovieListContainer extends React.Component {

    componentDidMount() {
        this.props.fetchShows();
    }

    componentWillReceiveProps(newProps) {
        if(newProps['library-type'] !== this.props['library-type'] ||
           newProps['library-uid'] !== this.props['library-uid']) {
            this.props.fetchShows();
        }
    }

    render() {

        console.log(this.props);

        if(this.props.shows.isFetching) return <Dimmer active><Loader /></Dimmer>;
        let currentShows = this.props.shows.items.filter((movie) => movie.library_uid === this.props['library-uid']);
        return <MediaList medias={currentShows} />
    }
}

function mapStateToProps (state) {
    return {
        shows: state.shows
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchShows: () => dispatch(fetchShowsIfNeeded()),
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(MovieListContainer))
