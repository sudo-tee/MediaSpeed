export default class LibraryScanner {
    constructor(
        directoryScanner,
        movieInfoProvider,
        episodeInfoProvider,
        movieService,
        libraryService,
        episodeService,
        showService,
        seasonService,
        logger
    ) {
        this.directoryScanner = directoryScanner;
        this.movieInfoProvider = movieInfoProvider;
        this.episodeInfoProvider = episodeInfoProvider;
        this.movieService = movieService;
        this.libraryService = libraryService;
        this.episodeService = episodeService;
        this.showService = showService;
        this.seasonService = seasonService;
        this.logger = logger;
    }

    async scan(library) {
        this.logger.info('scanning ' + library.path);

        library.last_update = Date.now();
        await this.libraryService.update(library.uid, library);

        if (library.type === 'movie') {
            return this.scanMovies(library);
        }

        if (library.type === 'episode') {
            return this.scanEpisodes(library);
        }
    }

    async scanMovies(library) {
        const newMoviesFiles = await this.directoryScanner.getNewFiles(library.path);
        return Promise.all(
            newMoviesFiles.map(async path => this.createMovie(await this.movieInfoProvider.execute(path, library)))
        );
    }

    async scanEpisodes(library) {
        const newEpisodeFiles = await this.directoryScanner.getNewFiles(library.path);
        const shows = {};
        const seasons = {};
        await Promise.all(
            newEpisodeFiles.map(async path => {
                const episode = await this.episodeInfoProvider.execute(path, library);
                shows[episode.show.uid] = episode.show;
                seasons[episode.season.uid] = episode.season;
                return this.createEpisode(episode.episode);
            })
        );

        await Promise.all(Object.entries(shows).map(show => this.createShow(show[1])));
        await Promise.all(Object.entries(seasons).map(season => this.createSeason(season[1])));
    }

    async createEpisode(episode) {
        let alreadyExist = await this.episodeService.tryGet(episode.uid);
        if (alreadyExist) return true;

        return this.episodeService.create(episode);
    }

    async createShow(show) {
        let alreadyExist = await this.showService.tryGet(show.uid);
        if (alreadyExist) return true;

        return this.showService.create(show);
    }

    async createSeason(season) {
        let alreadyExist = await this.seasonService.tryGet(season.uid);
        if (alreadyExist) return true;

        return this.seasonService.create(season);
    }

    async createMovie(movie) {
        let alreadyExist = await this.movieService.tryGet(movie.uid);
        if (alreadyExist) return true;

        return this.movieService.create(movie);
    }
}
