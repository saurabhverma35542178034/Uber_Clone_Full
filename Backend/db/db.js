//  This will help in managing the database connection and queries.
const mongoose = require('mongoose');
function connectToDb() {
    const dbUri = process.env.DB_URI || 'mongodb://localhost:27017/mydatabase';
    mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Database connected successfully'))
        .catch(err => console.error('Database connection error:', err));
}

module.exports = connectToDb;