import { BadRequest } from 'fejl';
import BaseService from './base-service';

// Prevent overposting.
const props = [
    'type',
    'uid',
    'library_uid',
    'filePath',
    'fileName',
    'year',
    'container',
    'title',
    'tmdb_id',
    'tmdb_poster_path',
    'tmdb_backdrop_path',
    'adult',
    'budget',
    'genres',
    'homepage',
    'imdb_id',
    'original_language',
    'original_title',
    'overview',
    'popularity',
    'production_companies',
    'production_countries',
    'release_date',
    'revenue',
    'runtime',
    'spoken_languages',
    'status',
    'tagline',
    'vote_average',
    'vote_count',
    'width',
    'height',
    'file_duration',
    'file_size',
    'bit_rate',
    'video_codec',
    'local_screenshot',
    'local_poster',
    'local_backdrop'
];

export default class MovieService extends BaseService {
    constructor(movieStore) {
        super(movieStore, props);
    }

    assertInput(data) {
        BadRequest.assert(data, 'No movie payload given');
        BadRequest.assert(data.uid, 'uid is required');
        BadRequest.assert(data.title, 'title is required');
        BadRequest.assert(data.filePath, 'filepath is required');
        BadRequest.assert(data.fileName, 'filename does not exist');
    }
}
