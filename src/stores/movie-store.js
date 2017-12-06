import LokiAdapter from './loki-adapter'

export default class MovieStore extends LokiAdapter {
    constructor(logger, db) {
        super(logger, db, 'movies');
    }
}