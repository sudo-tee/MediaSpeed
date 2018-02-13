import React from 'react';
import {connect} from "react-redux";
import {selectLibraryList} from '../reducers';
import Settings from "../components/Settings";


function mapStateToProps (state) {
    return {
        libraries: selectLibraryList(state)
    }
}

export default connect(
    mapStateToProps,
)(Settings)
