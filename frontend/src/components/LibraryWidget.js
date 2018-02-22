import React from 'react'
import MediaList from "./MediaList";

const LibraryWidget = ({medias, title, maxDisplay, layout}) => (
    <div className="widget">
        <h2>{title}</h2>
        <MediaList medias={medias.slice(0, maxDisplay)} layout={layout} columns={maxDisplay}/>
    </div>
);

export default LibraryWidget