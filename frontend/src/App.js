import React, {Component} from 'react';
import {Container, Image, Segment} from 'semantic-ui-react'
import Home from './components/Home';
import MediaListContainer from './containers/MediaListContainer';
import LibraryMenuContainer from './containers/LibraryMenuContainer';
import {Switch, Route} from 'react-router-dom'


class App extends Component {
    render() {
        return (
            <div>
                <LibraryMenuContainer/>
                <Container fluid style={{padding: '3em'}}>
                    <Switch>
                        <Route exact path='/' render={(props) => <Home library-type='movies'/>}/>
                        <Route path='/library/:id/movies' render={(props) => <MediaListContainer library-uid={props.match.params.id} library-type='movies'/>} />
                        <Route path='/library/:id/shows' render={(props) => <MediaListContainer library-uid={props.match.params.id} library-type='shows'/>} />
                    </Switch>
                </Container>

                <Segment inverted>
                    <Container textAlign='center'>
                        <a href='https://github.com/inkubux/MediaSpeed'>
                            <Image
                                centered
                                size='mini'
                                src='/logo.png'
                            />
                            Github
                        </a>
                    </Container>
                </Segment>
            </div>
        );
    }
}

export default App;
