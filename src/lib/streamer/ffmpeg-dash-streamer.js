/**
 *
 * This is only for reference. It works but poorly right now
 *
 */

import BasicStreamer from './basic-streamer';
import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import isoDuration from 'milliseconds-to-iso-8601-duration';
import hhmmss from 'hh-mm-ss';
import fsUtil from '../fs-util';

const SEGMENT_DURATION = 1;

export default class FFMpegDashStreamer extends BasicStreamer {
    constructor(ffmpegApi, transcodingTempFolder) {
        super();
        this.ffmpegApi = ffmpegApi;
        this.transcodingTempFolder = transcodingTempFolder;
        this.offsetManualSeekTime = 0;
        this.transcodingTimeProgress = 0;
        this.isTranscoding = false;
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
            'Accept-Ranges': 'none'
        };

        if (!this.isTranscoding) {
            await fsExtra.ensureDir(path.join(this.transcodingTempFolder, media.uid));
            await fsExtra.emptyDirSync(path.join(this.transcodingTempFolder, media.uid));

            await fsExtra.ensureDir(path.join(this.transcodingTempFolder, media.uid, '0'));
            await fsExtra.ensureDir(path.join(this.transcodingTempFolder, media.uid, '1'));
        }
    }

    async startTranscoding(seekTime, startSegment) {
        this.isTranscoding = true;
        let resolved = false;
        let lastProgress = 0;
        const maxRate = parseInt(this.media.file_size / this.media.bit_rate / 100 * 1024);
        this.offsetManualSeekTime = seekTime;

        console.log('Transcoding started', seekTime, startSegment);
        return new Promise((resolve, reject) => {
            this.command = this.ffmpegApi();
            this.command
                .renice(1)
                .input(this.media.filePath)
                .videoCodec('libx264')
                .format('dash')
                .addOption('-min_seg_duration', 1000000)
                // .addOption('-segment_start_number', offsetManualSeekTime)
                // .addOption('-segment_time_delta', 0.0625)
                .addOption('-individual_header_trailer', 0)
                .setStartTime(seekTime || 0)
                // .setStartTime(seekTime || 0)
                .addOption('-metadata', 'provider_name=Media Speed')
                .addOption('-metadata', 'service_name=' + (this.media.title || this.media.name))
                .addOption('-pix_fmt', 'yuv420p')
                // .addOption('-vf', 'scale=trunc(min(max(iw\\,ih*dar)\\,' + this.media.width + ')/2)*2:trunc(ow/dar/2)*2')
                .addOption('-filter_complex', 'setpts=(RTCTIME - RTCSTART)')
                .addOption('-bsf:v', 'h264_mp4toannexb')
                .addOption('-profile:v', 'high')
                .addOption('-level', '4.1')
                .addOption('-map_chapters', -1)
                .addOption('-map_metadata', -1)
                .addOption('-preset', 'veryfast')
                .addOption('-movflags', '+faststart dash')
                .addOption('-use_template', 1)
                .addOption('-use_timeline', 0)
                .addOption('-remove_at_exit', 1)
                .addOption('-crf', '23')
                .addOption('-bufsize', maxRate * 2 + 'k')
                .addOption('-maxrate', maxRate + 'k')
                .addOption('-start_at_zero')
                .addOption('-threads', 0)
                .audioCodec('aac')
                // .addOption('-utc_timing_url', '')
                .addOption(
                    '-force_key_frames',
                    'expr:if(isnan(prev_forced_t),eq(t,t),gte(t,prev_forced_t+' + SEGMENT_DURATION + '))'
                )
                .addOption('-init_seg_name', '$RepresentationID$/' + this.offsetManualSeekTime + '_initial.mp4')
                .addOption('-media_seg_name', '$RepresentationID$/' + this.offsetManualSeekTime + '_$Number$.m4s')
                .on('error', (err, stdout, stderr) => {
                    console.log(err.message);
                })
                .on('start', async commandLine => {
                    console.log('Spawned Ffmpeg with command: ' + commandLine);
                    lastProgress = (seekTime - this.offsetManualSeekTime) / this.media.file_duration * 100;
                    resolved = false;
                })
                .on('progress', progress => {
                    this.transcodingTimeProgress = hhmmss.toS(progress.timemark, 'hh:mm:ss.sss');
                    if (!resolved && progress.percent - lastProgress >= 0.1) {
                        console.log('We got at least 0.5%');
                        resolved = true;
                        resolve(true);
                    }
                })
                .output(path.join(this.transcodingTempFolder, this.media.uid, 'index.mpd'))
                .run();
        });
    }

    async getPlaylist() {
        const duration = this.media.file_duration * 1000;
        const maxRate = parseInt(this.media.file_size / this.media.bit_rate / 100 * 1024) * 1000;

        if (!this.isTranscoding) {
            await this.startTranscoding(0, 0);
        }

        return (
            '<MPD xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
            '\txmlns="urn:mpeg:dash:schema:mpd:2011"\n' +
            '\txmlns:xlink="http://www.w3.org/1999/xlink"\n' +
            '\txsi:schemaLocation="urn:mpeg:dash:schema:mpd:2011 http://standards.iso.org/ittf/PubliclyAvailableStandards/MPEG-DASH_schema_files/DASH-MPD.xsd"\n' +
            '\tprofiles="urn:mpeg:dash:profile:isoff-live:2011"\n' +
            '\ttype="static"\n' +
            '\tsuggestedPresentationDelay="PT1S"\n' +
            '\tmediaPresentationDuration="' +
            isoDuration.iso8601duration(duration) +
            '"\n' +
            '\tmaxSegmentDuration="PT2S"\n' +
            '\tminBufferTime="PT10S">\n' +
            '\t<Period start="PT0S" id="0" duration="' +
            isoDuration.iso8601duration(duration) +
            '">\n' +
            '\t\t<AdaptationSet segmentAlignment="true">\n' +
            '\t\t\t<SegmentTemplate timescale="1" duration="1" initialization="$RepresentationID$/initial.mp4" media="$RepresentationID$/$Number$.m4s?$Time$" startNumber="1">\n' +
            '\t\t\t</SegmentTemplate>\n' +
            '\t\t\t<Representation id="0" mimeType="video/mp4" codecs="avc1.640029" bandwidth="' +
            maxRate +
            '" width="1920" height="1080">\n' +
            '\t\t\t</Representation>\n' +
            '\t\t</AdaptationSet>\n' +
            '\t\t<AdaptationSet segmentAlignment="true">\n' +
            '\t\t\t<SegmentTemplate timescale="1" duration="1" initialization="$RepresentationID$/initial.mp4" media="$RepresentationID$/$Number$.m4s?$Time$" startNumber="1">\n' +
            '\t\t\t</SegmentTemplate>\n' +
            '\t\t\t<Representation id="1" mimeType="audio/mp4" codecs="mp4a.40.2" bandwidth="188000" audioSamplingRate="48000">\n' +
            '\t\t\t\t<AudioChannelConfiguration schemeIdUri="urn:mpeg:dash:23003:3:audio_channel_configuration:2011" value="6"/>\n' +
            '\t\t\t</Representation>\n' +
            '\t\t</AdaptationSet>\n' +
            '\t</Period>\n' +
            '</MPD>'
        );
    }

    async getStream(segment, representation) {
        const seekTime = SEGMENT_DURATION * segment;
        console.log(segment, representation);

        return new Promise(async (resolve, reject) => {
            const currentSegment = segment - this.offsetManualSeekTime || 1;
            let currentSegmentFile = path.join(
                this.transcodingTempFolder,
                this.media.uid,
                representation.toString(),
                this.offsetManualSeekTime + '_' + currentSegment + '.m4s'
            );

            const segmentExist = await fsUtil.fileExists(currentSegmentFile);
            const timeGap = seekTime - this.offsetManualSeekTime - this.transcodingTimeProgress;
            console.log(segmentExist);

            if (timeGap > 10 * SEGMENT_DURATION && !segmentExist) {
                console.log('Manual seek detected', timeGap, seekTime, this.transcodingTimeProgress);
                this.stop();
                await this.startTranscoding(seekTime, segment);
                currentSegmentFile = path.join(
                    this.transcodingTempFolder,
                    this.media.uid,
                    representation.toString(),
                    this.offsetManualSeekTime + '_1.m4s'
                );
            }

            try {
                await fsUtil.waitForFile(currentSegmentFile, 10000);
                console.log(currentSegmentFile);
                resolve(fs.createReadStream(currentSegmentFile));
            } catch (e) {
                console.log('Error', currentSegmentFile);
                reject(e.message);
            }
        });
    }

    getInitial(representation) {
        return new Promise(async (resolve, reject) => {
            const currentSegmentFile = path.join(
                this.transcodingTempFolder,
                this.media.uid,
                representation.toString(),
                this.offsetManualSeekTime + '_initial.mp4'
            );

            try {
                await fsUtil.waitForFile(currentSegmentFile, 10000);
                resolve(fs.createReadStream(currentSegmentFile));
            } catch (e) {
                console.log(currentSegmentFile, e.message);
                reject(e.message);
            }
        });
    }

    stop() {
        this.command && this.command.kill();
        console.log('killed');
    }
}
