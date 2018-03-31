import MediaList from '../components/MediaList';
import {connect} from "react-redux";
import {selectLibraryShows} from '../reducers';
import withRouter from "react-router-dom/es/withRouter";

function mapStateToProps (state) {
    return {
        medias: selectLibraryShows(state) || []
    }
}

export default withRouter(connect(
    mapStateToProps
)(MediaList))
