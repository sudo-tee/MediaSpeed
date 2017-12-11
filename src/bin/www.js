import { createServer } from '../lib/server';
import { env } from '../lib/env';
import { logger } from '../lib/logger';

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
});
createServer().then(
    app =>
        app.listen(env.PORT, () => {
            const mode = env.NODE_ENV;
            logger.debug(`Server listening on ${env.PORT} in ${mode} mode`);
        }),
    err => {
        logger.error('Error while starting up server', err);
        process.exit(1);
    }
);
