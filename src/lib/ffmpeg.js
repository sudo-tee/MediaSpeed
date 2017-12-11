import fluentFfmpeg from 'fluent-ffmpeg';

export default function createFFMpeg(ffmpeg, ffprobe) {
    fluentFfmpeg.setFfmpegPath(ffmpeg.path);
    fluentFfmpeg.setFfprobePath(ffprobe.path);

    return fluentFfmpeg;
}
