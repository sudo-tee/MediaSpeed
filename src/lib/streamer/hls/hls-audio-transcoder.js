export default class HlsAudioTranscoder {
    getAudioPreset(media) {
        return ffmpegCommand => {
            ffmpegCommand
                .audioCodec('libmp3lame')
                .addOption('-ac', 2)
                .addOption('-ab', 384000)
                .addOption('-af', 'volume=2');
        };
    }
}
