// This is our Base API controller.
// All it does is map HTTP calls to service calls.
// This way our services could be used in any type of app, not
// just over HTTP.
export default class BaseRestApi {

    constructor(service) {
        this.service = service;
    }

    async find(ctx) {
        return ctx.ok(await this.service.find(ctx.query));
    }

    async get(ctx) {
        return ctx.ok(await this.service.get(ctx.params.id));
    }

    async create(ctx) {
        return ctx.created(await this.service.create(ctx.request.body));
    }

    async update(ctx) {
        return ctx.ok(await this.service.update(ctx.params.id, ctx.request.body));
    }

    async remove(ctx) {
        ctx.noContent(await this.service.remove(ctx.params.id));
    }
};