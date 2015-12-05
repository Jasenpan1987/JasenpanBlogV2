var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/reg', function(req, res, next) {
  res.render('users/reg',{});
});

router.post('/reg', function(req, res, next) {
  var user =  req.body;//读取用户提交过来的注册表单
  new Model('User')(user).save(function(err,user){
    if(err){
      res.redirect('/users/reg');
    }else{
      res.redirect('/users/login');
    }
  });

});

router.get('/login', function(req, res, next) {
  res.render('users/login',{});
});

router.post('/login', function(req, res, next) {
  var login = req.body;
  //console.log(req.body);
  Model('User').find({username:req.body.username, password:req.body.password}, function (err, doc){
   if(err){
     console.log(err)
     res.redirect('/users/login');
   }else{
     console.log(doc);
     if(doc.length>0){
       res.redirect('/');
     }else{
       res.redirect('/users/login');
     }
   }
  });
});

router.get('/logout', function(req, res, next) {
  res.send('退出');
});

module.exports = router;