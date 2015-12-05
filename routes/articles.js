var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/add', function(req, res, next) {
  res.render('articles/add', { title: 'Express' });
});

router.post('/add', function(req, res, next) {
  //res.render('index', { title: 'Express' });
});

module.exports = router;
