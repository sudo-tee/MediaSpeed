import React from 'react';
import {connect} from "react-redux";
import Home from "../components/Home";


class HomeContainer extends React.Component {

    render() {

        return <Home shows={this.props.shows.items} movies={this.props.movies.items} />
    }
}

function mapStateToProps (state) {
    return {
        movies: state.movies,
        shows: state.shows
    }
}

export default connect(
    mapStateToProps
)(HomeContainer)
