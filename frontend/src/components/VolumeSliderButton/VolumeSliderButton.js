import React from 'react'
import {Button, Icon} from "semantic-ui-react";
import './VolumeSliderButton.css'

const getVolume = (volume, muted) => {

    if(volume === 0 || muted) return 'off';
    if(volume <= 0.5) return 'down';

    return 'up';
};

const VolumeSliderButton = ({volume, width, muted, onVolumeChange, onToggleMute}) =>
    <Button className={'volume-slider' + (muted ? ' muted' : '')} style={{width:width + 60}}>
        <Icon className="volume-slider-icon" name={'volume ' + getVolume(volume, muted)} onClick={onToggleMute}/>
        <div className="volume-slider-bar" style={{width:width}}>
            <span className='volume-progress' style={{width: ((volume * width)) + 'px'}}> </span>
            <input
                type='range'
                min={0}
                max={1}
                step='any'
                value={volume}
                onChange={onVolumeChange}
                style={{width:width}}
            />
        </div>
    </Button>;

export default VolumeSliderButton