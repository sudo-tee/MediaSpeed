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
                .audioCodec('aac')
                .format('segment')
                .setStartTime(seekTime || 0)
                .addOption('-bsf:v', 'h264_mp4toannexb')
                .addOption('-pix_fmt', 'yuv420p')
                .addOption('-metadata', 'provider_name=Media Speed')
                .addOption('-metadata', 'service_name=' + this.media.title)
                .addOption('-map_chapters', -1)
                .addOption('-map_metadata', -1)
                .addOption('-preset', 'ultrafast')
                .addOption('-strict', 'experimental')
                .addOption('-deadline', 'realtime')
                .addOption('-max_delay', '5000000')
                .addOption('-avoid_negative_ts', 'disabled')
                .addOption('-start_at_zero')
                .addOption('-segment_time', 3)
                .addOption('-individual_header_trailer', 0)
                .addOption('-segment_format', 'mpegts')
                .addOption('-segment_start_number', startSegment || 0)
                .addOption('-segment_list_size', 0)
                .addOption('-crf', '23')
                .addOption('-maxrate 4430944')
                .addOption('-bufsize 8861888')
                .addOption('-force_key_frames', 'expr:if(isnan(prev_forced_t),eq(t,t),gte(t,prev_forced_t+3))')
                // .addOption('-vf', "scale=trunc(min(max(iw\\,ih*dar)\\,1920)/2)*2:trunc(ow/dar/2)*2")
                .addOption('-segment_list_type', 'm3u8')
                .addOption('-segment_list', path.join(this.transcodingTempFolder, this.media.uid, 'index.m3u8')) // change this...
                .addOption('-copyts')
                .on('error', function(err, stdout, stderr) {
                    reject(err.message);
                })
                .on('start', async () => {
                    setTimeout(() => resolve(true), 4000);
                })
                .on('progress', function(progress) {})
                .output(path.join(this.transcodingTempFolder, this.media.uid, 'index%d.ts'))
                .run();
        });
    }

    getStream(segment) {
        // @todo prevent infinite Loop (3 retry) and segment not greatert than total.
        return new Promise((resolve, reject) => {
            this.duration = 3895.789;

            this.numberOfFullSegment = Math.floor(this.duration / this.segmentTime);
            this.segmentDuration = this.duration / this.numberOfFullSegment;
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
