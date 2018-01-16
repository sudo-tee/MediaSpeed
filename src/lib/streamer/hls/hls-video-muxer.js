export default class HlsVideoMuxer {
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
                .videoCodec('copy')
                .addOption('-break_non_keyframes', 1)
                .addOption('-bsf:v', 'h264_mp4toannexb')
                .addOption('-segment_time', this.segmentDuration);
        };
    }

    getSeekPreset(seek, segment) {
        return ffmpegCommand => {
            if (seek > 30) {
                ffmpegCommand
                    .setStartTime(seek - 30)
                    .seekOutput(30)
                    .addOption('-initial_offset', 30);
            } else {
                ffmpegCommand
                    .addInputOption('-noaccurate_seek')
                    .setStartTime(seek)
                    .addOption('-segment_time_delta', -(this.segmentDuration * segment));
            }
        };
    }
}
