const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'berties_books_app',
    password: 'qwertyuiop',
    database: 'berties_books',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = db;