const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function connectAndInsert() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB server");

    const database = client.db("mydatabase"); // Name your database
    const users = database.collection("users"); // Name your collection

    // Create a document to insert
    const userRecord = {
      name: "John Doe",
      email: "john.doe@example.com",
      age: 30
    };

    const result = await users.insertOne(userRecord);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);

  } catch (err) {
    console.error("Failed to connect or insert:", err);
  } finally {
    // Ensure that the client will close when you finish/error
    await client.close();
    console.log("Connection closed.");
  }
}

connectAndInsert();