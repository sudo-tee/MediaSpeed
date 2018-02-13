import React from 'react';
import {connect} from "react-redux";
import LibrarySetting from "../components/LibrarySetting";
import {startLibraryScan, updateLibrary} from '../actions/librariesActions';

function mapDispatchToProps(dispatch) {
    return {
        onStartLibraryScan: (uid) => dispatch(startLibraryScan(uid)),
        onUpdateLibrary: (library, properties) => dispatch(updateLibrary(library, properties))
    }
}

export default connect(
    null,
    mapDispatchToProps
)(LibrarySetting)
