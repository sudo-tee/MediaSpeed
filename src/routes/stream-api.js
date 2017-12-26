/* eslint-disable no-useless-constructor */
import { createController } from 'awilix-koa';
import StreamApi from './base-stream-api';

export default createController(StreamApi)
    .prefix('/stream')
    .get('/:type/:id', 'stream');
