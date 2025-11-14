// Import express and create router
const express = require("express");
const router = express.Router();

// Route to display all books
router.get('/list', function(req, res, next) {
    // SQL query to get all books from database
    let sqlquery = "SELECT * FROM books";
    
    // Execute the query
    db.query(sqlquery, (err, result) => {
        if (err) {
            // Pass error to error handler
            next(err);
        }
        // Render the list page with book data
        res.render("list.ejs", {availableBooks: result});
    });
});

// Route to display add book form
router.get('/addbook', function(req, res, next) {
    res.render('addbook.ejs');
});

// Route to handle book submission
router.post('/bookadded', function (req, res, next) {
    // SQL query to insert new book
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
    
    // Get form data
    let newrecord = [req.body.name, req.body.price];
    
    // Execute the query
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            // Pass error to error handler
            next(err);
        } else {
            // Display success message
            res.send('This book is added to database, name: '+ req.body.name + ' price £'+ req.body.price + '<br><br><a href="/books/list">View all books</a> | <a href="/books/addbook">Add another book</a> | <a href="/">Home</a>');
        }
    });
});

// Route to display search form
router.get('/search', function(req, res, next) {
    res.render('search.ejs');
});

// Route to handle search query
// Search result route - ADVANCED SEARCH (Partial match)
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



// Bargain books route - books under £20
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
