export default class BaseService {
    constructor(episodeService, movieService, seasonService, showService) {
        this.episodeService = episodeService;
        this.movieService = movieService;
        this.seasonService = seasonService;
        this.showService = showService;
    }

    get(service) {
        if (!this[service + 'Service']) {
            throw Error(`Service [${service}] not found`);
        }
        return this[service + 'Service'];
    }
}
