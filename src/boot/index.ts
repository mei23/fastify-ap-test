export default async function() {
	await require('../server').default();

	// for test
	if (process.send) {
		process.send('ok');
	}
}
