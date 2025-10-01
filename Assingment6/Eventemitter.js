import { Logger } from './src/logger/Logger.js';
import { ConsoleTransport } from './src/logger/transports/ConsoleTransport.js';
import { FileTransport } from './src/logger/transports/FileTransport.js';

const logger = new Logger({
	level: 'info',
	transports: [
		new ConsoleTransport({
			levels: ['info', 'warn', 'error', 'debug']
		}),
		new FileTransport({
			filepath: 'logs/test.log',
			maxBytes: 50 * 1024, 
			maxFiles: 5,
			levels: ['info', 'warn', 'error', 'debug']
		})
	]
});

console.log('Testing EventEmitter-based Logger with Transports and File Rotation');
console.log('=' .repeat(70));

logger.info('Application started', { pid: process.pid, version: '1.0.0' });
logger.warn('This is a warning message', { code: 'WARN_001' });
logger.error('This is an error message', { error: 'Something went wrong', stack: 'Error stack...' });
logger.debug('Debug information', { debug: true, data: { key: 'value' } });

console.log('\nGenerating multiple log entries to test file rotation...');
for (let i = 0; i < 1000; i++) {
	logger.info(`Log entry number ${i + 1}`, { 
		iteration: i + 1, 
		data: `This is some sample data to increase file size: ${'x'.repeat(100)}` 
	});
}

logger.info('Processing batch complete', { 
	totalProcessed: 1000,
	successCount: 950,
	errorCount: 50,
	duration: '2.5s'
});

logger.warn('High memory usage detected', { 
	memoryUsage: '85%',
	threshold: '80%',
	action: 'considering cleanup'
});

logger.error('Database connection failed', { 
	error: 'Connection timeout',
	host: 'localhost:5432',
	retryCount: 3,
	nextRetry: 'in 30s'
});

setTimeout(() => {
	console.log('\nClosing logger...');
	logger.close();
	console.log('Logger closed successfully');
	process.exit(0);
}, 1000);