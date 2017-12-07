/* eslint-disable no-useless-constructor */
import { createController } from 'awilix-koa';
import BaseRestApi from './base-api';

class SeasonsRestApi extends BaseRestApi {
    constructor(seasonService) {
        super(seasonService);
    }
}

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
export default createController(SeasonsRestApi)
    .prefix('/api/tv/seasons')
    .get('', 'find')
    .get('/:id', 'get')
    .post('', 'create')
    .patch('/:id', 'update')
    .delete('/:id', 'remove');
