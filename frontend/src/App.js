import React, {Component} from 'react';
import LibraryMenuContainer from './containers/LibraryMenuContainer';
import TopbarContainer from './containers/TopbarContainer';
import './App.css'
import MainContentContainer from "./containers/MainContentContainer";

class App extends Component {

    render() {
        return (
            <div>
                <TopbarContainer/>
                <LibraryMenuContainer/>
                <MainContentContainer />
            </div>
        );
    }
}

export default App;