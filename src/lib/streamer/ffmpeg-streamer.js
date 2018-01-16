import stream from 'stream';
import BasicStreamer from './basic-streamer';

export default class FFMpegStreamer extends BasicStreamer {
    constructor(ffmpegApi) {
        super();
        this.ffmpegApi = ffmpegApi;
        this.headers = {
            'Accept-Ranges': 'none'
        };
    }
    getHeaders() {
        return this.headers;
    }

    getStatus() {
        return this.status;
    }

    getStream(seek) {
        let st = new stream.PassThrough();
        let command = this.ffmpegApi();
        command.input(this.media.filePath);

        if (seek) command.setStartTime(seek);
        command
            .outputOptions(['-movflags frag_keyframe+empty_moov', '-preset ultrafast', '-strict experimental'])
            .format('matroska')
            .audioCodec('aac')
            .videoCodec('libx264');

        command.on('error', (err, stdout, stderr) =>
            console.log('Cannot process video: ' + err.message, stdout, stderr)
        );
        command.pipe(st);

        return st;
    }

    stop() {}
}
