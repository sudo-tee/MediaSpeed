import { BadRequest } from 'fejl';
import BaseService from './base-service';

// Prevent overposting.
const props = [
    'library_uid',
    'uid',
    'type',
    'season_number',
    'air_date',
    'name',
    'overview',
    'poster_path',
    'tmdb_id',
    'show_uid',
    'local_poster',
    'local_backdrop'
];

export default class SeasonService extends BaseService {
    constructor(seasonStore) {
        super(seasonStore, props);
    }

    assertInput(data) {
        BadRequest.assert(data, 'No show payload given');
        BadRequest.assert(data.uid, 'uid is required');
        BadRequest.assert(data.season_number, 'season number is required');
    }
}
