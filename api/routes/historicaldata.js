var express = require('express');
var router = express.Router();


var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://username:password@host:port/database");

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.json([{"a":2}]);
});

module.exports = router;
