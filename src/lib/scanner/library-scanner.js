export default class LibraryScanner {
    constructor(directoryScanner, movieScanner, episodeScanner, movieService, libraryService, logger, throttledQueue) {
        this.directoryScanner = directoryScanner;
        this.movieScanner = movieScanner;
        this.episodeScanner = episodeScanner;
        this.movieService = movieService;
        this.libraryService = libraryService;
        this.logger = logger;
        this.queue = throttledQueue(3, 1000, true);
    }

    async scan(library) {
        this.logger.info('Scanning ' + library.path);

        library.last_update = Date.now();
        await this.libraryService.update(library.uid, library);

        if (library.type === 'movie') {
            await this.scanMovies(library);
        }

        if (library.type === 'episode') {
            await this.scanEpisodes(library);
        }

        this.logger.info('Finished scanning ' + library.path);
    }

    async scanMovies(library) {
        const newMoviesFiles = await this.directoryScanner.getNewFiles(library.path);
        for (const index in newMoviesFiles) {
            const path = newMoviesFiles[index];

            this.queue(async () => this.movieScanner.execute(path, library));
        }
    }

    async scanEpisodes(library) {
        const newEpisodeFiles = await this.directoryScanner.getNewFiles(library.path);
        for (const index in newEpisodeFiles) {
            const path = newEpisodeFiles[index];

            this.queue(async () => this.episodeScanner.execute(path, library));
        }
    }
}
