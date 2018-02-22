import React from 'react';
import {connect} from "react-redux";
import Home from "../components/Home";
import {selectLibraryList} from '../reducers';

function mapStateToProps (state) {
    return {
        libraries: selectLibraryList(state)
    }
}

export default connect(
    mapStateToProps
)(Home)
