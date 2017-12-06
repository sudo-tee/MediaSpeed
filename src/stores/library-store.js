import LokiAdapter from './loki-adapter';

export default class LibraryStore extends LokiAdapter {
    constructor(logger, db) {
        super(logger, db, 'libraries');
    }
}
