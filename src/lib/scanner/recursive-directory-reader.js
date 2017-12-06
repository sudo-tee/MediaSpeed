import recursive from 'recursive-readdir';

const FILES_BLACKLIST = ['.DS_Store', '.git'];

export default class RecursiveDirectoryReader {
    async getNewFiles(path) {
        return recursive(path, FILES_BLACKLIST);
    }
}
