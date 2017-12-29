import recursive from 'recursive-readdir';
import path from 'path';

const FILES_BLACKLIST = ['.DS_Store', '.git', ignoreNonVideoFiles];
const ALLOWED_MEDIA_EXTENSIONS = [
    '.mkv',
    '.mp4',
    '.avi',
    '.mov',
    '.ts',
    '.webm',
    '.flv',
    '.f4v',
    '.vob',
    '.ogv',
    '.ogg',
    '.wmv',
    '.qt',
    '.rm',
    '.mpg',
    '.mpeg',
    '.m4v'
];

function ignoreNonVideoFiles(file, stats) {
    return !stats.isDirectory() && ALLOWED_MEDIA_EXTENSIONS.indexOf(path.extname(file)) === -1;
}

export default class RecursiveDirectoryReader {
    async getNewFiles(path) {
        return recursive(path, FILES_BLACKLIST);
    }
}
