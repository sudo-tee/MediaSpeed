import {BadRequest} from 'fejl'
import BaseService from "./base-service";

// Prevent overposting.
const props = ['type',
    'uid',
    'library_uid',
    'filePath',
    'fileName',
    'year',
    'container',
    'title',
    'tmdb_movie_id',
    'adult',
    'backdrop_path',
    'budget',
    'genres',
    'homepage',
    'id',
    'imdb_id',
    'original_language',
    'original_title',
    'overview',
    'popularity',
    'poster_path',
    'production_companies',
    'production_countries',
    'release_date',
    'revenue',
    'runtime',
    'spoken_languages',
    'status',
    'tagline',
    'video',
    'vote_average',
    'vote_count'];

export default class MovieService extends BaseService {
    constructor(movieStore) {
        super(movieStore, props);
    }

    async assertInput(data) {
        BadRequest.assert(data, 'No todo payload given');
        BadRequest.assert(data.uid, 'uid is required');
        BadRequest.assert(data.title, 'title is required');
        BadRequest.assert(data.filePath, 'filepath is required');
        BadRequest.assert(data.fileName, 'filename does not exist');
    }
}
