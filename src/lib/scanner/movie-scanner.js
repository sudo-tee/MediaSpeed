import BaseScanner from './base-scanner';
import EventsEnum from '../events-enum';

export default class MovieScanner extends BaseScanner {
    constructor(movieNameExtractor, movieService, eventEmitter) {
        super();
        this.movieNameExtractor = movieNameExtractor;
        this.movieService = movieService;
        this.eventEmitter = eventEmitter;
    }

    async execute(filename, library) {
        let movie = super.execute(filename, library);
        const movieInfo = this.movieNameExtractor.extract(movie.fileName);

        movie = {
            ...{ type: 'movie' },
            ...movie,
            ...movieInfo
        };

        await this.createMovie(movie);

        this.eventEmitter.emit(EventsEnum.MOVIE_CREATED, movie);
    }

    async createMovie(movie) {
        let alreadyExist = await this.movieService.tryGet(movie.uid);
        if (alreadyExist) return true;

        return this.movieService.create(movie);
    }
}
