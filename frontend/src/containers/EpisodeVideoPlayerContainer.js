import React, {Component} from 'react'
import {connect} from "react-redux";
import {selectEpisodeHash} from "../reducers/index";
import {fetchEpisodeIfNeeded} from "../actions/episodesActions";
import VideoPlayer from "../components/VideoPlayer";
import {Dimmer} from "semantic-ui-react";
import {startSession, stopSession} from "../actions/playBackActions";
import {withRouter} from "react-router-dom";


class EpisodeVideoPlayerContainer extends Component {

    componentDidMount() {

        if (this.props.uid) {
            this.props.fetchEpisodeIfNeeded(this.props.uid);
        }

        const params = new URLSearchParams(this.props.location.search.slice(1));
        const session = params.get('session');

        if (session) {
            this.props.startSession(session)
        } else {
            console.log('TODO')
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.uid !== this.props.uid) {
            this.props.fetchEpisodeIfNeeded(this.props.uid);
        }
    }

    render() {
        const episode = this.props.episode;
        const session = this.props.session;
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