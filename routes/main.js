// Import Express module and create a router
const express = require("express")
const router = express.Router()

// Display the home page
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

// Display the about page
router.get('/about',function(req, res, next){
    res.render('about.ejs')
});

// Export the router so index.js can use it
module.exports = router
