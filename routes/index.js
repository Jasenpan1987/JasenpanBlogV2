var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  Model('Article').find({}).populate('user').populate('image').exec(function(err, articles){
    console.log(articles);
    res.render('index', {articles:articles, keyword:''});
  })
});

router.get('/music', function(req, res){
  //console.log('aaaaaaaaaa');
  Model('Music').find({}, function(err, musics){
    if(err){
      console.log(err);
      res.end();
    }else{
      res.end(musics[0].content);
    }
  })
});

module.exports = router;
