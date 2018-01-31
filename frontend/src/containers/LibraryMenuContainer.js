import React from 'react';
import MainMenu from '../components/MainMenu/MainMenu';
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom'
import {fetchLibrariesIfNeeded} from '../actions/librariesActions';


class LibraryMenuContainer extends React.Component {
    componentDidMount() {
        this.props.fetchLibraries();
    }

    render() {
        if(this.props.libraries.isFetching) return <MainMenu/>;
        return <MainMenu libraries={this.props.libraries.items} visible={this.props.visible} />
    }
}

function mapStateToProps (state) {
    return {
        libraries: state.libraries,
        visible: state.mainMenu.visible,
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
