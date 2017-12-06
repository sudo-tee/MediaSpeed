import LokiAdapter from './loki-adapter';

export default class ShowStore extends LokiAdapter {
    constructor(logger, db) {
        super(logger, db, 'shows');
    }
}
