import React from 'react'
import MediaPoster from "./MediaPoster";
import {Dimmer, Dropdown, Grid, Menu, Progress} from "semantic-ui-react";

const MoviePage = ({movie, onPlay}) => {
    if (!movie) return <Dimmer>Loading...</Dimmer>;
    const {hours, minutes} = ((time) => ({hours: Math.trunc(time/60), minutes:time%60}))(movie.runtime);
    const genres = movie.genres || [];
    return (
        <Grid className='media-page' stackable>
            <Grid.Column width={4}>
                <MediaPoster media={movie}/>
            </Grid.Column>
            <Grid.Column width={12}>
                <h2>{movie.title}</h2>
                <div className='media-head media-page-segment'>
                    <Grid stackable>
                        <Grid.Column width={4}>
                            <span>{new Date(movie.release_date).getFullYear()}</span><br />
                            <span className="runtime meta">{hours}h {minutes} min.</span>
                        </Grid.Column>
                        <Grid.Column width={12} className="meta-right">
                            {genres.map((genre, index) => <span className={'meta'} key={`genre-${genre.id}`}>{!index || ', ' }{genre.name}</span>)}
                        </Grid.Column>
                    </Grid>
                    <Progress percent={50} size='tiny'/>
                </div>
                <div className='media-menu media-page-segment'>
                    <Menu compact stackable>
                        <Menu.Item icon='play' content='Play' onClick={onPlay}/>
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
                <div className='media-overview media-page-segment'>{movie.overview}</div>

            </Grid.Column>
        </Grid>
    );
};


export default MoviePage