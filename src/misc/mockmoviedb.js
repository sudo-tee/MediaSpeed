import fs from 'fs';

export default class {
    searchMovie(searchOptions, cb) {
        cb(
            null,
            JSON.parse(fs.readFileSync('/Volumes/Users_Data/fbelang1/Sites/MediaSpeed/src/misc/tmdb_movie_search.json'))
        );
    }

    searchTv(searchOptions, cb) {
        cb(
            null,
            JSON.parse(fs.readFileSync('/Volumes/Users_Data/fbelang1/Sites/MediaSpeed/src/misc/tmdb_tv_search.json'))
        );
    }

    tvInfo(searchOptions, cb) {
        cb(
            null,
            JSON.parse(fs.readFileSync('/Volumes/Users_Data/fbelang1/Sites/MediaSpeed/src/misc/tmdb_tv_details.json'))
        );
    }

    movieInfo(searchOption, cb) {
        cb(
            null,
            JSON.parse(
                fs.readFileSync('/Volumes/Users_Data/fbelang1/Sites/MediaSpeed/src/misc/tmdb_movie_details.json')
            )
        );
    }
}
