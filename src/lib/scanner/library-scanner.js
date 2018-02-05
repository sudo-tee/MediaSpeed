import EventsEnum from '../events-enum';

export default class LibraryScanner {
    constructor(
        directoryScanner,
        movieScanner,
        episodeScanner,
        movieService,
        libraryService,
        eventEmitter,
        deletedFilesPurger,
        logger,
        throttledQueue
    ) {
        this.directoryScanner = directoryScanner;
        this.movieScanner = movieScanner;
        this.episodeScanner = episodeScanner;
        this.movieService = movieService;
        this.libraryService = libraryService;
        this.eventEmitter = eventEmitter;
        this.deletedFilesPurger = deletedFilesPurger;
        this.logger = logger;
        this.queue = throttledQueue(3, 1000, true);

        this.eventEmitter.on(EventsEnum.LIBRARY_SCAN_STARTED, async library => {
            library.scanning = true;
            library.scanning_progress = 0;
            await this.libraryService.update(library.uid, library);
        });

        this.eventEmitter.on(EventsEnum.LIBRARY_SCAN_ENDED, async library => {
            library.scanning = false;
            library.scanning_progress = 0;
            await this.libraryService.update(library.uid, library);
        });
    }

    async scan(library) {
        await this.deletedFilesPurger.execute(library);

        this.logger.info('Scanning ' + library.path);
        this.eventEmitter.emit(EventsEnum.LIBRARY_SCAN_STARTED, library);

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

        library.scanning_progress = 0;
        await this.libraryService.update(library.uid, library);

        for (const index in newMoviesFiles) {
            const path = newMoviesFiles[index];

            this.queue(async () => {
                await this.movieScanner.execute(path, library);
                library.scanning_progress = index / (newMoviesFiles.length - 1) * 100;
                await this.libraryService.update(library.uid, library);

                if (library.scanning_progress === 100) {
                    this.eventEmitter.emit(EventsEnum.LIBRARY_SCAN_ENDED, library);
                }
            });
        }
    }

    async scanEpisodes(library) {
        const newEpisodeFiles = await this.directoryScanner.getNewFiles(library.path);

        console.log(newEpisodeFiles.length);

        library.scanning_progress = 0;
        await this.libraryService.update(library.uid, library);

        for (const index in newEpisodeFiles) {
            const path = newEpisodeFiles[index];

            this.queue(async () => {
                await this.episodeScanner.execute(path, library);
                library.scanning_progress = index / (newEpisodeFiles.length - 1) * 100;
                await this.libraryService.update(library.uid, library);

                if (library.scanning_progress === 100) {
                    this.eventEmitter.emit(EventsEnum.LIBRARY_SCAN_ENDED, library);
                }
            });
        }
    }
}
