var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  Model('Article').find({}).populate('user').populate('image').exec(function(err, articles){
    console.log(articles);
    res.render('index', {articles:articles, keyword:''});
  })
});

module.exports = router;
