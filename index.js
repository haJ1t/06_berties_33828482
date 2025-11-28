// Load environment variables
require('dotenv').config();

// Import express and ejs
var express = require('express');
var ejs = require('ejs');
var mysql = require('mysql2');
const path = require('path');

// ⭐ EXPRESS SESSION
var session = require('express-session');

// ⭐ EXPRESS SANITIZER
const expressSanitizer = require('express-sanitizer');

// Create the express application object
const app = express();
const port = 8000;

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Body parser
app.use(express.urlencoded({ extended: true }));

// ⭐ SANITIZER MIDDLEWARE (Task 6)
app.use(expressSanitizer());

// ⭐ SESSION MIDDLEWARE
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000  // 10 minutes
    }
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Application-specific data
app.locals.shopData = { shopName: "Bertie's Books" };

// MySQL connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Make db available everywhere
global.db = db;

// Routes
const mainRoutes = require("./routes/main");
app.use('/', mainRoutes);

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

const booksRoutes = require('./routes/books');
app.use('/books', booksRoutes);

// Start server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));