import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import screenfull from 'screenfull'
import ReactPlayer from 'react-player'
import Duration from './Duration'
import {Button, Grid, Icon} from "semantic-ui-react";
import BufferedProgress from './BufferedProgress/BufferedProgress';
import VolumeSliderButton from "./VolumeSliderButton/VolumeSliderButton";

class VideoPlayer extends Component {
    mouseTimeout = null;
    state = {
        url: null,
        playing: true,
        volume: 0.8,
        muted: false,
        played: 0,
        loaded: 0,
        buffer: 0,
        duration: 0,
        playbackRate: 1.0,
        fullscreen: false,
        controlsHidden: false
    };

    load = url => {
        this.setState({
            url,
            played: 0,
            loaded: 0,
        })
    };

    componentDidMount() {
        this.loadMedia();
    }

    loadMedia = () => {
        const url = `/hls/${this.props.media.type}/${this.props.media.uid}/index.m3u8?session=${this.props.session}`;
        this.load(url);
    };

    playPause = () => {
        if (!this.state.loaded) {
            this.loadMedia();
            return;
        }
        this.setState({playing: !this.state.playing});

        if(this.state.playing) this.hideControls();

    };

    stop = () => {
        this.setState({playing: false})
    };

    setVolume = e => {
        this.setState({volume: parseFloat(e.target.value)})
    };

    toggleMuted = () => {
        this.setState({muted: !this.state.muted})
    };

    onPlay = () => {
        this.setState({playing: true})
    };

    onPause = () => {
        this.setState({playing: false})
    };

    onSeekMouseDown = time => {
        this.setState({seeking: true})
    };

    onSeekChange = time => {
        this.setState({played: parseFloat(time / this.state.duration)})
    };

    onSeekMouseUp = time => {
        this.setState({seeking: false});
        this.player.seekTo(parseFloat(time))
    };

    onProgress = state => {
        const bf = this.player.getInternalPlayer().buffered;
        const time = this.player.getInternalPlayer().currentTime;

        for (let i = bf.length - 1; i >= 0; i--) {
            if (bf.end(i) > time && bf.start(i) < time) {
                state.buffer = bf.end(i);
            }
        }
        // We only want to update the buffer
        if (!this.state.seeking) {
            this.setState(state)
        }
    };

    onEnded = () => {
        this.setState({playing: this.state.loop})
    };

    onDuration = (duration) => {
        this.setState({duration})
    };

    onClickFullscreen = () => {
        screenfull.toggle(findDOMNode(this.container));
        this.setState({fullscreen: !this.state.fullscreen})
    };

    onClickBack = () => {
        clearTimeout(this.mouseTimeout);
        this.props.onSessionStopped(this.props.session, this.props.media);
    };

    hideControls = (e) => {
        if(!this.state.controlsHidden) this.setState({controlsHidden: true})
    };

    showControls = (e) => {
        this.setState({controlsHidden: false});
        if(this.state.playing) {
            clearTimeout(this.mouseTimeout);
            this.mouseTimeout = setTimeout(() => this.hideControls(e), 3000);
        }
    };

    keepControls = (e) => {
        e.stopPropagation();
        clearTimeout(this.mouseTimeout);
        this.setState({controlsHidden: false});
    };

    ref = player => {
        this.player = player
    };

    containerRef = container => {
        this.container = container
    };

    render() {
        const {url, playing, volume, muted, loop, played, loaded, duration, playbackRate, buffer} = this.state;

        return (
            <div className="video-player" ref={this.containerRef} onMouseMove={this.showControls}>

                <div className={"header-bar" + (this.state.controlsHidden ? ' hidden' : '')}>
                    <Grid>
                        <Grid.Column width={1}>
                            <Button onClick={this.onClickBack} icon ><Icon inverted size={'large'} name='arrow left'/></Button>
                        </Grid.Column>
                        <Grid.Column width={15}>
                            <span>{this.props.title}</span>
                        </Grid.Column>
                    </Grid>
                </div>
                <div className='player-wrapper'>
                    <ReactPlayer
                        ref={this.ref}
                        className='react-player'
                        width='100%'
                        height='100%'
                        url={url}
                        playing={playing}
                        loop={loop}
                        playbackRate={playbackRate}
                        volume={volume}
                        muted={muted}
                        onReady={() => console.log('onReady')}
                        onStart={() => console.log('onStart')}
                        onPlay={this.onPlay}
                        onPause={this.onPause}
                        onSeek={e => console.log('onSeek', e)}
                        onEnded={this.onEnded}
                        onError={e => console.log('onError', e)}
                        onProgress={this.onProgress}
                        onDuration={this.onDuration}
                    />
                </div>
                <div className={"control-bar" + (this.state.controlsHidden ? ' hidden' : '')} onMouseMove={this.keepControls}>
                    <BufferedProgress duration={duration} buffer={buffer} played={played}
                                      onSeekMouseDown={this.onSeekMouseDown}
                                      onSeekChange={this.onSeekChange}
                                      onSeekMouseUp={this.onSeekMouseUp}
                    />

                    <div className="controls">
                        <Grid>
                            <Grid.Column width={3}>
                                <Button.Group icon>
                                    <Button>
                                        <Icon name='backward'/>
                                    </Button>
                                    <Button onClick={this.playPause}>
                                        <Icon name={playing && loaded ? 'pause' : 'play'}/>
                                    </Button>
                                    <Button>
                                        <Icon name='forward'/>
                                    </Button>
                                </Button.Group>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <div className="time">
                                    <Duration seconds={duration * played}/>
                                    &nbsp;/&nbsp;
                                    <Duration seconds={duration}/>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Button.Group icon floated='right'>
                                    <VolumeSliderButton
                                        width={75} volume={volume} muted={muted}
                                        onVolumeChange={this.setVolume}
                                        onToggleMute={this.toggleMuted}/>
                                    <Button>
                                        <Icon name='closed captioning'/>
                                    </Button>
                                    <Button onClick={this.onClickFullscreen}>
                                        <Icon name={'window ' + (this.state.fullscreen ? 'minimize' : 'maximize')}/>
                                    </Button>

                                </Button.Group>
                            </Grid.Column>
                        </Grid>
                    </div>
                </div>
            </div>
        )
    }
}

export default VideoPlayer;