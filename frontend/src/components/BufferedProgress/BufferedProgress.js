import React, {Component} from 'react'
import {Progress} from "semantic-ui-react";
import './BufferedProgress.css';
import Duration from "../Duration";
import PropTypes from 'prop-types';

class BufferedProgress extends Component {
    state = {
        hoverPosition: 0,
        hoverDisplay: 'none',
        hoverTime: 0
    };

    mouseMove = (e) => {
        const time = e.clientX / this.bar.offsetWidth * this.props.duration;
        let position = e.clientX - this.time.offsetWidth / 2;

        if(position < 0) position = 0;
        if(position + this.time.offsetWidth > this.bar.offsetWidth) position = this.bar.offsetWidth -  this.time.offsetWidth;
        this.setState({hoverPosition: position, hoverTime: time});
    };

    mouseEnter = (e) => this.setState({hoverDisplay: 'block'});

    mouseLeave = (e) => this.setState({hoverDisplay: 'none'});

    onClick = (e) => this.props.onSeekChange(this.state.hoverTime);
    onMouseDown = (e) => this.props.onSeekMouseDown(this.state.hoverTime);
    onMouseUp = (e) => this.props.onSeekMouseUp(this.state.hoverTime);

    ref = bar => {
        this.bar = bar
    };

    timeRef = time => {
        this.time = time
    };

    render() {
        return (
            <div ref={this.ref}
                 onMouseMove={this.mouseMove}
                 onMouseEnter={this.mouseEnter}
                 onMouseLeave={this.mouseLeave}
                 onClick={this.onClick}
                 onMouseDown={this.onMouseDown}
                 onMouseUp={this.onMouseUp}
                 className="buffered-progress">

                <div ref={this.timeRef} className="time-hover"
                     style={{bottom: 100, left: this.state.hoverPosition, display: this.state.hoverDisplay}}>
                    <Duration seconds={this.state.hoverTime}/>
                </div>

                <Progress className="played"
                          percent={this.props.played * 100} attached='top'/>
                <Progress className="buffer"
                          percent={(this.props.buffer / this.props.duration * 100) || 0}
                          attached='top'/>
            </div>)
    }
}

BufferedProgress.propTypes = {
    onSeekChange: PropTypes.func.isRequired,
    onSeekMouseDown: PropTypes.func.isRequired,
    onSeekMouseUp: PropTypes.func.isRequired
};

export default BufferedProgress;