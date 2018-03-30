import React, {Component} from 'react';
import './App.css'
import MainContentContainer from "./containers/MainContentContainer";
import BackgroundChangerContainer from "./containers/BackgroundChangerContainer";
import {Route, Switch, withRouter} from 'react-router-dom'
import {connect} from "react-redux";
import {routeChanged} from "./actions/routerAction"
import EpisodeVideoPlayerContainer from "./containers/EpisodeVideoPlayerContainer";
import MovieVideoPlayerContainer from "./containers/MovieVideoPlayerContainer";
import {fetchMoviesIfNeeded} from './actions/moviesActions';
import {fetchShowsIfNeeded} from './actions/showsActions';


class App extends Component {
    componentWillMount() {
        this.props.fetchMovies();
        this.props.fetchShows();
        this.props.routeChanged(this.props.history.location, this.props.match);
        this.props.history.listen(location => this.props.routeChanged(location, this.props.match));
    }

    render() {
        return (
            <div>
                <BackgroundChangerContainer rootElement='body'/>
                <Switch>
                    <Route path='/play/episodes/:uid' render={(props) => <EpisodeVideoPlayerContainer uid={props.match.params.uid}/>}/>
                    <Route path='/play/movies/:uid' render={(props) => <MovieVideoPlayerContainer uid={props.match.params.uid}/>}/>
                    <Route path='/' render={(props) => <MainContentContainer />}/>
                </Switch>

            </div>
        );
    }
}

function mapStateToProps (state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchMovies: () => dispatch(fetchMoviesIfNeeded()),
        fetchShows: () => dispatch(fetchShowsIfNeeded()),
        routeChanged: (location, match) => dispatch(routeChanged(location, match))
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(App))
