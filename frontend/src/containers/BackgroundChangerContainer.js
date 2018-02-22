import React from 'react';
import {connect} from "react-redux";
import {selectCurrentPresentedMedia} from '../reducers';
import BackgroundChanger from "../BackgroundChanger";
import { withRouter } from 'react-router-dom';

function mapStateToProps (state) {
    return {
        media: selectCurrentPresentedMedia(state),
    }
}

export default withRouter(connect(
    mapStateToProps
)(BackgroundChanger))
