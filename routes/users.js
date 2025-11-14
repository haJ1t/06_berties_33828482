// Import Express module
const express = require("express")

// Create a router to handle routes separately
const router = express.Router()

// Display the registration form page
router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

// Process form submission and display confirmation message
router.post('/registered', function (req, res, next) {
    // saving data in database
    res.send(' Hello '+ req.body.first + ' '+ req.body.last +
             ' you are now registered! We will send an email to you at ' + 
             req.body.email);                                                                              
}); 

// Export the router so index.js can use it
module.exports = router
