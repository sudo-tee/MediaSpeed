export default class LibraryScanner {
    constructor(
        directoryScanner,
        movieInfoProvider,
        episodeInfoProvider,
        movieService,
        libraryService,
        episodeService,
        logger
    ) {
        // movieService, showService, seasonService, episodeService

        this.directoryScanner = directoryScanner;
        this.movieInfoProvider = movieInfoProvider;
        this.episodeInfoProvider = episodeInfoProvider;
        this.movieService = movieService;
        this.libraryService = libraryService;
        this.episodeService = episodeService;
        this.logger = logger;
    }

    async scan(library) {
        try {
            console.log('scanning ' + library.path);

            library.last_update = Date.now();
            await this.libraryService.update(library.uid, library);

            if (library.type === 'movie') return this.scanMovies(library);
            if (library.type === 'episode') return this.scanEpisodes(library);
        } catch (err) {
            this.logger.debug('Unable to scan');
        }
    }

    async scanMovies(library) {
        const newMoviesFiles = await this.directoryScanner.getNewFiles(library.path);
        return Promise.all(
            newMoviesFiles.map(async path =>
                this.movieService.create(await this.movieInfoProvider.execute(path, library))
            )
        );
    }

    async scanEpisodes(library) {
        const newEpisodeFiles = await this.directoryScanner.getNewFiles(library.path);

        return Promise.all(
            newEpisodeFiles.map(async path => this.createEpisode(await this.episodeInfoProvider.execute(path, library)))
        );
    }

    async createEpisode(episode) {
        this.episodeService.create(episode.episode);
    }
}
