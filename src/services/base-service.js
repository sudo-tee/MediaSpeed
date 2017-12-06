import { NotFound, BadRequest } from 'fejl';
import { pick } from 'lodash';

// Prefab assert function.
const assertId = BadRequest.makeAssert('No id given');

/**
 * Library Service.
 * Gets a todo store injected.
 */
export default class BaseService {
    constructor(store, props) {
        this.store = store;
        this.props = props;
    }

    filterProperties(data) {
        return pick(data, this.props);
    }

    assertInput() {
        throw new Error('method assertInput needs to be implemented');
    }

    async find(params) {
        const result = await this.store.find(params);
        return result.map(this.filterProperties, this);
    }

    async get(uid) {
        assertId(uid);

        return this.filterProperties(
            await this.store.get(uid).then(NotFound.makeAssert(`Library with id "${uid}" not found`))
        );
    }

    async create(data) {
        this.assertInput(data);
        return this.store.create(this.filterProperties(data));
    }

    async update(id, data) {
        assertId(id);
        BadRequest.assert(data, 'No library payload given');

        await this.get(id);

        // Prevent overposting.
        const picked = this.filterProperties(data);
        return this.store.update(id, picked);
    }

    async remove(uid) {
        // Make sure the library exists by calling `get`.
        await this.get(uid);
        return this.store.remove(uid);
    }
}
