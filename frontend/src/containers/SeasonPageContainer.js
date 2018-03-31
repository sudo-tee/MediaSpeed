import React, {Component} from 'react';
import {connect} from "react-redux";
import {selectSeasonHash, selectEpisodesForCurrentSeason} from "../reducers/index";
import SeasonPage from "../components/SeasonPage";
import {fetchSeasonIfNeeded} from "../actions/seasonsActions";
import {fetchEpisodesIfNeeded} from "../actions/episodesActions";
import {withRouter} from "react-router-dom";
import uuid from 'uuid/v4';



class SeasonPageContainer extends Component {

    componentDidMount() {
        this.props.fetchSeasonIfNeeded();
        if(this.props.season) {
            this.props.fetchEpisodes(this.props.season);
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.season !== this.props.season) {
            this.props.fetchEpisodes(this.props.season);
        }
    }

    render() {
        return <SeasonPage {...this.props}/>
    }
}

function mapStateToProps (state, ownProps) {
    return {
        season: selectSeasonHash(state)[ownProps['season-uid']],
        episodes: selectEpisodesForCurrentSeason(state),
        onPlay: (media) => {
            let session = uuid(Math.random().toString(36).slice(2) + media.uid);
            ownProps.history.push(`/play/${media.type}s/${media.uid}?session=${session}`)
        }
    }
}

function mapDispatchToProps (dispatch, ownProps) {
    return {

        fetchEpisodes: (season) => dispatch(fetchEpisodesIfNeeded(season)),
        fetchSeasonIfNeeded: () => dispatch(fetchSeasonIfNeeded(ownProps['season-uid']))
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(SeasonPageContainer))
