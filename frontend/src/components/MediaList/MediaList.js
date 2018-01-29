import React from 'react';
import MediaItem from '../MediaItem/MediaItem';
import {Grid} from 'semantic-ui-react';
import './MediaList.css';
import BackgroundChanger from "../BackgroundChanger/BackgroundChanger";

const MediaList = ({ medias }) =>

    <Grid doubling columns={6}>
        <BackgroundChanger medias={medias} root-element="body"/>
        {medias.map((media) => {
            return <Grid.Column key={media.uid}>
                <MediaItem  media={media} />
            </Grid.Column>
        })}
    </Grid>;

export default MediaList;