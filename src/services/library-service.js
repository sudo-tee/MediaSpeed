import { BadRequest } from 'fejl';
import BaseService from './base-service';
import fs from 'fs';
import shorthash from 'shorthash';

// Prevent overposting.
// @todo move the scanning progress in a task worker later..
const props = ['uid', 'name', 'path', 'type', 'scanning', 'scanning_progress'];

const types = ['movie', 'episode'];
/**
 * Library Service.
 */
export default class LibraryService extends BaseService {
    constructor(libraryStore) {
        super(libraryStore, props);
    }

    async create(data) {
        console.log(data);
        BadRequest.assert(fs.existsSync(data.path), 'path does not exist');
        data.uid = data.uid || shorthash.unique(data.path + data.name);
        this.assertInput(data);
        return this.store.create(this.filterProperties(data));
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
