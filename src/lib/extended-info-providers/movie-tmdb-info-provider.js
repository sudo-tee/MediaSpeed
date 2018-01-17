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
        try {
            let movieResult = await this.searchMovie(movie.title);
            movie.tmdb_id = movieResult.id;

            let movieDetails = await this.getMovieDetails(movie.tmdb_id);

            return {
                ...movie,
                ...{
                    tmdb_id: movieDetails.id,
                    tmdb_backdrop_path: movieDetails.backdrop_path,
                    tmdb_poster_path: movieDetails.poster_path,
                    year: movieDetails.year,
                    container: movieDetails.container,
                    title: movieDetails.title,
                    adult: movieDetails.adult,
                    budget: movieDetails.budget,
                    genres: movieDetails.genres,
                    homepage: movieDetails.homepage,
                    imdb_id: movieDetails.imdb_id,
                    original_language: movieDetails.original_language,
                    original_title: movieDetails.original_title,
                    overview: movieDetails.overview,
                    popularity: movieDetails.popularity,
                    production_companies: movieDetails.production_companies,
                    production_countries: movieDetails.production_countries,
                    release_date: movieDetails.release_date,
                    revenue: movieDetails.revenue,
                    runtime: movieDetails.runtime,
                    spoken_languages: movieDetails.spoken_languages,
                    status: movieDetails.status,
                    tagline: movieDetails.tagline,
                    vote_average: movieDetails.vote_average,
                    vote_count: movieDetails.vote_count
                }
            };
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
