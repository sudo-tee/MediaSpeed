import EventsEnum from '../events-enum';

export default class FFMpegImageProvider {
    constructor(eventEmitter, ffmpegApi, movieService, episodeService, imageDestinationFolder, logger) {
        this.eventEmitter = eventEmitter;
        this.ffmpegApi = ffmpegApi;
        this.movieService = movieService;
        this.episodeService = episodeService;
        this.imageDestinationFolder = imageDestinationFolder;

        this.logger = logger;

        this.eventEmitter.on(EventsEnum.EPISODE_CREATED, async (episode, season, show) => {
            await this.execute(episode);
        });

        this.eventEmitter.on(EventsEnum.MOVIE_CREATED, async movie => {
            await this.execute(movie);
        });
    }

    async execute(media) {
        this.logger.debug('Creating ffmpeg image from media ' + media.filePath);
        const localScreenshot = await this.executeffMpeg(media);

        if (media.type === 'movie') {
            await this.movieService.update(media.uid, { local_screenshot: localScreenshot });
        }

        if (media.type === 'episode') {
            await this.episodeService.update(media.uid, { local_screenshot: localScreenshot });
        }

        return media;
    }

    async executeffMpeg(media) {
        return new Promise((resolve, reject) => {
            this.ffmpegApi(media.filePath)
                .screenshots({
                    timestamps: ['50%'],
                    filename: media.uid + '_screenshot.jpg',
                    folder: this.imageDestinationFolder,
                    size: '640x?'
                })
                .on('end', () => {
                    resolve(media.uid + '_screenshot.jpg');
                })
                .on('error', e => reject(e.message));
        });
    }
}
