// Import Express module and create a router
const express = require("express")
const router = express.Router()

// Display the home page
router.get('/', function(req, res, next){
    res.render('index.ejs')
});

// Display the about page
router.get('/about', function(req, res, next){
    res.render('about.ejs')
});

// ⭐ LOGOUT ROUTE 
router.get('/logout', (req, res) => {

    // Login değilse login'e yönlendir
    if (!req.session || !req.session.userId) {
        return res.redirect('/users/login');
    }

    // Session yok et
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.send("you are now logged out. <a href='/'>Home</a>");
    });
});

// Export the router so index.js can use it
module.exports = router