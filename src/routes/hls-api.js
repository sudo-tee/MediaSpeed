/* eslint-disable no-useless-constructor */
import { createController } from 'awilix-koa';
import StreamApi from './base-stream-api';

class HlsApi extends StreamApi {
    constructor(movieService, episodeService, ffmpegHlsStreamer, m3u8Generator) {
        super(movieService, episodeService, ffmpegHlsStreamer);

        this.m3u8Generator = m3u8Generator;
    }

    async masterPlaylist(ctx, res) {
        const id = ctx.params.id;
        const type = ctx.params.type;
        const session = ctx.query.session;

        const media = await this.getMedia(type, id);
        await this.streamer.prepareStream(null, media, session);

        ctx.body = await this.streamer.getMasterPlaylist(session);
        ctx.set(this.streamer.getHeaders());
        ctx.status = this.streamer.getStatus();
    }

    async playlist(ctx, res) {
        const session = ctx.query.session;
        ctx.body = await this.streamer.getPlaylist(session);
        ctx.set(this.streamer.getHeaders());
        ctx.status = this.streamer.getStatus();
    }

    async stream(ctx, res) {
        const session = ctx.query.session;
        const segment = ctx.params.segment;
        ctx.body = await this.streamer.getStream(segment, session);
    }
}

export default createController(HlsApi)
    .prefix('/hls')
    .get('/:type/:id/index.m3u8', 'masterPlaylist')
    .get('/:type/:id/video.m3u8', 'playlist')
    .get('/:type/:id/index:segment.ts', 'stream');
