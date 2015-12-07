var express = require('express');
var middlewares = require('../middlewares');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
var router = express.Router();

/* GET home page. */
router.get('/add', middlewares.checkLogin, function(req, res, next) {
  res.render('articles/add', { title: 'Express' });
});

router.post('/add', upload.single('poster'), function (req, res) {
  req.body.user = req.session.user._id;
  //console.log(req.file);
  var article = req.body;

  var image = {
    filename: req.file.originalname,
    filecontent:req.file.buffer.toString('base64')
  };
  //console.log(image);
  new Model('Image')(image).save(function(err, image){
    if(err){
      console.log(err)
    }else{
      article.image = image._id;
      new Model('Article')(article).save(function(err,atc){
        if(err){
          req.flash('error', '文章保存失败');
          return res.redirect('/articles/add');
        }else{
          req.flash('success', '文章保存成功');
          console.log(atc);
          res.redirect('/');//发表文章成功后返回主页
        }
      });
    }
  });

  //new Model('Article')(article).save(function(err,article){
  //  if(err){
  //    req.flash('error', '文章保存失败');
  //    return res.redirect('/articles/add');
  //  }
  //  req.flash('success', '文章保存成功');
  //  //res.redirect('/');//发表文章成功后返回主页
  //});

});

module.exports = router;
