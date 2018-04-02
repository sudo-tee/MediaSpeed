import React from 'react';
import MediaItem from './MediaItem';
import {Card} from 'semantic-ui-react';

const MediaList = ({ medias, layout, playable }) =>
    <Card.Group doubling columns={8}>
        {medias.map((media) => {
            return <MediaItem playable={playable} key={media.uid} media={media} layout={layout} />
        })}
    </Card.Group>;

export default MediaList;