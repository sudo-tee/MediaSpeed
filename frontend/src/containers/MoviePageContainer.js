import {connect} from "react-redux";
import {selectMovieHash} from "../reducers/index";
import MoviePage from "../components/MoviePage";
import withRouter from "react-router-dom/es/withRouter";

function mapStateToProps (state, ownProps) {
    return {
        movie: selectMovieHash(state)[ownProps['movie-uid']]
    }
}

export default withRouter(connect(
    mapStateToProps
)(MoviePage))
