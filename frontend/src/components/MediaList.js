import React from 'react';
import MediaItem from './MediaItem';
import {Grid} from 'semantic-ui-react';

const MediaList = ({ medias, layout }) =>

    <Grid>
        {medias.map((media) => {
            return <Grid.Column
                tablet={layout === 'backdrop' ? 16 : 8}
                mobile={16}
                computer={layout === 'backdrop' ? 4 : 2}
                key={media.uid}>
                <MediaItem  media={media} layout={layout}/>
            </Grid.Column>
        })}
    </Grid>;

export default MediaList;