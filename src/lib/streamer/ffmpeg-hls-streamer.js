import BasicStreamer from './basic-streamer';
import HlsSession from './hls/hls-session';

// @todo add session handling with a master m3u file
export default class FFMpegHlsStreamer extends BasicStreamer {
    constructor(ffmpegApi, m3u8Generator, hlsPresetDecision, transcodingTempFolder) {
        super();
        this.ffmpegApi = ffmpegApi;
        this.m3u8Generator = m3u8Generator;
        this.hlsPresetDecision = hlsPresetDecision;
        this.transcodingTempFolder = transcodingTempFolder;
        this.sessions = {};
    }

    getHeaders() {
        return this.headers;
    }

    getStatus() {
        return this.status;
    }

    async prepareStream(rangeHeaders, media, session) {
        if (!this.sessions[session]) {
            this.sessions[session] = new HlsSession(
                session,
                media,
                this.ffmpegApi,
                this.m3u8Generator,
                this.hlsPresetDecision,
                this.transcodingTempFolder
            );
            await this.sessions[session].start();
        }

        this.media = media;
        this.headers = {
            'Content-Type': 'application/x-mpegURL',
            'Accept-Ranges': 'none'
        };
    }

    async getMasterPlaylist(session) {
        if (!this.sessions[session]) throw new Error('Invalid session Id ' + session);

        return this.sessions[session].getMasterPlaylist();
    }

    async getPlaylist(session) {
        if (!this.sessions[session]) throw new Error('Invalid session Id ' + session);

        return this.sessions[session].getPlaylist();
    }

    async getStream(segment, session) {
        if (!this.sessions[session]) throw new Error('Invalid session Id ' + session);

        return this.sessions[session].getStream(segment);
    }

    async stopStream(session) {
        if (!this.sessions[session]) throw new Error('Invalid session Id ' + session);

        return this.sessions[session].stop();
    }
}
