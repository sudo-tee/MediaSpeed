import MongoQS from 'mongo-querystring';
export default class LokiAdapter {
    constructor(logger, db, collectionName) {
        this.logger = logger;
        this.db = db;
        this.collectionName = collectionName;
    }

    async find(query) {
        const qs = new MongoQS();
        const actualQuery = qs.parse(query);
        this.logger.debug(`Finding ${this.collectionName} by ${JSON.stringify(actualQuery)}`);
        return this.db.getCollection(this.collectionName).find(actualQuery);
    }

    async get(uid) {
        return this.db.getCollection(this.collectionName).by('uid', uid);
    }

    async create(data) {
        this.logger.debug(`Created new ${this.collectionName} ${data.uid}`);
        return this.db.getCollection(this.collectionName).insert(data);
    }

    async update(uid, data) {
        const doc = await this.get(uid);
        this.logger.debug(`Updated ${this.collectionName} ${uid}`);
        const merged = { ...data, ...doc };
        return this.db.getCollection(this.collectionName).update(merged);
    }

    async remove(uid) {
        const doc = await this.get(uid);
        this.logger.debug(`Removed ${this.collectionName} ${uid}`);
        return this.db.getCollection('movies').update(doc);
    }
}
