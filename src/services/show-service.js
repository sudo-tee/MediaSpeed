import { BadRequest } from 'fejl';
import BaseService from './base-service';

// Prevent overposting.
const props = [
    'library_uid',
    'uid',
    'type',
    'name',
    'tmdb_id',
    'tmdb_backdrop_path',
    'tmdb_poster_path',
    'created_by',
    'first_air_date',
    'genres',
    'homepage',
    'in_production',
    'languages',
    'last_air_date',
    'networks',
    'origin_country',
    'original_language',
    'original_name',
    'overview',
    'popularity',
    'poster_path',
    'production_companies',
    'status',
    'vote_average',
    'vote_count',
    'local_poster',
    'local_backdrop'
];

export default class ShowService extends BaseService {
    constructor(showStore) {
        super(showStore, props);
    }

    assertInput(data) {
        BadRequest.assert(data, 'No show payload given');
        BadRequest.assert(data.uid, 'uid is required');
        BadRequest.assert(data.name, 'name is required');
    }
}
