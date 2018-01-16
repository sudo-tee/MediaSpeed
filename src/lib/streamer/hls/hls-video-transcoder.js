export default class HlsVideoTranscoder {
    constructor(media) {
        this.media = media;
        this.segmentDuration = 1;
    }

    getSegmentDuration() {
        return this.segmentDuration;
    }

    getVideoPreset() {
        return ffmpegCommand => {
            ffmpegCommand
                .videoCodec('libx264')
                .addOption('-preset', 'veryfast')
                .addOption('-pix_fmt', 'yuv420p')
                .addOption('-profile:v', 'high')
                .addOption('-level', '4.1')
                .addOption(
                    '-x264opts:0',
                    'subme=0:me_range=4:rc_lookahead=10:me=dia:no_chroma_me:8x8dct=0:partitions=none'
                )
                .addOption('-vf', 'scale=trunc(min(max(iw\\,ih*dar)\\,' + this.media.width + ')/2)*2:trunc(ow/dar/2)*2')
                .addOption('-crf', '23')
                .addOption(
                    '-force_key_frames',
                    'expr:if(isnan(prev_forced_t),eq(t,t),gte(t,prev_forced_t+' + this.segmentDuration + '))'
                )
                .addOption('-segment_time', this.segmentDuration);
        };
    }

    getSeekPreset(seek, segment) {
        return ffmpegCommand => {
            if (seek > 0) {
                ffmpegCommand
                    .setStartTime(seek)
                    .addOption('-segment_time_delta', -(this.segmentDuration * segment))
                    .addOption('-segment_start_number', segment);
            }
        };
    }
}
