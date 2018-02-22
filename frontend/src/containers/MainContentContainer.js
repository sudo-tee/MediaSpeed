import React from 'react';
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom'
import {toggleMenu} from '../actions/mainMenuActions';
import MainContent from "../components/MainContent";
import {fetchMoviesIfNeeded} from '../actions/moviesActions';
import {fetchShowsIfNeeded} from '../actions/showsActions';


class MainMenuContainer  extends React.Component {
    componentDidMount() {
        this.props.fetchMovies();
        this.props.fetchShows();
    }

    render() {
        return <MainContent mainMenuVisible={this.props.mainMenuVisible}/>
    }
}

function mapStateToProps (state) {
    return {
        mainMenuVisible: state.mainMenu.visible,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        toggleMenu: () => dispatch(toggleMenu()),
        fetchMovies: () => dispatch(fetchMoviesIfNeeded()),
        fetchShows: () => dispatch(fetchShowsIfNeeded()),
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(MainMenuContainer))
