import React from 'react';
import {connect} from "react-redux";
import {selectLatestShowsByLibraries} from '../reducers';
import LibraryWidget from "../components/LibraryWidget";


const LatestShowsWidgetContainer = ({library, showsByLibraries}) => (
    <LibraryWidget medias={showsByLibraries  || []} title={'Latest ' + library.name} maxDisplay={4} />
);

function mapStateToProps (state, props) {
    return {
        showsByLibraries: selectLatestShowsByLibraries(state)[props.library.uid],
    }
}

export default connect(
    mapStateToProps
)(LatestShowsWidgetContainer)
