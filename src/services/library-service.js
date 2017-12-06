import { BadRequest } from 'fejl';
import BaseService from './base-service';
import fs from 'fs';

// Prevent overposting.
const props = ['uid', 'name', 'path', 'type', 'last_update'];

const types = ['movie', 'episode'];
/**
 * Library Service.
 */
export default class LibraryService extends BaseService {
    constructor(libraryStore) {
        super(libraryStore, props);
    }

    assertInput(data) {
        BadRequest.assert(data, 'No library payload given');
        BadRequest.assert(data.uid, 'uid is required');
        BadRequest.assert(data.name, 'name is required');
        BadRequest.assert(data.name.length < 100, 'title is too long');
        BadRequest.assert(fs.existsSync(data.path), 'path does not exist');
        BadRequest.assert(types.indexOf(data.type) !== -1, 'Library type must be in [' + types.join(',') + ']');
    }
}
