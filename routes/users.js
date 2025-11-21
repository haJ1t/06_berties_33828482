// Import Express module
const express = require("express");

// Import bcrypt module for password hashing
const bcrypt = require('bcrypt');

// Define salt rounds for bcrypt hashing
const saltRounds = 10;

// Import database connection
const db = require('../db');

// Create a router to handle routes separately
const router = express.Router();


console.log("DEBUG → username:", req.body.username);
console.log("DEBUG → password:", req.body.password);

// ⭐ DEBUG → ROUTES
console.log("⭐ USERS ROUTES LOADED");


//   DISPLAY REGISTRATION PAGE
router.get('/register', function (req, res, next) {
    res.render('register.ejs');
});


//   PROCESS REGISTRATION FORM
router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password;

    bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {

        if (err) {
            return res.status(500).send('Error hashing password: ' + err.message);
        }

        let sqlquery = `
            INSERT INTO users (username, first_name, last_name, email, hashedPassword)
            VALUES (?, ?, ?, ?, ?)
        `;

        let newUser = [
            req.body.username,
            req.body.first,
            req.body.last,
            req.body.email,
            hashedPassword
        ];

        db.query(sqlquery, newUser, (err, result) => {

            if (err) {
                return res.status(500).send('Error saving user to database: ' + err.message);
            }

            let resultMessage = 'Hello ' + req.body.first + ' ' + req.body.last + ' you are now registered!';
            resultMessage += ' We will send an email to you at ' + req.body.email;
            resultMessage += '<br><br>Your password is: ' + req.body.password;
            resultMessage += ' and your hashed password is: ' + hashedPassword;
            resultMessage += '<br><br><a href="/users/login">Login now</a> | <a href="/">Home</a>';

            res.send(resultMessage);
        });
    });
});


//   DISPLAY USERS LIST
router.get('/list', function (req, res, next) {

    let sqlquery = `
        SELECT id, username, first_name, last_name, email, created_at
        FROM users ORDER BY id
    `;

    db.query(sqlquery, (err, result) => {
        if (err) {
            return res.status(500).send('Error fetching users: ' + err.message);
        }

        res.render('listusers.ejs', { users: result });
    });
});


//   DISPLAY LOGIN PAGE
router.get('/login', function (req, res, next) {
    res.render('login.ejs');
});


//   PROCESS LOGIN + AUDIT LOGGING
router.post('/loggedin', function (req, res, next) {

    const username = req.body.username;
    const password = req.body.password;

    let sql = "SELECT hashedPassword FROM users WHERE username = ?";

    db.query(sql, [username], (err, result) => {

        if (err) {
            return res.status(500).send('Database error: ' + err.message);
        }

        // USER NOT FOUND → audit fail
        if (result.length === 0) {

            db.query(`INSERT INTO audit_log (username, status) VALUES (?, 'fail')`, [username]);

            let message = '<h2 style="color:red;">❌ Login Failed</h2>';
            message += '<p>Invalid username or password.</p>';
            message += '<a href="/users/login">Try again</a> | <a href="/">Home</a>';
            return res.send(message);
        }

        const hashedPassword = result[0].hashedPassword;

        bcrypt.compare(password, hashedPassword, function (err, match) {

            if (err) return res.status(500).send('Error comparing passwords');

            // PASSWORD CORRECT → audit success
            if (match === true) {

                db.query(`INSERT INTO audit_log (username, status) VALUES (?, 'success')`, [username]);

                let message = '<h2 style="color:green;">✅ Login Successful!</h2>';
                message += '<p>Welcome back, ' + username + '!</p>';
                message += '<a href="/users/list">View Users</a> | ';
                message += '<a href="/books/list">View Books</a> | ';
                message += '<a href="/">Home</a>';
                return res.send(message);
            }

            // PASSWORD WRONG → audit fail
            else {

                db.query(`INSERT INTO audit_log (username, status) VALUES (?, 'fail')`, [username]);

                let message = '<h2 style="color:red;">❌ Login Failed</h2>';
                message += '<p>Invalid username or password.</p>';
                message += '<a href="/users/login">Try again</a> | <a href="/">Home</a>';
                return res.send(message);
            }
        });
    });
});


//   DISPLAY AUDIT LOG PAGE (timestamp fix!)
router.get('/audit', function (req, res, next) {

    let sqlquery = `
        SELECT id, username, status, \`timestamp\`
        FROM audit_log
        ORDER BY id DESC
    `;

    db.query(sqlquery, (err, logs) => {

        if (err) {
            return res.status(500).send('Error fetching audit log: ' + err.message);
        }

        res.render('audit.ejs', { logs });
    });
});


// TEST ROUTE 
router.get('/audit-test', (req, res) => {
    res.send("Audit test route WORKING");
});


// Export router
module.exports = router;