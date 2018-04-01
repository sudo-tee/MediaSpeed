import React, {Component} from 'react'
import {connect} from "react-redux";
import {selectMovieHash} from "../reducers/index";
import VideoPlayer from "../components/VideoPlayer";
import {Dimmer} from "semantic-ui-react";
import {startSession, stopSession} from "../actions/playBackActions";
import {withRouter} from 'react-router-dom';

class MovieVideoPlayerContainer extends Component {
    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search.slice(1));
        const session = params.get('session');

        if (session) {
            this.props.startSession(session)
        } else {
            console.log('TODO')
        }
    }

    render() {
        const movie = this.props.movie;
        const session = this.props.session;
        if(!movie || !session) return <Dimmer>loading...</Dimmer>;
        return <VideoPlayer
            title={movie.title}
            media={movie}
            onSessionStopped={(session, media) => {
                this.props.stopSession(session, media);
                this.props.history.replace(`/libraries/${movie.library_uid}/movies/${movie.uid}`)
            }}
            session={session}

        />
    }
}

function mapStateToProps (state, ownProps) {
    return {
        movie: selectMovieHash(state)[ownProps['uid']],
        session: state.playback.session
    }
}

function mapDispatchToProps(dispatch) {
    return {
        startSession: (session, media) => dispatch(startSession(session, media)),
        stopSession: (session, media) => dispatch(stopSession(session, media))
    }

}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(MovieVideoPlayerContainer))