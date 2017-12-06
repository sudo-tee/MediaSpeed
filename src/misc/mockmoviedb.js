import fs from 'fs';

export default {

    async request(query) {
        console.log(query);
        if (query === '/search/movie?query={query}&year={year}') {
            return JSON.parse(fs.readFileSync('/Volumes/Users_Data/fbelang1/Sites/MediaSpeed/src/misc/tmdb_movie_search.json'));
        }

        if (query === '/movie/{id}') {
            return JSON.parse(fs.readFileSync('/Volumes/Users_Data/fbelang1/Sites/MediaSpeed/src/misc/tmdb_movie_details.json'));
        }

        if (query === '/search/tv?query={query}') {
            return JSON.parse(fs.readFileSync('/Volumes/Users_Data/fbelang1/Sites/MediaSpeed/src/misc/tmdb_tv_search.json'));
        }

        if (query === '/tv/{id}?append_to_response={append_to_response}') {
            return JSON.parse(fs.readFileSync('/Volumes/Users_Data/fbelang1/Sites/MediaSpeed/src/misc/tmdb_tv_details.json'));
        }

    }
}
