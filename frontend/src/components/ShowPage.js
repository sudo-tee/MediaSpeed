import React from 'react'
import MediaPoster from "./MediaPoster";
import {Dimmer, Dropdown, Grid, Menu, Progress} from "semantic-ui-react";
import SeasonItem from "./SeasonItem";

const ShowPage = ({show, seasons}) => {
    console.log('seasons', seasons);
    if (!show) return <Dimmer>Loading...</Dimmer>;
    const genres = show.genres || [];
    return (
        <Grid className='media-page' stackable>
            <Grid.Column width={4}>
                <MediaPoster media={show}/>
            </Grid.Column>
            <Grid.Column width={12}>
                <h2>{show.name}</h2>
                <div className='media-head media-page-segment'>
                    <Grid stackable>
                        <Grid.Column width={4}>
                            <span>{new Date(show.first_air_date).getFullYear()}</span><br/>
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
                        <Menu.Item as='a' icon='play' content='Play'/>
                        <Menu.Item icon='step forward' content='Resume'/>
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
                <div className='media-overview media-page-segment'>{show.overview}</div>
                <div className='media-seasons media-page-segment'>
                    <h3>Seasons</h3>
                    <Grid>
                        {seasons.map((season) => {
                            return <Grid.Column tablet={8} mobile={16} computer={4} key={season.uid}>
                                <SeasonItem media={season} layout={'backdrop'}/>
                            </Grid.Column>

                        })}
                    </Grid>
                </div>
            </Grid.Column>

        </Grid>
    );
};


export default ShowPage