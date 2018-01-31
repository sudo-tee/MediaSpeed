import React from 'react';
import {connect} from "react-redux";
import Home from "../components/Home";
import {selectLibrary} from '../actions/librariesActions';


class HomeContainer extends React.Component {
    componentDidMount() {
        this.props.selectLibrary(null)
    }

    render() {

        return <Home shows={this.props.shows.items} movies={this.props.movies.items} />
    }
}

function mapDispatchToProps(dispatch) {
    return {
        selectLibrary: (uid) => dispatch(selectLibrary(uid)),
    }
}


function mapStateToProps (state) {
    return {
        movies: state.movies,
        shows: state.shows
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer)
