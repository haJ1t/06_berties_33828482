// Import express and create router
const express = require("express");
const router = express.Router();

// ⭐ IMPORT redirectLogin FROM USERS STYLE
const redirectLogin = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.redirect('/users/login');
    }
    next();
};

// Route to display all books — ⭐ PROTECTED
router.get('/list', redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT * FROM books";
    
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        res.render("list.ejs", {availableBooks: result});
    });
});

// Route to display add book form — ⭐ PROTECTED
router.get('/addbook', redirectLogin, function(req, res, next) {
    res.render('addbook.ejs');
});

// Route to handle book submission — ⭐ PROTECTED
router.post('/bookadded', redirectLogin, function (req, res, next) {
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
    
    let newrecord = [req.body.name, req.body.price];
    
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.send(
                'This book is added to database, name: '
                + req.body.name + 
                ' price £' + req.body.price +
                '<br><br><a href="/books/list">View all books</a> | ' +
                '<a href="/books/addbook">Add another book</a> | ' +
                '<a href="/">Home</a>'
            );
        }
    });
});

// Route to display search form — ⭐ PUBLIC (OK)
router.get('/search', function(req, res, next) {
    res.render('search.ejs');
});

// Search result route - PUBLIC ALLOWED
router.get('/search-result', function(req, res, next) {
    let keyword = req.query.keyword;
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    
    db.query(sqlquery, ['%' + keyword + '%'], (err, result) => {
        if (err) {
            next(err);
        }
        res.render("searchresult.ejs", {availableBooks: result, keyword: keyword});
    });
});

// Bargain books route — PUBLIC (OK)
router.get('/bargainbooks', function(req, res, next) {
    let sqlquery = "SELECT * FROM books WHERE price < 20";
    
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        res.render("bargainbooks.ejs", {availableBooks: result});
    });
});

// Export the router so it can be used in index.js
module.exports = router;