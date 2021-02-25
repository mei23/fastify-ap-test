import * as Fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import pointOfView from 'point-of-view';
const httpSignature = require('http-signature');
import * as path from 'path';
import * as pug from 'pug';

const server = Fastify.fastify({
	logger: true,
	trustProxy: [
		'127.0.0.0/8', '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16',
		'::1'
	],
	exposeHeadRoutes: true,
});

// JSON inputとみなすContent-Type
server.addContentTypeParser('application/activity+json', { parseAs: 'string' }, (server as any).getDefaultJsonParser('ignore', 'ignore'));
server.addContentTypeParser('application/ld+json', { parseAs: 'string' }, (server as any).getDefaultJsonParser('ignore', 'ignore'));

const assetsDir = path.join(__dirname, '../../src/server/assets');

// static dir
server.register(fastifyStatic, {
	root: assetsDir,
	prefix: '/assets/',
	maxAge: 3600 * 1000,
});

server.register(pointOfView, {
	engine: {
		pug: pug
	},
	root: path.join(__dirname, '../../src/server/views'),
	viewExt: 'pug'
});

server.get('/test', async (request, reply) => {
	reply
		.view(`test`, {
			title: 'タイトル'
		});
});

/*
server.get('/assets/a.js', async (request, reply) => {
	console.log(request.url);
	reply
		.sendFile('a.js')

});
*/
/*
server.get('/actor', async (request, reply) => {
	const actor = await getActor();

	reply
		.code(200)
		.type('application/activity+json')
		.header('Cache-Control', 'public, max-age=180')
		.send(attachContext(await renderActor(actor, `${config.url}/actor`)));
});

const replyEmptyCollection = async (request: Fastify.FastifyRequest, reply: Fastify.FastifyReply) => {
	reply
		.code(200)
		.type('application/activity+json')
		.header('Cache-Control', 'public, max-age=180')
		.send(attachContext(await renderOrderedCollection(`${config.url}/actor/following`)));
}

server.get('/actor/followers', replyEmptyCollection);
server.get('/actor/following', replyEmptyCollection);
server.get('/actor/outbox', replyEmptyCollection);

server.post('/inbox', {}, async (request, reply) => {
	let signature;

	try {
		signature = httpSignature.parseRequest(request.raw, { 'headers': [] });
	} catch (e) {
		console.log(`signature parse error: ${util.inspect(e)}`);
		reply.code(401).send('signature parse error');
		return;
	}

	await createInboxJob(request.body, signature);

	reply.code(202).send('accepted');
});
*/

export default (): Promise<void> => new Promise<void>((resolve, reject) => {
	server.listen(3361, '0.0.0.0', (err, address) => {
		if (err) {
			reject(err);
		}
		resolve();
	});
});