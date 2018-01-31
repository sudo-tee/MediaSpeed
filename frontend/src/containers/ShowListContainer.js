import React from 'react';
import MediaList from '../components/MediaList/MediaList';
import {Dimmer, Loader} from 'semantic-ui-react'
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom'
import {fetchShowsIfNeeded} from '../actions/showsActions';
import {selectLibrary} from '../actions/librariesActions';
import {selectLibraryShows} from '../reducers';


class MovieListContainer extends React.Component {

    componentDidMount() {
        this.props.selectLibrary(this.props['library-uid']);
        this.props.fetchShows();
    }

    componentWillReceiveProps(newProps) {
        if(newProps['library-uid'] !== this.props['library-uid']) {
            this.props.fetchShows();
        }
    }

    render() {
        if(this.props.shows.isFetching) return <Dimmer active><Loader /></Dimmer>;
        return <MediaList medias={this.props.shows} />
    }
}

function mapStateToProps (state) {
    return {
        shows: selectLibraryShows(state)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchShows: () => dispatch(fetchShowsIfNeeded()),
        selectLibrary: (uid) => dispatch(selectLibrary(uid))
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(MovieListContainer))
