// Import Express module
const express = require("express");

// Import bcrypt module for password hashing
const bcrypt = require('bcrypt');

// Define salt rounds for bcrypt hashing
const saltRounds = 10;

// Import database connection
const db = require('../db');

// ⭐ EXPRESS-VALIDATOR (Validation)
const { check, validationResult } = require('express-validator');

// Create a router
const router = express.Router();

// ⭐ DEBUG
console.log("⭐ USERS ROUTES LOADED");


// ⭐ LOGIN PROTECTION MIDDLEWARE
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('./login');
    }
    next();
};


// -------------------------------
// DISPLAY REGISTRATION PAGE
// -------------------------------
router.get('/register', function (req, res, next) {
    res.render('register.ejs', { errors: [] });
});


// -------------------------------
// PROCESS REGISTRATION FORM
// WITH VALIDATION + SANITISATION
// -------------------------------
router.post(
    '/registered',
    [

        // ✉ Email validation
        check('email')
            .isEmail()
            .withMessage("Email is not valid"),

        // 👤 Username length validation
        check('username')
            .isLength({ min: 5, max: 20 })
            .withMessage("Username must be between 5 and 20 characters"),

        // 🔐 Password minimum length
        check('password')
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long"),

        // 🧍 First name can't be empty
        check('first')
            .notEmpty()
            .withMessage("First name cannot be empty"),

        // 🧍‍♂️ Last name can't be empty
        check('last')
            .notEmpty()
            .withMessage("Last name cannot be empty"),
    ],

    function (req, res, next) {

        // ⭐ SANITIZE USER INPUTS (Prevents XSS)
        req.body.first = req.sanitize(req.body.first);
        req.body.last = req.sanitize(req.body.last);
        req.body.username = req.sanitize(req.body.username);
        req.body.email = req.sanitize(req.body.email);
        req.body.password = req.sanitize(req.body.password);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("❌ Validation errors:", errors.array());
            return res.render('register.ejs', { errors: errors.array() });
        }

        // Validation passed → Continue
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

                let resultMessage = `
                    Hello ${req.body.first} ${req.body.last}, you are now registered!
                    <br><br>We will send an email to you at ${req.body.email}
                    <br><br>Your password is: ${req.body.password}
                    <br>Your hashed password is: ${hashedPassword}
                    <br><br><a href="/users/login">Login now</a> | <a href="/">Home</a>
                `;

                res.send(resultMessage);
            });
        });
    }
);


// -------------------------------
// DISPLAY USERS LIST (PROTECTED)
// -------------------------------
router.get('/list', redirectLogin, function (req, res, next) {

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


// -------------------------------
// LOGIN PAGE
// -------------------------------
router.get('/login', function (req, res, next) {
    res.render('login.ejs');
});


// -------------------------------
// PROCESS LOGIN + SESSION + AUDIT
// -------------------------------
router.post('/loggedin', function (req, res, next) {

    const username = req.sanitize(req.body.username);
    const password = req.sanitize(req.body.password);

    let sql = "SELECT hashedPassword FROM users WHERE username = ?";

    db.query(sql, [username], (err, result) => {

        if (err) {
            return res.status(500).send('Database error: ' + err.message);
        }

        if (result.length === 0) {
            db.query(`INSERT INTO audit_log (username, status) VALUES (?, 'fail')`, [username]);

            let message = `
                <h2 style="color:red;">❌ Login Failed</h2>
                <p>Invalid username or password.</p>
                <a href="/users/login">Try again</a> | <a href="/">Home</a>
            `;
            return res.send(message);
        }

        const hashedPassword = result[0].hashedPassword;

        bcrypt.compare(password, hashedPassword, function (err, match) {

            if (err) return res.status(500).send('Error comparing passwords');

            if (match === true) {

                db.query(`INSERT INTO audit_log (username, status) VALUES (?, 'success')`, [username]);

                // ⭐ SESSION
                req.session.userId = username;

                let message = `
                    <h2 style="color:green;">✅ Login Successful!</h2>
                    <p>Welcome back, ${username}!</p>
                    <a href="/users/list">View Users</a> |
                    <a href="/books/list">View Books</a> |
                    <a href="/">Home</a>
                `;
                return res.send(message);
            }

            // Wrong password
            db.query(`INSERT INTO audit_log (username, status) VALUES (?, 'fail')`, [username]);

            let message = `
                <h2 style="color:red;">❌ Login Failed</h2>
                <p>Invalid username or password.</p>
                <a href="/users/login">Try again</a> | <a href="/">Home</a>
            `;
            return res.send(message);
        });
    });
});


// -------------------------------
// AUDIT LOG (PROTECTED)
// -------------------------------
router.get('/audit', redirectLogin, function (req, res, next) {

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


// -------------------------------
// LOGOUT (PROTECTED)
// -------------------------------
router.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) return res.redirect('/');
        res.send('You are now logged out. <a href="/">Home</a>');
    });
});


// ⭐ EXPORT ROUTER
module.exports = router;