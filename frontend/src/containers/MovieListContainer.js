import MediaList from '../components/MediaList';
import {connect} from "react-redux";
import {selectLibraryMovies} from '../reducers';
import withRouter from "react-router-dom/es/withRouter";
import uuid from 'uuid/v4';

function mapStateToProps (state) {
    return {
        medias: selectLibraryMovies(state) || []
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        //@TODO refator with context API ?...
        onPlay: (media) => {
            let session = uuid(Math.random().toString(36).slice(2) + media.uid);
            ownProps.history.push(`/play/movies/${media.uid}?session=${session}`)
        }
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(MediaList))

