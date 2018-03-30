import MediaList from '../components/MediaList';
import {connect} from "react-redux";
import {selectLibraryShows} from '../reducers';
import withRouter from "react-router-dom/es/withRouter";
import uuid from 'uuid/v4';

function mapStateToProps (state) {
    return {
        medias: selectLibraryShows(state) || []
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onPlay: () => {
            let session = uuid(Math.random().toString(36).slice(2) + ownProps['movie-uid']);
            ownProps.history.push(`/play/movies/${ownProps['movie-uid']}?session=${session}`)
        }
    }

}

export default withRouter(connect(
    mapStateToProps
)(MediaList))
