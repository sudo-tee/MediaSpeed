import EventsEnum from '../events-enum';

export default class FFProbeInfoProvider {
    constructor(eventEmitter, ffmpegApi, movieService, episodeService, logger) {
        this.eventEmitter = eventEmitter;
        this.ffmpegApi = ffmpegApi;
        this.movieService = movieService;
        this.episodeService = episodeService;
        this.logger = logger;

        this.eventEmitter.on(EventsEnum.EPISODE_CREATED, async (episode, season, show) => {
            const ffmpegInfo = await this.execute(episode);
            this.episodeService.update(episode.uid, ffmpegInfo);
        });

        this.eventEmitter.on(EventsEnum.MOVIE_CREATED, async movie => {
            const ffmpegInfo = await this.execute(movie);
            this.movieService.update(movie.uid, ffmpegInfo);
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

                const ffmpegInfo = {
                    width: metadata.streams[0].width,
                    height: metadata.streams[0].height,
                    file_duration: parseFloat(metadata.format.duration),
                    file_size: parseInt(metadata.format.size),
                    bit_rate: metadata.format.bit_rate,
                    video_codec: metadata.streams[0].codec_name,
                    audios: metadata.streams.filter(stream => stream.codec_type === 'audio').map(audio => ({
                        index: audio.index,
                        codec_name: audio.codec_name,
                        channels: audio.channels,
                        language: audio.tags ? audio.tags.language : undefined
                    })),
                    subtitles: metadata.streams.filter(stream => stream.codec_type === 'subtitle').map(sub => ({
                        index: sub.index,
                        codec_name: sub.codec_name,
                        channels: sub.channels,
                        language: sub.tags ? sub.tags.language : undefined,
                        forced: sub.tags ? sub.tags.forced : undefined
                    }))
                };

                resolve(ffmpegInfo);
            });
        });
    }
}
