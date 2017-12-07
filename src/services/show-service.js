import { BadRequest } from 'fejl';
import BaseService from './base-service';

// Prevent overposting.
const props = [
    'library_uid',
    'uid',
    'type',
    'name',
    'backdrop_path',
    'created_by',
    'first_air_date',
    'genres',
    'homepage',
    'in_production',
    'languages',
    'last_air_date',
    'networks',
    'number_of_episodes',
    'number_of_seasons',
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
    'tmdb_id'
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
