import React, {Component} from 'react'
import {connect} from "react-redux";
import {selectMovieHash} from "../reducers/index";
import VideoPlayer from "../components/VideoPlayer";
import {Dimmer} from "semantic-ui-react";
import {startSession, stopSession} from "../actions/playBackActions";
import {withRouter} from 'react-router-dom';
import uuid from 'uuid/v4';

class MovieVideoPlayerContainer extends Component {
    componentDidMount() {
        if (!this.getSession()) {
            let session = uuid(Math.random().toString(36).slice(2) + this.props['uid']);
            this.props.history.replace(`/play/movies/${this.props['uid']}?session=${session}`)
        }
    }

    componentDidUpdate(prevProps) {
        const session = this.getSession();
        if(session) this.props.startSession(session)
    }

    getSession = () => {
        const params = new URLSearchParams(this.props.location.search.slice(1));
        return params.get('session');
    };

    stopSession = (session, media) => {
        this.props.stopSession(session, media);
        this.props.history.go(-1);
    };

    render() {
        const movie = this.props.movie;
        const session = this.props.session;
        if(!movie || !session) return <Dimmer>loading...</Dimmer>;
        return <VideoPlayer
            title={movie.title}
            media={movie}
            onSessionStopped={this.stopSession}
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