import memoize from 'memoized-decorator';
import EventsEnum from '../events-enum';

export default class MovieTmdbInfoProvider {
    constructor(movieDbApi, logger, eventEmitter, movieService) {
        this.movieDbApi = movieDbApi;
        this.logger = logger;
        this.eventEmitter = eventEmitter;
        this.movieService = movieService;

        this.eventEmitter.on(EventsEnum.MOVIE_CREATED, movie => this.execute(movie));
    }

    async execute(movie) {
        const movieInfo = await this.getMovieInfo(movie);

        movie = { ...movie, ...movieInfo };

        await this.movieService.update(movie.uid, movie);
        this.eventEmitter.emit(EventsEnum.TMDB_INFO_UPDATED, movie);
    }

    async getMovieInfo(movie) {
        // console.log('fetching information for ' + item.title);
        try {
            let movieResult = await this.searchMovie(movie.title);
            movie.tmdb_movie_id = movieResult.id;

            let movieDetails = await this.getMovieDetails(movie.tmdb_movie_id);

            return { ...movie, ...movieDetails };
        } catch (err) {
            return movie;
        }
    }

    @memoize
    async searchMovie(title, year) {
        this.logger.debug('no cache searchMovie', title);

        return this.movieDbApi.searchMovie({
            query: title,
            year: year
        });
    }

    @memoize
    async getMovieDetails(movieId) {
        this.logger.debug('no cache getMovieDetails', movieId);

        return this.movieDbApi.movieInfo({
            id: movieId
        });
    }
}
