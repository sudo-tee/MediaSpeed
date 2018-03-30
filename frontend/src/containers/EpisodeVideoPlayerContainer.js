import React, {Component} from 'react'
import {connect} from "react-redux";
import {selectCurrentMediaSelection, selectEpisodeHash} from "../reducers/index";
import {fetchEpisodeIfNeeded} from "../actions/episodesActions";
import VideoPlayer from "../components/VideoPlayer";
import {Dimmer} from "semantic-ui-react";
import {startSession, stopSession} from "../actions/playBackActions";
import {withRouter} from "react-router-dom";


class EpisodeVideoPlayerContainer extends Component {
    componentWillMount() {
        if (this.props.uid) {
            this.props.fetchEpisodeIfNeeded(this.props.uid);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.uid !== this.uid) {
            this.props.fetchEpisodeIfNeeded(nextProps.uid);
        }
    }

    render() {
        const episode = this.props.episode;
        const session = this.props.session;
        console.log(episode, session)
        if (!episode || !session) return <Dimmer>loading...</Dimmer>;
        return <VideoPlayer
            title={`${episode.show_name}  - S${episode.season_number} E${episode.episode_number}  -  ${episode.name}`}
            media={this.props.episode}
            onSessionStopped={(session, media) => {
                this.props.stopSession(session, media);
                this.props.history.replace(`/libraries/${episode.library_uid}/seasons/${episode.season_uid}`)
            }}
            onSessionStarted={(session, media) => this.props.startSession(session, media)}
            session={session}
        />
    }
}


function mapStateToProps(state) {
    const currentSelection = selectCurrentMediaSelection(state);
    return {
        currentSelection,
        episode: selectEpisodeHash(state)[currentSelection.episode],
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