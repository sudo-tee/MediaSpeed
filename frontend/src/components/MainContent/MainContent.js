import React, {Component} from 'react'
import {Switch, Route, withRouter} from 'react-router-dom';
import MovieListContainer from "../../containers/MovieListContainer";
import ShowListContainer from "../../containers/ShowListContainer";
import HomeContainer from "../../containers/HomeContainer";

class MainContent extends Component {
    render() {
        let classNames = "main-content";
        if(this.props.mainMenuVisible) classNames += " main-menu-visible";
        return (
            <div className={classNames}>
                <Switch>
                    <Route exact path='/' render={(props) => <HomeContainer />}/>
                    <Route path='/library/:id/movies'
                           render={(props) => <MovieListContainer library-uid={props.match.params.id}
                                                                  library-type='movies'/>}/>
                    <Route path='/library/:id/shows'
                           render={(props) => <ShowListContainer library-uid={props.match.params.id}
                                                                  library-type='shows'/>}/>
                </Switch>
            </div>
        )
    }
}

export default withRouter(MainContent);