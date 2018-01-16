import HlsVideoMuxer from './hls-video-muxer';
import HlsVideoTranscoder from './hls-video-transcoder';
import HlsAudioTranscoder from './hls-audio-transcoder';

export default class HlsPresetDecision {
    getVideoPreset(media) {
        switch (media.codec) {
            case 'h264':
            case 'x264':
                return new HlsVideoMuxer(media);
            default:
                return new HlsVideoTranscoder(media);
        }
    }

    getAudioPreset(media) {
        return new HlsAudioTranscoder();
    }
}
