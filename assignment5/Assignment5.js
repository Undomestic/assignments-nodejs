const EventEmitter = require('events');

const myEmitter = new EventEmitter();

myEmitter.on('greet', () => {
  console.log('A greet event occurred!');
});

console.log('Emitting the greet event...');
myEmitter.emit('greet');