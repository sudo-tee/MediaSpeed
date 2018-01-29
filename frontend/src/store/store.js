import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import reducers from '../reducers'

const loggerMiddleware = createLogger();

export default function configureStore() {
    return createStore(reducers, applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions
        loggerMiddleware // neat middleware that logs actions
    ));
}