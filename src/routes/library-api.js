/* eslint-disable no-useless-constructor */
import { createController } from 'awilix-koa';
import BaseRestApi from './base-api';

class LibraryRestApi extends BaseRestApi {
    constructor(libraryService, libraryScanner) {
        super(libraryService);

        this.libraryScanner = libraryScanner;
    }

    async scan(ctx) {
        ctx.body = { message: 'ok' };

        try {
            const query = ctx.params.id ? { uid: ctx.params.id } : {};

            const libraries = await this.service.find(query);
            Promise.all(libraries.map(async lib => this.libraryScanner.scan(lib)));
        } catch (err) {
            console.log('Error occurred while scanning', err);
        }
    }
}

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
export default createController(LibraryRestApi)
    .prefix('/api/libraries')
    .get('', 'find')
    .get('/:id', 'get')
    .post('', 'create')
    .patch('/:id', 'update')
    .delete('/:id', 'remove')
    .post('/:id/scan', 'scan')
    .post('/scan', 'scan');
