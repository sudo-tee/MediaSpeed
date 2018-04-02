import React, {Component} from 'react'
import {connect} from "react-redux";
import {selectEpisodeHash} from "../reducers/index";
import {fetchEpisodeIfNeeded} from "../actions/episodesActions";
import VideoPlayer from "../components/VideoPlayer";
import {Dimmer} from "semantic-ui-react";
import {startSession, stopSession} from "../actions/playBackActions";
import {withRouter} from "react-router-dom";
import uuid from 'uuid/v4';



class EpisodeVideoPlayerContainer extends Component {

    componentDidMount() {
        if (this.props.uid) {
            this.props.fetchEpisodeIfNeeded(this.props.uid);
        }

        if (!this.getSession()) {
            let session = uuid(Math.random().toString(36).slice(2) + this.props['uid']);
            this.props.history.replace(`/play/episodes/${this.props['uid']}?session=${session}`)
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.uid !== this.props.uid) {
            this.props.fetchEpisodeIfNeeded(this.props.uid);
        }

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
        const episode = this.props.episode;
        const session = this.props.session;
        if (!episode || !session) return <Dimmer>loading...</Dimmer>;
        return <VideoPlayer
            title={`${episode.show_name}  - S${episode.season_number} E${episode.episode_number}  -  ${episode.name}`}
            media={this.props.episode}
            onSessionStopped={this.stopSession}
            onSessionStarted={(session, media) => this.props.startSession(session, media)}
            session={session}
        />
    }
}


function mapStateToProps(state, ownProps) {
    return {
        episode: selectEpisodeHash(state)[ownProps['uid']],
        session: state.playback.session
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        fetchEpisodeIfNeeded: (uid) => dispatch(fetchEpisodeIfNeeded(uid)),
        startSession: (session, media) => dispatch(startSession(session, media)),
        stopSession: (session, media) => dispatch(stopSession(session, media))
    }
}


export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(EpisodeVideoPlayerContainer))