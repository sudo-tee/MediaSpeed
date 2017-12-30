import EventsEnum from '../events-enum';

export default class FFProbeInfoProvider {
    constructor(eventEmitter, ffmpegApi, movieService, episodeService, logger) {
        this.eventEmitter = eventEmitter;
        this.ffmpegApi = ffmpegApi;
        this.movieService = movieService;
        this.episodeService = episodeService;
        this.logger = logger;

        this.eventEmitter.on(EventsEnum.EPISODE_CREATED, async (episode, season, show) => {
            episode = await this.execute(episode);
            this.episodeService.update(episode.uid, episode);
        });

        this.eventEmitter.on(EventsEnum.MOVIE_CREATED, async movie => {
            movie = await this.execute(movie);
            this.movieService.update(movie.uid, movie);
        });
    }

    async execute(media) {
        this.logger.debug('Fetching ffmpeg infos from media ' + media.fileName);
        return new Promise((resolve, reject) => {
            this.ffmpegApi.ffprobe(media.filePath, (err, metadata) => {
                if (err || !metadata || !metadata.format || !metadata.streams) {
                    this.logger.debug('Could not get ffmpeg infos from media ' + media.fileName);
                    reject(media.fileName);
                }

                media.width = metadata.streams[0].width;
                media.height = metadata.streams[0].height;
                media.file_duration = parseFloat(metadata.format.duration);
                media.file_size = parseInt(metadata.format.size);
                media.bit_rate = metadata.format.bit_rate;
                media.video_codec = metadata.streams[0].codec_name;

                // @todo add audio information (for transcoding later)

                resolve(media);
            });
        });
    }
}
