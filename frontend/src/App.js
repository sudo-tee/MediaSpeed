import React, {Component} from 'react';
import LibraryMenuContainer from './containers/LibraryMenuContainer';
import TopbarContainer from './containers/TopbarContainer';
import './App.css'
import MainContentContainer from "./containers/MainContentContainer";
import BackgroundChangerContainer from "./containers/BackgroundChangerContainer";
import {withRouter} from 'react-router-dom'
import {connect} from "react-redux";
import {routeChanged} from "./actions/routerAction"


class App extends Component {
    componentWillMount() {
        console.log('APP STARTED', this.props.match, this.props.history, this.props);
        this.props.routeChanged(this.props.history.location, this.props.match);
        this.props.history.listen(location => this.props.routeChanged(location, this.props.match));
    }

    render() {
        return (
            <div>
                <BackgroundChangerContainer rootElement='body'/>
                <TopbarContainer/>
                <LibraryMenuContainer/>
                <MainContentContainer />
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
        routeChanged: (location, match) => dispatch(routeChanged(location, match))
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(App))
