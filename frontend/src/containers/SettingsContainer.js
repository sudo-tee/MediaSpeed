import React from 'react';
import {connect} from "react-redux";
import {selectLibraryList} from '../reducers';
import {startLibraryscanScan} from '../actions/librariesActions';

import Settings from "../components/Settings";


const SettingsContainer = ({libraries, startLibraryscanScan}) => <Settings libraries={libraries} onStartLibraryScan={startLibraryscanScan}/>;

function mapStateToProps (state) {
    return {
        libraries: selectLibraryList(state)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        startLibraryscanScan: (uid) => dispatch(startLibraryscanScan(uid)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsContainer)
