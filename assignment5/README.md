Problem 1: Emit and listen to an event
This solution uses Node.js's built-in events module. The EventEmitter class is used to create a custom event handler.
myEmitter.on('greet', ...) listens for the "greet" event.
myEmitter.emit('greet') triggers the event, executing the listener's callback function.


Problem 2: Connect to MongoDB and insert a user record
This solution uses the mongodb package to connect to a MongoDB database.
It establishes a connection using MongoClient and the database URI.
It selects a database and a collection (users).
It then inserts a new user document using the insertOne method. The async/await syntax simplifies the handling of asynchronous operations.
