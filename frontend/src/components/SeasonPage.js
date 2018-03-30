import React from 'react'
import MediaPoster from "./MediaPoster";
import {Dimmer, Dropdown, Menu, Progress, Grid, Card} from "semantic-ui-react";
import EpisodeItem from "./EpisodeItem";

const SeasonPage = ({season, episodes, onPlay}) => {
    if (!season) return <Dimmer>Loading...</Dimmer>;
    const genres = season.genres || [];
    return (
        <Grid className='media-page' stackable>
            <Grid.Column width={4}>
                <MediaPoster media={season}/>
            </Grid.Column>
            <Grid.Column width={12}>
                <h2>{season.name}</h2>
                <div className='media-head media-page-segment'>
                    <Grid stackable>
                        <Grid.Column width={4}>
                            <span>{new Date(season.air_date).getFullYear()}</span><br/>
                        </Grid.Column>
                        <Grid.Column width={12} className="meta-right">
                            {genres.map((genre, index) => <span className={'meta'}
                                                                key={`genre-${genre.id}`}>{!index || ', '}{genre.name}</span>)}
                        </Grid.Column>
                    </Grid>
                    <Progress percent={50} size='tiny'/>
                </div>
                <div className='media-menu media-page-segment'>
                    <Menu compact stackable>
                        <Menu.Item icon='unhide' content='Mark Watched'/>
                        <Menu.Item>
                            <Dropdown floating button icon='ellipsis horizontal' className='icon'>
                                <Dropdown.Menu>
                                    <Dropdown.Item text='Edit'/>
                                    <Dropdown.Item text='Fix Match'/>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>
                    </Menu>
                </div>
                <div className='media-overview media-page-segment'>{season.overview}</div>
                <div className='media-episodes media-page-segment'>
                    <h3>Episodes</h3>
                    <Card.Group doubling>
                        {episodes.map((episode) => {
                            return <EpisodeItem onPlay={onPlay} media={episode} layout={'backdrop'} key={'episode-' + episode.uid}/>
                        })}
                    </Card.Group>
                </div>
            </Grid.Column>
        </Grid>
    );
};


export default SeasonPage