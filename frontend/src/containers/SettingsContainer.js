import React from 'react';
import {connect} from "react-redux";
import {selectLibraryList} from '../reducers';
import Settings from "../components/Settings";
import {createLibrary} from "../actions/librariesActions";


function mapStateToProps (state) {
    return {
        libraries: selectLibraryList(state)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onCreateLibrary: (library, properties) => dispatch(createLibrary(library, properties))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Settings)
