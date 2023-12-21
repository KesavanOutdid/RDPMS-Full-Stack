const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017/rdpms';
const client = new MongoClient(uri);

const databaseName = 'rdpms';
const db = client.db(databaseName);

// Export the MongoDB client and the connectToDB function
module.exports = {
    client: client,
    db: db
};