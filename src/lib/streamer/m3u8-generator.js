import util from 'util';

/**
 * Generates a simple m38u playlist for hls streaming
 *
 * The mu38 is not 100% precise nor accurate,
 * It relies of the fact that keyframes and segment time are forced from ffmpeg
 *
 * Since ffmpeg does not generate the full m3u8 on the fly this helper provides
 * seekability in hls player like vlc or web
 *
 * seeks are not 100% accurate and they can cause locks sometimes
 *
 */
export default class M3u8Generator {
    generate(segmentTime, duration, segmentFormat) {
        const lastSegmentTime = duration % segmentTime;
        const numberOfFullSegment = Math.floor(duration / segmentTime);

        let output = `#EXTM3U
#EXT-X-PLAYLIST-TYPE:VOD
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:${segmentTime}
#EXT-X-MEDIA-SEQUENCE:0\n`;

        for (let i = 0; i < numberOfFullSegment; i++) {
            output += `#EXTINF:${segmentTime}.000, nodesc
${util.format(segmentFormat, i)}\n`;
        }

        output += `#EXTINF:${lastSegmentTime}, nodesc
${util.format(segmentFormat, numberOfFullSegment)}`;

        output += '\n#EXT-X-ENDLIST';

        return output;
    }

    generateMasterPlaylist(session, bandwidth, resolution, framerate) {
        return (
            `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},AVERAGE-BANDWIDTH=${bandwidth},RESOLUTION=${resolution},FRAME-RATE=${framerate}
video.m3u8?session=` + session
        );
    }
}
