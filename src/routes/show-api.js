/* eslint-disable no-useless-constructor */
import { createController } from 'awilix-koa';
import BaseRestApi from './base-api';

class ShowRestApi extends BaseRestApi {
    constructor(showService, seasonService, episodeService) {
        super(showService);

        this.seasonService = seasonService;
        this.episodeService = episodeService;
    }

    async getSeasons(ctx) {
        let query = { show_uid: ctx.params.id };

        if (ctx.params.sid) {
            const seasonIdkey = isNaN(ctx.params.sid) ? 'uid' : 'season_number';
            query[seasonIdkey] = ctx.params.sid;
        }

        return ctx.ok(await this.seasonService.find(query));
    }

    async getEpisodes(ctx) {
        let query = { show_uid: ctx.params.id };

        if (ctx.params.sid) {
            const seasonIdkey = isNaN(ctx.params.sid) ? 'season_uid' : 'season_number';
            query[seasonIdkey] = ctx.params.sid;
        }

        return ctx.ok(await this.episodeService.find(query));
    }
}

export default createController(ShowRestApi)
    .prefix('/api/shows')
    .get('', 'find')
    .get('/:id', 'get')
    .get('/:id/seasons', 'getSeasons')
    .get('/:id/episodes', 'getEpisodes')
    .get('/:id/seasons/:sid', 'getSeasons')
    .get('/:id/seasons/:sid/episodes', 'getEpisodes')
    .post('', 'create')
    .patch('/:id', 'update')
    .delete('/:id', 'remove');
// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
