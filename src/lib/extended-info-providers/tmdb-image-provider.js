import EventsEnum from '../events-enum';

const BASE_URL = 'http://image.tmdb.org/t/p';
const WIDTH = {
    poster: 'w342',
    backdrop: 'w1920',
    poster_small: 'w150'
};

export default class TmdbImageProvider {
    constructor(
        movieService,
        showService,
        seasonService,
        imageDownloader,
        imageDestinationFolder,
        logger,
        eventEmitter
    ) {
        this.movieService = movieService;
        this.showService = showService;
        this.seasonService = seasonService;
        this.logger = logger;
        this.eventEmitter = eventEmitter;
        this.imageDownloader = imageDownloader;
        this.imageDestinationFolder = imageDestinationFolder;

        this.eventEmitter.on(EventsEnum.TMDB_INFO_UPDATED, media => this.execute(media));
        this.eventEmitter.on(EventsEnum.REFRESH_IMAGES, media => this.execute(media));
    }

    async execute(media) {
        const images = [];

        if (media.poster_path) {
            images.push({
                url: BASE_URL + '/' + WIDTH['poster'] + media.poster_path,
                dest: this.imageDestinationFolder + '/' + media.uid + '_poster.jpg'
            });

            images.push({
                url: BASE_URL + '/' + WIDTH['poster_small'] + media.poster_path,
                dest: this.imageDestinationFolder + '/' + media.uid + '_poster_small.jpg'
            });
        }

        if (media.backdrop_path) {
            images.push({
                url: BASE_URL + '/' + WIDTH['backdrop'] + media.backdrop_path,
                dest: this.imageDestinationFolder + '/' + media.uid + '_backdrop.jpg'
            });
        }

        images.forEach(image => {
            this.logger.debug('Downlading image ' + image.url);
            this.imageDownloader.image(image);
        });
    }
}
