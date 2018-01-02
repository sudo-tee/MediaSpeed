import stream from 'stream';
import BasicStreamer from './basic-streamer';
import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';

// @todo add session handling with a master m3u file
export default class FFMpegHlsStreamer extends BasicStreamer {
    constructor(ffmpegApi, m3u8Generator, transcodingTempFolder) {
        super();
        this.ffmpegApi = ffmpegApi;
        this.m3u8Generator = m3u8Generator;
        this.segmentTime = 3;
        this.transcodingTempFolder = transcodingTempFolder;
    }

    getHeaders() {
        return this.headers;
    }

    getStatus() {
        return this.status;
    }

    async prepareStream(rangeHeaders, media) {
        this.media = media;
        this.headers = {
            'Content-Type': 'application/x-mpegURL'
        };

        await fsExtra.ensureDir(path.join(this.transcodingTempFolder, media.uid));
    }

    async startTranscoding(seekTime, startSegment) {
        console.log('Transcoding started', seekTime, startSegment);
        return new Promise((resolve, reject) => {
            this.command = this.ffmpegApi();
            this.command
                .input(this.media.filePath)
                .videoCodec('libx264')
                .audioCodec('libmp3lame')
                .format('segment')
                .setStartTime(seekTime || 0)
                .addOption('-bsf:v', 'h264_mp4toannexb')
                .addOption('-pix_fmt', 'yuv420p')
                .addOption('-metadata', 'provider_name=Media Speed')
                .addOption('-metadata', 'service_name=' + (this.media.title || this.media.name))
                .addOption('-map_chapters', -1)
                .addOption('-map_metadata', -1)
                .addOption('-preset', 'ultrafast')
                .addOption('-strict', 'experimental')
                .addOption('-avoid_negative_ts', 'disabled')
                .addOption('-start_at_zero')
                .addOption('-segment_time', 3)
                .addOption('-individual_header_trailer', 0)
                .addOption('-segment_format', 'mpegts')
                .addOption('-segment_start_number', startSegment || 0)
                .addOption('-segment_list_size', 0)
                .addOption('-crf', '23')
                .addOption('-maxrate', 3206404)
                .addOption('-b:v', 3206404)
                .addOption('-bufsize', 6412808)
                .addOption('-max_delay', 5000000)
                .addOption('-threads', 0)
                .addOption('-force_key_frames', 'expr:if(isnan(prev_forced_t),eq(t,t),gte(t,prev_forced_t+3))')
                .addOption('-segment_list_type', 'm3u8')
                .addOption('-segment_list', path.join(this.transcodingTempFolder, this.media.uid, 'index.m3u8'))
                .addOption('-copyts')
                .on('error', function(err, stdout, stderr) {
                    console.log(err.message, stdout, stderr);
                })
                .on('start', async () => {
                    setTimeout(() => resolve(true), 4000);
                })
                .on('progress', function(progress) {
                    console.log(progress.percent);
                })
                .output(path.join(this.transcodingTempFolder, this.media.uid, 'index%d.ts'))
                .run();
        });
    }

    getStream(segment) {
        // @todo prevent infinite Loop (3 retry) and segment not greater than total.
        return new Promise((resolve, reject) => {
            this.numberOfFullSegment = Math.floor(this.media.file_duration / this.segmentTime);
            this.segmentDuration = this.media.file_duration / this.numberOfFullSegment;
            const seekTime = this.segmentDuration * segment;

            let str = stream.PassThrough();
            const tsStream = fs.createReadStream(
                path.join(this.transcodingTempFolder, this.media.uid, 'index' + segment + '.ts')
            );

            tsStream.on('error', async err => {
                console.log('segment missing', seekTime, segment, err.message);
                this.stop();

                await this.startTranscoding(seekTime, segment);

                resolve(this.getStream(segment));
            });

            tsStream.on('open', () => {
                tsStream.pipe(str, { end: true });
                resolve(str);
            });
        });
    }

    stop() {
        this.command && this.command.kill();
        console.log('killed');
    }
}
