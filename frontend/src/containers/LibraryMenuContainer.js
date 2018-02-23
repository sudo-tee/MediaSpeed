import React from 'react';
import MainMenu from '../components/MainMenu';
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom'
import {fetchLibrariesIfNeeded} from '../actions/librariesActions';
import {selectLibraryList, selectCurrentMediaSelection} from "../reducers/index";


class LibraryMenuContainer extends React.Component {
    componentDidMount() {
        this.props.fetchLibraries();
    }

    render() {

        if(this.props.libraries.isFetching) return <MainMenu/>;
        return <MainMenu libraries={this.props.libraries} visible={this.props.visible} mediaSelection={this.props.mediaSelection}/>
    }

    shouldComponentUpdate ( ) {
        return true
    }
}

function mapStateToProps (state) {
    return {
        libraries: selectLibraryList(state),
        visible: state.mainMenu.visible,
        mediaSelection: selectCurrentMediaSelection(state)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchLibraries: () => dispatch(fetchLibrariesIfNeeded()),
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(LibraryMenuContainer))
