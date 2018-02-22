import React from 'react'
import MediaPoster from "./MediaPoster";
import {Dimmer, Dropdown, Grid, Menu} from "semantic-ui-react";

const MoviePage = ({movie}) => {
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
                <Grid stackable>
                    <Grid.Column width={4}>
                        <span>{new Date(movie.release_date).getFullYear()}</span><br />
                        <span className="runtime meta">{hours}h {minutes} min.</span>
                    </Grid.Column>
                    <Grid.Column width={12} className="meta-right">
                        {genres.map((genre, index) => <span className={'meta'} key={`genre-${genre.id}`}>{!index || ', ' }{genre.name}</span>)}
                    </Grid.Column>
                </Grid>
                <div className='media-overview-panel'>{movie.overview}</div>
                <br />
                <br />
                <br />
                <Menu compact stackable>
                    <Menu.Item as='a' icon='play' content='Play' />
                    <Menu.Item icon='step forward' content='Resume' />
                    <Menu.Item icon='unhide' content='Mark Watched' />
                    <Menu.Item >
                    <Dropdown floating button icon='ellipsis horizontal' className='icon'>
                        <Dropdown.Menu>
                            <Dropdown.Item text='Edit' />
                            <Dropdown.Item  text='Fix Match' />
                        </Dropdown.Menu>
                    </Dropdown>
                    </Menu.Item>
                </Menu>
            </Grid.Column>
        </Grid>
    );
};


export default MoviePage