var express = require('express');
var middlewares = require('../middlewares');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
var router = express.Router();

/* GET home page. */
router.get('/add', middlewares.checkLogin, function(req, res, next) {
  res.render('articles/add', {keyword:''});
});

router.post('/add', upload.single('poster'), function (req, res) {
  req.body.user = req.session.user._id;
  //console.log(req.file);
  var article = req.body;
  if(req.file){
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
  }else{
    //article.image = image._id;
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

router.get('/detail/:_id', function (req, res) {
  Model('Article').findOne({_id:req.params._id}).populate('user').populate('image').exec(function(err, article){
    res.render('articles/detail',{title:'查看文章',article:article, keyword:''});
  })
});

router.get('/edit/:_id',  function(req, res) {
  Model('Article').findOne({_id:req.params._id}).populate('user').populate('image').exec(function(err, article){
    res.render('articles/edit',{title:'查看文章',article:article, keyword:''});
  })
});

router.post('/edit/:_id', upload.single('poster'), function(req, res) {
  var articleId = req.params._id;
  req.body.user = req.session.user._id;

  if(req.file){
    var image = {
      filename: req.file.originalname,
      filecontent:req.file.buffer.toString('base64')
    };

    new Model('Image')(image).save(function(err, image){
      if(err){
        req.flash('error', '文章保存失败');
        res.redirect('back');
      }else{
        var imageId = image._id;
        req.body.image = imageId;
        console.log(req.body);
        Model('Article').update({_id: articleId}, {$set:req.body}, function(err, atc){
          if(err){
            req.flash('error', '文章保存失败');
            res.redirect('back');
          }else{
            req.flash('success', '文章保存成功');
            console.log(atc);
            res.redirect('/');//发表文章成功后返回主页
          }
        })
      }
    })
  }else{
    Model('Article').update({_id: articleId}, {$set:req.body}, function(err, atc){
      if(err){
        req.flash('error', '文章保存失败');
        res.redirect('back');
      }else{
        req.flash('success', '文章保存成功');
        console.log(atc);
        res.redirect('/');//发表文章成功后返回主页
      }
    })
  }
});

router.get('/delete/:_id', function (req, res) {
  Model('Article').findOne({_id:req.params._id}).populate('user').populate('image').exec(function(err, article){
    var imageId = article.image._id;

    Model('Article').remove({_id:req.params._id},function(err,result){
      if(err){
        req.flash('error','文章删除失败');
        res.redirect('back');
      }else{
        Model('Image').remove({_id:article.image._id}, function(err,result){
          if(err){
            req.flash('error','文章删除失败');
            res.redirect('back');
          }else{
            req.flash('success', '删除文章成功!');
            res.redirect('/');//注册成功后返回主页
          }
        })
      }
    });
  })
});

router.get('/list/:pageNum', function(req, res){
  var pageNum =  parseInt(req.params.pageNum);
  console.log(pageNum+"-------------")
  pageNum = pageNum<=0?1:pageNum;
  var pageSize = 2;
  var totalPages;
  var keyword = req.query.keyword;
  var totalRecords;
  var query = new RegExp(keyword,"i");
  Model('Article').count({$or:[{title:query},{content:query}]},function(err,count){
    if(err){
      req.flash('error', '查找出错')
      articles = [];
      res.render('articles/list', {articles:articles, keyword:keyword});
    }else{
      totalRecords = count;
      totalPages = Math.ceil(totalRecords/pageSize);
      if(pageNum>totalPages){
        pageNum = totalPages;
      }
      //console.log(count+'--------------');
      if(count<1){
        req.flash('error', '搜索结果不存在');
        articles = [];
        res.render('articles/list', {articles:articles, keyword:keyword});
      }else{
        Model('Article').find({$or:[{title:query},{content:query}]}).skip((pageNum-1)*pageSize).limit(pageSize)
            .populate('user').populate('image').exec(function(err, articles){
          res.render('articles/list', {
            articles:articles,
            keyword:keyword,
            totalPages:totalPages,
            currentPage:pageNum
          });
        })
      }
    }
  })
});

module.exports = router;
