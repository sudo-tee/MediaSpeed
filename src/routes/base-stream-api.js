// This is our Base API controller.
// All it does is map HTTP calls to service calls.
// This way our services could be used in any type of app, not
// just over HTTP.
const isStreamError = err => err.message.indexOf('EPIPE') > -1 || err.message.indexOf('ECONNRESET') > -1;

export default class StreamApi {
    constructor(movieService, episodeService, basicStreamer) {
        this.movieService = movieService;
        this.episodeService = episodeService;
        this.streamer = basicStreamer;
    }

    async stream(ctx) {
        const id = ctx.params.id;
        const q = ctx.query.q;
        const type = ctx.params.type;
        const media = await this.getMedia(type, id);

        console.log(ctx.headers.range);

        media || ctx.notFound(type + ' ' + id + ' not found');

        this.streamer.prepareStream(this.getRange(ctx), media);

        ctx.set(this.streamer.getHeaders());
        ctx.status = this.streamer.getStatus();
        ctx.body = this.streamer.getStream(q);

        ctx.req.connection.on('close', () => {
            this.streamer.stop();
        });
        // supress EPIPE and ECONNRESET errors
        ctx.onerror = err => {
            if (!err) return;
            if (!isStreamError(err)) {
                this.logger.error('Error in request', err);
            }
        };
    }

    getRange(ctx) {
        return ctx.headers.range;
    }

    async getMedia(type, id) {
        return type === 'episode' ? this.episodeService.get(id) : this.movieService.get(id);
    }
}
