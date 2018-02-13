/* eslint-disable no-useless-constructor */
import { createController } from 'awilix-koa';
import fs from 'fs';
import path from 'path';

class FoldersRestApi {
    async listFolders(ctx) {
        const readDir = new Promise((resolve, reject) => {
            fs.readdir(ctx.query.path, function(err, files) {
                if (err) reject(err);
                resolve(files.filter(isDirectory));
            });
            const isDirectory = source => fs.statSync(path.join(ctx.query.path, source)).isDirectory();
        });

        ctx.ok(await readDir);
    }
}

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
export default createController(FoldersRestApi)
    .prefix('/api/folders')
    .get('', 'listFolders');
