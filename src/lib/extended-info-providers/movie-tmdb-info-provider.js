export default class MovieTmdbInfoProvider {
    constructor(movieDbApi) {
        this.movieDbApi = movieDbApi;
    }

    async execute(movie) {
        const movieInfo = await this.getMovieInfo(movie);

        return { ...movie, ...movieInfo };
    }

    async getMovieInfo(item) {
        console.log('fetching information for ' + item.title);

        let shows = await this.searchMovie(item.title);

        if (!shows.results.length) {
            return item;
        }
        item.tmdb_movie_id = shows.results[0].id;

        let movieDetails = await this.getMovieDetails(item.tmdb_movie_id);

        return { ...item, ...movieDetails };
    }

    // @todo memoize
    async searchMovie(title, year) {
        console.log('no cache searchMovie', title);
        try {
            return this.movieDbApi.request('/search/movie?query={query}&year={year}', 'GET', {
                query: encodeURIComponent(title),
                year: year
            });
        } catch (err) {
            return {};
        }
    }

    // @todo memoize
    async getMovieDetails(movieId) {
        console.log('no cache getMovieDetails', movieId);

        return this.movieDbApi.request('/movie/{id}', 'GET', {
            id: encodeURIComponent(movieId)
        });
    }
}
