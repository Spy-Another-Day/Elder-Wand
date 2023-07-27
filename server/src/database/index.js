const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL || 'mongodb://localhost/elderWand'

mongoose.connect(DB_URL);
const db = mongoose.connection;
db.on('error', () => {
    console.log('mongoose connection error');
});
db.once('open', () => {
    console.log('mongoose connected successfully');
});
module.exports = db;
