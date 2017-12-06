
import TmdbAPI from 'moviedb-api';

export default function createMovieDbApi(movieDbApiKey) {
   return new TmdbAPI({
        consume: false,
        apiKey: movieDbApiKey});
}
