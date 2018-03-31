import React from 'react'
import LatestMoviesWidgetContainer from "../containers/LatestMoviesWidgetContainer";
import LatestShowsWidgetContainer from "../containers/LatestShowsWidgetContainer";
import BackgroundChanger from "../BackgroundChanger";

const Home = ({libraries, randomMedia}) => (
    <div>
        <BackgroundChanger media={randomMedia} />
        {libraries.map((lib) => lib.type === 'movie' ? <LatestMoviesWidgetContainer library={lib} key={lib.uid} /> :  <LatestShowsWidgetContainer library={lib} key={lib.uid}/>)}
    </div>
);

export default Home