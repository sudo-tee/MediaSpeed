/* eslint-disable no-useless-constructor */
import { createController } from 'awilix-koa';
import StreamApi from './base-stream-api';

class DashApi extends StreamApi {
    constructor(movieService, episodeService, ffmpegDashStreamer) {
        super(movieService, episodeService, ffmpegDashStreamer);
    }

    async playlist(ctx, res) {
        const id = ctx.params.id;
        const type = ctx.params.type;
        const media = await this.getMedia(type, id);

        await this.streamer.prepareStream(null, media);
        ctx.set({
            // 'Content-Type': 'application/x-mpegURL',
            'Accept-Ranges': 'none'
        });
        ctx.body = await this.streamer.getPlaylist();
        ctx.status = this.streamer.getStatus();
    }

    async initial(ctx, res) {
        const representation = parseInt(ctx.params.representation);
        console.log('initial', representation);
        ctx.body = await this.streamer.getInitial(representation);
    }

    async stream(ctx, res) {
        const segment = parseInt(ctx.params.segment);
        const representation = parseInt(ctx.params.representation);

        ctx.set({
            'Content-Type': 'application/octet-stream',
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'no-cache',
            Connection: 'Keep-Alive',
            'Keep-Alive': 'timeout=20'
        });
        ctx.status = this.streamer.getStatus();
        ctx.body = await this.streamer.getStream(segment, representation);
    }
}

export default createController(DashApi)
    .prefix('/dash')
    .get('/:type/:id/index.mpd', 'playlist')
    .get('/:type/:id/:representation/initial.mp4', 'initial')
    .get('/:type/:id/:representation/:segment.m4s', 'stream');
