import util from 'util';

/**
 * Generates a simple m38u playlist for hls streaming
 *
 * The mu3 is not 100% precise nor accurate,
 * It relies of the fact that keyframes and segment time are forced from ffmpeg
 *
 * Since ffmpeg does not generate the full m3u8 on the fly this helper provides
 * seekability in hls playes like vlc or web
 *
 * seeks are not 100% accurate but tey are pretty close
 *
 */
export default class M3u8Generator {
    generate(segmentTime, duration, segmentFormat) {
        const lastSegmentTime = duration % segmentTime;
        const numberOfFullSegment = Math.floor(duration / segmentTime) - 1;

        let output = `#EXTM3U
#EXT-X-PLAYLIST-TYPE:VOD
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION: ${segmentTime}
#EXT-X-MEDIA-SEQUENCE:0
\n`;

        for (let i = 0; i < numberOfFullSegment; i++) {
            output += `#EXTINF:${segmentTime}, nodesc
${util.format(segmentFormat, i)}\n`;
        }

        output += `#EXTINF:${lastSegmentTime}, nodesc
${util.format(segmentFormat, numberOfFullSegment)}`;

        output += '\n#EXT-X-ENDLIST';

        return output;
    }
}
