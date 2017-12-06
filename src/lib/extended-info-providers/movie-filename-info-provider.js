export default class MovieFilenameInfoProvider {
    constructor(movieNameExtractor) {
        this.movieNameExtractor = movieNameExtractor;
    }
    async execute(movie) {
        const movieInfo = this.movieNameExtractor.extract(movie.fileName);
        return Object.assign({ type: 'movie' }, movie, movieInfo);
    }
}
