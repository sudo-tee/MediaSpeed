import React, {Component} from 'react'
import Home from '../../components/Home';
import {Switch, Route, withRouter} from 'react-router-dom';
import MediaListContainer from "../../containers/MediaListContainer";

class MainContent extends Component {
    render() {
        let classNames = "main-content";
        if(this.props.mainMenuVisible) classNames += " main-menu-visible";
        return (
            <div className={classNames}>
                <Switch>
                    <Route exact path='/' render={(props) => <Home library-type='movies'/>}/>
                    <Route path='/library/:id/movies'
                           render={(props) => <MediaListContainer library-uid={props.match.params.id}
                                                                  library-type='movies'/>}/>
                    <Route path='/library/:id/shows'
                           render={(props) => <MediaListContainer library-uid={props.match.params.id}
                                                                  library-type='shows'/>}/>
                </Switch>
            </div>
        )
    }
}

export default withRouter(MainContent);