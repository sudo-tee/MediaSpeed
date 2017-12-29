/* eslint-disable no-useless-constructor */
import { createController } from 'awilix-koa';
import StreamApi from './base-stream-api';
import fs from 'fs';

class HlsApi extends StreamApi {
    constructor(movieService, episodeService, ffmpegHlsStreamer, m3u8Generator) {
        super(movieService, episodeService, ffmpegHlsStreamer);

        this.m3u8Generator = m3u8Generator;
    }

    async playlist(ctx, res) {
        const id = ctx.params.id;
        const type = ctx.params.type;
        const media = await this.getMedia(type, id);

        await this.streamer.prepareStream(null, media);

        if (fs.existsSync('/tmp/output/' + id + '.m3u8')) {
            ctx.body = this.m3u8Generator.generate(3, media.file_duration, 'index%d.ts');
        } else {
            await this.streamer.startTranscoding();
            ctx.body = this.m3u8Generator.generate(3, media.file_duration, 'index%d.ts');
        }

        ctx.set(this.streamer.getHeaders());
        ctx.status = this.streamer.getStatus();
    }

    async stream(ctx, res) {
        const segment = ctx.params.id;
        ctx.body = await this.streamer.getStream(segment);
    }
}

export default createController(HlsApi)
    .prefix('/hls')
    .get('/:type/:id.m3u8', 'playlist')
    .get('/:type/index:id.ts', 'stream');
