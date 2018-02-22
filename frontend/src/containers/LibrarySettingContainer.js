import {connect} from "react-redux";
import LibrarySetting from "../components/LibrarySetting";
import {deleteLibrary, startLibraryScan, updateLibrary} from '../actions/librariesActions';

function mapDispatchToProps(dispatch) {
    return {
        onStartLibraryScan: (uid) => dispatch(startLibraryScan(uid)),
        onUpdateLibrary: (library, properties) => dispatch(updateLibrary(library, properties)),
        onDeleteLibrary: (library, properties) => dispatch(deleteLibrary(library))
    }
}

export default connect(
    null,
    mapDispatchToProps
)(LibrarySetting)
