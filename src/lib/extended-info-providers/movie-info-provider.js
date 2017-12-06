import BaseInfoProvider from './base-info-provider';

export default class MovieInfoProvider extends BaseInfoProvider {
    constructor(movieFilenameInfoProvider, movieTmdbInfoProvider) {
        super();
        this.movieFilenameInfoProvider = movieFilenameInfoProvider;
        this.movieTmdbInfoProvider = movieTmdbInfoProvider;
    }

    async execute(filename, library) {
        const movie = super.execute(filename, library);
        return this.movieFilenameInfoProvider.execute(movie).then(movie => this.movieTmdbInfoProvider.execute(movie));
    }
}
