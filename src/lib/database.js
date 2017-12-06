
import LokiJs from 'lokijs';

export default function  createDatabase() {
    return new Promise((resolve, reject) => {
        const collections = ['movies', 'shows', 'episodes', 'seasons', 'libraries'];
        const db = new LokiJs('media.db', {
            autoload: true,
            autoloadCallback: databaseInitialize,
            autosave: true,
            autosaveInterval: 4000
        });

        function databaseInitialize() {
            collections.forEach((collection) => {
                let entries = db.getCollection(collection);
                if (entries === null) {
                    db.addCollection(collection, {unique: ['uid']});
                }
            });

            resolve(db);
        }

    })
}
