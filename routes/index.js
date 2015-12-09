var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  Model('Article').find({}).populate('user').populate('image').exec(function(err, articles){
    console.log(articles);
    res.render('index', {articles:articles, keyword:''});
  })
});

router.get('/music', function(req, res){
  //这里原本的计划是直接从mongodb上去取2进制的mp3文件  但是由于heroku和数据库较慢的问题  暂时先用本地硬盘的音乐
  //但是  将音乐文件存在数据库的方法已证实可以用。。。但是不好

  //Model('Music').find({}, function(err, musics){
  //  if(err){
  //    console.log(err);
  //    res.end();
  //  }else{
  //    res.end(musics[0].content);
  //  }
  //})

  fs.createReadStream('../public/musics/pokemon_0'+(Math.floor(Math.random() * 3) + 1 ) +'.mp3').pipe(res);
});

module.exports = router;
