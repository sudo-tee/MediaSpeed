import React from 'react';
import TopBar from '../components/TopBar/TopBar';
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom'
import {toggleMenu} from '../actions/mainMenuActions';


class TopBarContainer  extends React.Component {

    render() {
        return <TopBar onToggleMenu={this.props.toggleMenu} mainMenuVisible={this.props.mainMenuVisible}/>
    }
}

function mapStateToProps (state) {
    return {
        mainMenuVisible: state.mainMenu.visible,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        toggleMenu: () => dispatch(toggleMenu())
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(TopBarContainer))
