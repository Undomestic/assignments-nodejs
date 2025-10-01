import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const server = http.createServer(async (req, res) => {
	if (req.method === 'POST' && req.url === '/process') {
		try {
			const { processDomains } = await import('./processDomains.js');
			await processDomains();
			res.writeHead(200, { 'content-type': 'application/json' });
			res.end(JSON.stringify({ ok: true }));
		} catch (err) {
			res.writeHead(500, { 'content-type': 'application/json' });
			res.end(JSON.stringify({ ok: false, error: String(err?.message || err) }));
		}
		return;
	}
	if (req.method === 'GET' && req.url === '/domains') {
		const file = path.resolve('out/domains.json');
		if (fs.existsSync(file)) {
			res.writeHead(200, { 'content-type': 'application/json' });
			fs.createReadStream(file).pipe(res);
		} else {
			res.writeHead(404).end('Not found');
		}
		return;
	}
	res.writeHead(200, { 'content-type': 'text/plain' });
	res.end('Use POST /process to aggregate, GET /domains to fetch results.\n');
});

await new Promise((resolve) => server.listen(PORT, resolve));
console.log(`Server listening on http://localhost:${PORT}`);