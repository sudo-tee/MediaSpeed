import React, {Component} from 'react'
import {Switch, Route, withRouter} from 'react-router-dom';
import MovieListContainer from "../containers/MovieListContainer";
import ShowListContainer from "../containers/ShowListContainer";
import HomeContainer from "../containers/HomeContainer";
import SettingsContainer from "../containers/SettingsContainer";
import MoviePageContainer from "../containers/MoviePageContainer";
import ShowPageContainer from "../containers/ShowPageContainer";
import SeasonPageContainer from "../containers/SeasonPageContainer";

class MainContent extends Component {
    render() {
        let classNames = "main-content";
        if(this.props.mainMenuVisible) classNames += " main-menu-visible";
        return (
            <div className={classNames}>
                <Switch>
                    <Route exact path='/' render={(props) => <HomeContainer />}/>

                    <Route path='/libraries/:id/movies/:movieUid'
                           render={(props) => <MoviePageContainer movie-uid={props.match.params.movieUid}/>}/>

                    <Route path='/libraries/:id/shows/:showUid'
                           render={(props) => <ShowPageContainer show-uid={props.match.params.showUid}/>}/>

                    <Route path='/libraries/:id/seasons/:seasonUid'
                           render={(props) => <SeasonPageContainer season-uid={props.match.params.seasonUid}/>}/>


                    <Route path='/libraries/:id/movies'
                           render={(props) => <MovieListContainer library-uid={props.match.params.id}
                                                                  library-type='movies'/>}/>
                    <Route path='/libraries/:id/shows'
                           render={(props) => <ShowListContainer library-uid={props.match.params.id}
                                                                  library-type='shows'/>}/>

                    <Route exact path='/settings' render={(props) => <SettingsContainer />}/>
                </Switch>
            </div>
        )
    }
}

export default withRouter(MainContent);