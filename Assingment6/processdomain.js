import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Writable, PassThrough } from 'node:stream';
import { LineSplitter } from './streams/LineSplitter.js';
import { DomainCounter } from './streams/DomainCounter.js';
import { Logger } from './logger/Logger.js';
import { ConsoleTransport } from './logger/transports/ConsoleTransport.js';
import { FileTransport } from './logger/transports/FileTransport.js';

const logger = new Logger({
	transports: [
		new ConsoleTransport(),
		new FileTransport({ filepath: 'logs/app.log', maxBytes: 50 * 1024, maxFiles: 5 })
	]
});

export async function processDomains({
	input = path.resolve('data/users.csv'),
	output = path.resolve('out/domains.json')
} = {}) {
	fs.mkdirSync(path.dirname(output), { recursive: true });
	logger.info('Starting domain aggregation', { input, output });

	const counter = new DomainCounter();
	const sink = new Writable({
		objectMode: true,
		write(_chunk, _enc, cb) { cb(); } // discard; we only care about side-effect (counts)
	});

	const src = fs.createReadStream(input, { encoding: 'utf8', highWaterMark: 64 * 1024 });
	const splitter = new LineSplitter();
	const passthrough = new PassThrough({ objectMode: true }); // keep pipeline consistent

	const start = Date.now();
	await pipeline(src, splitter, counter, passthrough, sink);
	const dur = Date.now() - start;

	logger.info('Finished reading CSV', { ms: dur, domains: counter.counts.size });

	// Stream JSON output
	await new Promise((resolve, reject) => {
		const out = fs.createWriteStream(output, { encoding: 'utf8' });
		out.on('error', reject).on('finish', resolve);

		out.write('{\n');
		let first = true;
		for (const [domain, count] of counter.counts) {
			const line = `${first ? '' : ',\n'}  "${escapeJson(domain)}": ${count}`;
			first = false;
			if (!out.write(line)) {
				out.once('drain', () => {});
			}
		}
		out.end(first ? '}\n' : '\n}\n');
	});

	logger.info('Wrote domains.json', { output });
	return counter.counts;
}

function escapeJson(s) {
	return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

if (import.meta.url === `file://${process.argv[1]}`) {
	await processDomains().catch((err) => {
		console.error(err);
		process.exitCode = 1;
	});
}