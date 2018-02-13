import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom'
import {Provider} from "react-redux";
import configureStore from './store/store'

import registerServiceWorker from './registerServiceWorker';
import "semantic-ui-forest-themes/semantic.superhero.css";

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter basename="/web">
            <App />
        </BrowserRouter>
    </Provider>
    ,document.getElementById('root')
);
registerServiceWorker();