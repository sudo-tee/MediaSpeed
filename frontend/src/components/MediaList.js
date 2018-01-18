import React from 'react';
import MediaItem from './MediaItem';
import {Grid} from 'semantic-ui-react';

const MediaList = ({ medias }) =>
    <Grid doubling columns={5}>
        {medias.map((media) => {
            return <Grid.Column key={media.uid}>
                <MediaItem  media={media} />
            </Grid.Column>
        })}
    </Grid>;

export default MediaList;