import React from 'react'
import BackgroundChanger from "./BackgroundChanger/BackgroundChanger";

const Home = ({shows, movies}) => (
    <div>
        <BackgroundChanger medias={[...shows, ...movies]} root-element="body"/>
        <h1>Welcome to Media Speed</h1>
    </div>
);

export default Home