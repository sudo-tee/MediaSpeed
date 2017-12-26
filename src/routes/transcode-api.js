/* eslint-disable no-useless-constructor */
import { createController } from 'awilix-koa';
import StreamApi from './base-stream-api';

class TranscodeApi extends StreamApi {
    constructor(movieService, episodeService, ffmpegStreamer) {
        super(movieService, episodeService, ffmpegStreamer);
    }

    getRange(ctx) {
        return false;
    }
}

export default createController(TranscodeApi)
    .prefix('/stream/transcode')
    .get('/:type/:id', 'stream');
