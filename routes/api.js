var express = require('express');
var router = express.Router();

// GET /api/books → Return JSON list of all books
// GET /api/books → optional search
router.get('/books', function (req, res, next) {

    let search = req.query.search;
    let minprice = req.query.minprice;
    let maxprice = req.query.maxprice;
    let sort = req.query.sort;

    let sqlquery = "SELECT * FROM books";
    let sqlParams = [];
    let conditions = [];

    // 🔍 SEARCH
    if (search) {
        conditions.push("name LIKE ?");
        sqlParams.push("%" + search + "%");
    }

    // 💰 PRICE RANGE
    if (minprice && maxprice) {
        conditions.push("price BETWEEN ? AND ?");
        sqlParams.push(minprice, maxprice);
    }

    // WHERE şartlarını ekle
    if (conditions.length > 0) {
        sqlquery += " WHERE " + conditions.join(" AND ");
    }

    // 🔽 SORTING
    if (sort === "name") {
        sqlquery += " ORDER BY name ASC";
    } else if (sort === "price") {
        sqlquery += " ORDER BY price ASC";
    }

    db.query(sqlquery, sqlParams, (err, result) => {
        if (err) {
            res.json(err);
            return next(err);
        }
        res.json(result);
    });

});

module.exports = router;