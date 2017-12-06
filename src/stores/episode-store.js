import LokiAdapter from './loki-adapter';

export default class EpisodeStore extends LokiAdapter {
    constructor(logger, db) {
        super(logger, db, 'episodes');
    }
}
