import LokiJs from 'lokijs';
import path from 'path';

export default function createDatabase(dataFolder) {
    return new Promise((resolve, reject) => {
        const collections = ['movies', 'shows', 'episodes', 'seasons', 'libraries'];
        const db = new LokiJs(path.join(dataFolder, 'media.db'), {
            autoload: true,
            autoloadCallback: databaseInitialize,
            autosave: true,
            autosaveInterval: 4000
        });

        function databaseInitialize() {
            collections.forEach(collection => {
                let entries = db.getCollection(collection);
                if (entries === null) {
                    db.addCollection(collection, { unique: ['uid'] });
                }
            });

            resolve(db);
        }
    });
}
