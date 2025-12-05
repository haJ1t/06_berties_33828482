var express = require('express');
var router = express.Router();
const request = require('request');

router.get('/', function(req, res, next) {

    let apiKey = '4634e07189b1812127b1a9ecdb4b6959';
    let city = req.query.city || 'london';

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) return next(err);

        var data = JSON.parse(body);

        if (!data || !data.main) {
            return res.render("weather.ejs", { 
                weather: null, 
                errorMessage: "City not found or API error."
            });
        }

        // We send full JSON to EJS now:
        res.render("weather.ejs", { 
            weather: data,
            errorMessage: null
        });
    });
});

module.exports = router;