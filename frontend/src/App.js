import React, {Component} from 'react';
import './App.css'
import MainContentContainer from "./containers/MainContentContainer";
import {Route, Switch, withRouter} from 'react-router-dom'
import {connect} from "react-redux";
import EpisodeVideoPlayerContainer from "./containers/EpisodeVideoPlayerContainer";
import MovieVideoPlayerContainer from "./containers/MovieVideoPlayerContainer";
import {fetchMoviesIfNeeded} from './actions/moviesActions';
import {fetchShowsIfNeeded} from './actions/showsActions';


class App extends Component {
    componentWillMount() {
        this.props.fetchMovies();
        this.props.fetchShows();
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route path='/play/episodes/:uid' render={(props) => <EpisodeVideoPlayerContainer uid={props.match.params.uid}/>}/>
                    <Route path='/play/movies/:uid' render={(props) => <MovieVideoPlayerContainer uid={props.match.params.uid}/>}/>
                    <Route path='/' render={(props) => <MainContentContainer />}/>
                </Switch>

            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchMovies: () => dispatch(fetchMoviesIfNeeded()),
        fetchShows: () => dispatch(fetchShowsIfNeeded()),
    }
}

export default withRouter(connect(
    null,
    mapDispatchToProps
)(App))
