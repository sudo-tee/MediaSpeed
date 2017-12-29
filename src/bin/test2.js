var ffmpeg = require('@ffmpeg-installer/ffmpeg');
var hls = require('../lib');

hls.setup({ ffmpegPath: ffmpeg.path });
hls.start(7090);

hls
    .stream(
        '"/Volumes/Users_Data/fbelang1/Movies/TV Shows/Stranger Things/Season 2/stranger.things.s02e01.720p.webrip.hevc.x265.rmteam.mkv"'
    )
    .then(function() {
        console.log('started stream');
    })
    .catch(function(e) {
        console.log('error');
        console.log(e.toString());
    });
