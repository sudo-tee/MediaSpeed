import { NotFound, BadRequest } from 'fejl';
import { pick, omit } from 'lodash';

// Prefab assert function.
const assertId = BadRequest.makeAssert('No id given');

/**
 * Library Service.
 */
export default class BaseService {
    constructor(store, props) {
        this.store = store;
        this.props = props;
    }

    filterProperties(data) {
        return pick(data, this.props);
    }

    omitInternalProperties(data) {
        return omit(data, ['$loki', 'meta.revision', 'meta.version']);
    }

    assertInput() {
        throw new Error('method assertInput needs to be implemented');
    }

    async find(params) {
        const result = await this.store.find(params);
        return result.map(this.omitInternalProperties, this);
    }

    async get(uid) {
        assertId(uid);
        const ret = await this.store
            .get(uid)
            .then(NotFound.makeAssert(`${this.store.collectionName} with id "${uid}" not found`));
        return this.omitInternalProperties(ret);
    }

    async tryGet(uid) {
        assertId(uid);
        const ret = await this.store.get(uid);

        if (!ret) {
            return null;
        }

        return this.omitInternalProperties(ret);
    }

    async create(data) {
        this.assertInput(data);
        return this.omitInternalProperties(await this.store.create(data));
    }

    async update(id, data) {
        assertId(id);
        BadRequest.assert(data, 'No payload given');

        await this.get(id);

        // Prevent overposting.
        const picked = this.filterProperties(data);
        return this.store.update(id, picked);
    }

    async remove(uid) {
        // Make sure the entity exists by calling `get`.
        await this.get(uid);
        return this.store.remove(uid);
    }
}
