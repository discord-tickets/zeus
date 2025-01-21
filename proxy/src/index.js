// * this entire process is only needed because bun has some bugs:
// * https://github.com/oven-sh/bun/issues/13393
// * https://github.com/apocas/dockerode/issues/747
// * https://github.com/oven-sh/bun/issues/6055

import { Logger } from 'leekslazylogger';
import { createServerAdapter } from '@whatwg-node/server';
import { createServer } from 'http';

const log = new Logger();

function exit(signal) {
	log.notice(`Received ${signal}`);
	client.destroy();
	process.exit(0);
}

process.on('SIGTERM', () => exit('SIGTERM'));

process.on('SIGINT', () => exit('SIGINT'));

/**
 * @param {Request} req
 */
async function proxy(req) {
	// log.info(req);
	const url = new URL(req.url);
	url.hostname = 'localhost';
	url.port = 80;
	const rewrittenRequest = new Request(url, req);
	const res = await fetch(rewrittenRequest, {
		socketPath: '/var/run/docker.sock',
	});
	return res;
}

const adapter = createServerAdapter(proxy);

const nodeServer = createServer(adapter);

nodeServer.listen(80, () => {
	log.success('Server started');
});