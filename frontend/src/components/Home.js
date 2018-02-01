import React from 'react'
import LatestMoviesWidgetContainer from "../containers/LatestMoviesWidgetContainer";
import LatestShowsWidgetContainer from "../containers/LatestShowsWidgetContainer";

const Home = ({libraries}) => (
    <div>
        {libraries.map((lib) => lib.type === 'movie' ? <LatestMoviesWidgetContainer library={lib} /> :  <LatestShowsWidgetContainer library={lib} />)}
    </div>
);

export default Home