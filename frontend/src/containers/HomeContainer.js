import {connect} from "react-redux";
import Home from "../components/Home";
import {selectLibraryList, selectRandomShowOrMovie} from '../reducers';

function mapStateToProps (state) {
    return {
        libraries: selectLibraryList(state),
        randomMedia: selectRandomShowOrMovie(state)
    }
}

export default connect(
    mapStateToProps
)(Home)
