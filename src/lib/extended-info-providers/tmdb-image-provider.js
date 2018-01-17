import EventsEnum from '../events-enum';

const BASE_URL = 'http://image.tmdb.org/t/p';
const WIDTH = {
    poster: 'w342',
    backdrop: 'w1920',
    still: 'w1920'
};

export default class TmdbImageProvider {
    constructor(serviceFactory, imageDownloader, imageDestinationFolder, logger, eventEmitter) {
        this.serviceFactory = serviceFactory;
        this.logger = logger;
        this.eventEmitter = eventEmitter;
        this.imageDownloader = imageDownloader;
        this.imageDestinationFolder = imageDestinationFolder;

        this.eventEmitter.on(EventsEnum.TMDB_INFO_UPDATED, media => this.execute(media));
        this.eventEmitter.on(EventsEnum.REFRESH_IMAGES, media => this.execute(media));
    }

    async execute(media) {
        const images = [];

        if (media.tmdb_poster_path) {
            images.push({
                type: 'poster',
                url: BASE_URL + '/' + WIDTH['poster'] + media.tmdb_poster_path,
                dest: this.imageDestinationFolder + '/' + media.uid + '_poster.jpg'
            });
        }

        if (media.tmdb_backdrop_path) {
            images.push({
                type: 'backdrop',
                url: BASE_URL + '/' + WIDTH['backdrop'] + media.tmdb_backdrop_path,
                dest: this.imageDestinationFolder + '/' + media.uid + '_backdrop.jpg'
            });
        }

        if (media.tmdb_still_path) {
            images.push({
                type: 'still',
                url: BASE_URL + '/' + WIDTH['still'] + media.tmdb_still_path,
                dest: this.imageDestinationFolder + '/' + media.uid + '_still.jpg'
            });
        }

        images.forEach(async image => {
            try {
                this.logger.debug('Downlading image ' + image.url);
                await this.imageDownloader.image(image);

                media['local_' + image.type] = media.uid + '_' + image.type + '.jpg';
                this.serviceFactory
                    .get(media.type)
                    .update(media.uid, { [`local_${image.type}`]: media.uid + '_' + image.type + '.jpg' });
            } catch (e) {
                this.logger.debug('Failed image download ' + e.message);
            }
        });
    }
}
