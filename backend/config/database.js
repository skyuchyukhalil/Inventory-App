const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// We use __dirname to find the root folder so the .db file stays in /inventory-app
const dbPath = path.resolve(__dirname, '../../inventory.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to the SQLite database.');
    }
});

module.exports = db;