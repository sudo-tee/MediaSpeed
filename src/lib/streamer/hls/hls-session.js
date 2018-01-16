import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import hhmmss from 'hh-mm-ss';
import fsUtil from '../../fs-util';

export default class HlsSession {
    constructor(uid, media, ffmpegApi, m3u8Generator, hlsPresetDecision, transcodingTempFolder) {
        this.uid = uid;
        this.ffmpegApi = ffmpegApi;
        this.m3u8Generator = m3u8Generator;
        this.baseTranscodingTempFolder = transcodingTempFolder;
        this.transcodingTimeProgress = 0;
        this.transcoderRunning = false;
        this.media = media;
        this.timeoutAfer = 120000; // 2 minutes
        this.timeoutHandle = null;

        this.videoPreset = hlsPresetDecision.getVideoPreset(this.media);
        this.audioPreset = hlsPresetDecision.getAudioPreset(this.media);
    }

    async start() {
        this.transcodingTempFolder = path.join(this.baseTranscodingTempFolder, this.uid, this.media.uid);

        await fsExtra.ensureDir(this.transcodingTempFolder);
        await fsExtra.emptyDirSync(this.transcodingTempFolder);

        if (!this.transcoderRunning) await this.startTranscoding(0, 0);
    }

    /**
     * No master playlist for now as there is no profile or bandwidth selection
     *
     * @returns {Promise.<*>}
     */
    async getMasterPlaylist() {
        return this.m3u8Generator.generate(
            this.videoPreset.getSegmentDuration(),
            this.media.file_duration,
            'index%d.ts?session=' + this.uid
        );
    }

    async getPlaylist() {
        return this.m3u8Generator.generate(
            this.videoPreset.getSegmentDuration(),
            this.media.file_duration,
            'index%d.ts?session=' + this.uid
        );
    }

    async startTranscoding(seekTime, startSegment) {
        let resolved = false;
        let lastProgress = 0;

        console.log('Transcoding started', seekTime, startSegment);
        return new Promise((resolve, reject) => {
            this.command = this.ffmpegApi();

            this.command.preset(this.videoPreset.getVideoPreset(this.media));
            this.command.preset(this.audioPreset.getAudioPreset(this.media));

            this.command
                .renice(1)
                .input(this.media.filePath)
                .addOption('-threads', 0)
                .addOption('-metadata', 'provider_name=Media Speed')
                .addOption('-metadata', 'service_name=' + (this.media.title || this.media.name))
                .addOption('-copyts')
                .addOption('-vsync', -1)
                .addOption('-individual_header_trailer', 0)
                .addOption('-max_delay', 5000000);

            this.command.preset(this.videoPreset.getSeekPreset(seekTime, startSegment));

            this.command
                .format('segment')
                .addOption('-segment_format', 'mpegts')
                .addOption('-segment_list_size', 0)
                .addOption('-avoid_negative_ts', 'disabled')
                .addOption('-map_chapters', -1)
                .addOption('-map_metadata', -1)
                .addOption('-start_at_zero')
                .addOption('-segment_list_type', 'm3u8')
                .addOption('-segment_list', path.join(this.transcodingTempFolder, 'index.m3u8'))
                .on('error', function(err, stdout, stderr) {
                    console.log(err.message, stderr);
                })
                .on('start', async commandLine => {
                    this.transcoderRunning = true;
                    console.log('Spawned Ffmpeg with command: ' + commandLine);
                    resolved = false;
                })
                .on('progress', progress => {
                    this.transcodingTimeProgress = hhmmss.toS(progress.timemark, 'hh:mm:ss.sss');
                    if (!resolved && progress.percent - lastProgress >= 0.5) {
                        console.log('We got at least 0.5%');
                        resolved = true;
                        resolve(true);
                    }
                })
                .output(path.join(this.transcodingTempFolder, 'index%d.ts'))
                .run();
        });
    }

    async getStream(segment) {
        const seekTime = this.videoPreset.getSegmentDuration() * segment;

        this.checkTimeout();

        return new Promise(async (resolve, reject) => {
            const currentSegmentFile = path.join(this.transcodingTempFolder, 'index' + segment + '.ts');

            const segmentExist = await fsUtil.fileExists(currentSegmentFile);
            const timeGap = Math.abs(seekTime - this.transcodingTimeProgress);

            if (timeGap > 10 * this.videoPreset.getSegmentDuration() && !segmentExist) {
                console.log('Manual seek detected', timeGap, this.transcodingTimeProgress, currentSegmentFile);
                this.stop();
                await this.startTranscoding(seekTime, segment);
            }

            try {
                const currentSegmentFile = path.join(this.transcodingTempFolder, 'index' + segment + '.ts');
                await fsUtil.waitForFile(currentSegmentFile, 10000);
                console.log('file served', currentSegmentFile);
                resolve(fs.createReadStream(currentSegmentFile));
            } catch (e) {
                reject(e.message);
            }
        });
    }

    checkTimeout() {
        if (this.timeoutHandle) clearTimeout(this.timeoutHandle);

        this.timeoutHandle = setTimeout(() => {
            console.log('Hls transcoding session timed out', this.uid);
            this.stop();
            fsExtra.emptyDirSync(path.join(this.transcodingTempFolder, this.uid, this.media.uid));
        }, this.timeoutAfer);
    }

    stop() {
        this.transcoderRunning = false;
        this.command && this.command.kill();
        console.log('killed');
    }
}
