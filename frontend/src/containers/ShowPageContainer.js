import React, {Component} from 'react';
import {connect} from "react-redux";
import {selectShowHash, selectSeasonsForCurrentShow} from "../reducers/index";
import ShowPage from "../components/ShowPage";
import {fetchSeasonsIfNeeded} from "../actions/seasonsActions";


class ShowPageContainer extends Component {
    componentWillMount() {
        console.log('MOUNT', this.props.show);
        if(this.props.show)
            this.props.fetchSeasons(this.props.show);
    }
    componentWillReceiveProps(nextProps) {
        console.log('RECDIVEPROPS', nextProps);
        if(nextProps.show !== this.show) {
            console.log('ssssss');
            this.props.fetchSeasons(nextProps.show);
        }
    }

    render() {
        return <ShowPage {...this.props} />
    }
}

function mapStateToProps (state, ownProps) {
    return {
        show: selectShowHash(state)[ownProps['show-uid']],
        seasons: selectSeasonsForCurrentShow(state),
    }
}

function mapDispatchToProps (dispatch) {
    return {
        fetchSeasons: (show) => dispatch(fetchSeasonsIfNeeded(show))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ShowPageContainer)
