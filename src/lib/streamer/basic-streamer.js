import mime from 'mime';
import fs from 'fs';
import stream from 'stream';

export default class BasicStreamer {
    constructor() {
        this.streamPositions = null;
        this.status = 200;
    }

    prepareStream(rangeHeaders, media) {
        const mimeType = mime.lookup(media.filePath);
        this.media = media;
        this.headers = {
            'Content-Type': mimeType
        };

        const range = false;

        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : media.file_size - 1;
            const chunksize = end - start + 1;

            this.headers = {
                'Content-Type': mimeType,
                'Content-Range': `bytes ${start}-${end}/${media.file_size}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize
            };

            this.status = 206;
            this.streamPositions = { start, end };
        }
    }

    getHeaders() {
        return this.headers;
    }

    getStatus() {
        return this.status;
    }

    getStream() {
        let str = stream.PassThrough();
        fs.createReadStream(this.media.filePath, this.streamPositions).pipe(str, { end: true });
        return str;
    }
}
