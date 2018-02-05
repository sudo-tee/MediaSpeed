import React from 'react';
import {connect} from "react-redux";
import Home from "../components/Home";
import {selectLibrary} from '../actions/librariesActions';

import {selectLibraryList} from '../reducers';


class HomeContainer extends React.Component {
    componentDidMount() {
        this.props.selectLibrary(null);
    }

    render() {
        return <Home libraries={this.props.libraries}/>
    }
}

function mapDispatchToProps(dispatch) {
    return {
        selectLibrary: (uid) => dispatch(selectLibrary(uid)),
    }
}

function mapStateToProps (state) {
    return {
        libraries: selectLibraryList(state)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer)
