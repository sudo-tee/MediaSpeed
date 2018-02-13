import React from 'react';
import {connect} from "react-redux";
import {selectFoldersSubPath, selectSelectedFolder} from '../reducers';
import {navigateToFolder} from '../actions/fileSystemActions';
import PathSelector from "../components/PathSelector";


const PathSelectorContainer = ({path, currentPath, subPaths, onOpened, navigateToFolder, onFolderSelected}) =>
    <PathSelector defaultPath={path}
                  currentPath={currentPath}
                  subPaths={subPaths}
                  onOpen={onOpened}
                  onNavigateToPath={navigateToFolder}
                  onFolderSelected={onFolderSelected}
    />;

function mapStateToProps (state) {
    return {
        subPaths: selectFoldersSubPath(state),
        currentPath: selectSelectedFolder(state),
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        onOpened: () =>  dispatch(navigateToFolder(props.path)),
        navigateToFolder: (path) => dispatch(navigateToFolder(path)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PathSelectorContainer)
