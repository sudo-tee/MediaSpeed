import React, {Component} from 'react';
import {connect} from "react-redux";
import {selectSeasonHash, selectEpisodesForCurrentSeason} from "../reducers/index";
import SeasonPage from "../components/SeasonPage";
import {fetchSeasonIfNeeded} from "../actions/seasonsActions";
import {fetchEpisodesIfNeeded} from "../actions/episodesActions";


class SeasonPageContainer extends Component {
    componentWillMount() {
        this.props.fetchSeasonIfNeeded();
        if(this.props.season) {
            this.props.fetchEpisodes(this.props.season);
        }
    }
    componentWillReceiveProps(nextProps) {
        console.log('SEASON', this.props.season);
        if(nextProps.season !== this.season) {
            this.props.fetchEpisodes(nextProps.season);
        }
    }

    render() {
        return <SeasonPage {...this.props} />
    }
}

function mapStateToProps (state, ownProps) {
    return {
        season: selectSeasonHash(state)[ownProps['season-uid']],
        episodes: selectEpisodesForCurrentSeason(state),
    }
}

function mapDispatchToProps (dispatch, ownProps) {
    return {

        fetchEpisodes: (season) => dispatch(fetchEpisodesIfNeeded(season)),
        fetchSeasonIfNeeded: () => dispatch(fetchSeasonIfNeeded(ownProps['season-uid']))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SeasonPageContainer)
