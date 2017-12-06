import LokiAdapter from './loki-adapter';

export default class SeasonStore extends LokiAdapter {
    constructor(logger, db) {
        super(logger, db, 'seasons');
    }
}
