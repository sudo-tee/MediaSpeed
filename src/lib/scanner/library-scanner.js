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
        console.log('scanning ' + library.path);

        library.last_update = Date.now();

        if (library.type === 'movie') {
            return this.scanMovies(library);
        }

        if (library.type === 'episode') {
            return this.scanEpisodes(library);
        }

        await this.libraryService.update(library.uid, library);
    }

    async scanMovies(library) {
        const newMoviesFiles = await this.directoryScanner.getNewFiles(library.path);
        return Promise.all(
            newMoviesFiles.map(async path => this.createMovie(await this.movieInfoProvider.execute(path, library)))
        );
    }

    async scanEpisodes(library) {
        const newEpisodeFiles = await this.directoryScanner.getNewFiles(library.path);
        return Promise.all(
            newEpisodeFiles.map(async path => this.createEpisode(await this.episodeInfoProvider.execute(path, library)))
        );
    }

    async createEpisode(episode) {
        let alreadyExist = await this.episodeService.tryGet(episode.episode.uid);
        if (!alreadyExist) {
            return this.episodeService.create(episode.episode);
        }
    }

    async createMovie(movie) {
        let alreadyExist = await this.movieService.tryGet(movie.uid);

        if (!alreadyExist) {
            return this.movieService.create(movie);
        }
    }
}
