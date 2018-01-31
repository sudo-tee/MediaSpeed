import React from 'react'
import MediaList from "./MediaList/MediaList";

const LibraryWidget = ({medias, title, maxDisplay}) => (
    <div>
        <h2>{title}</h2>
        <MediaList medias={medias.splice(0, maxDisplay)} />
    </div>
);

export default LibraryWidget