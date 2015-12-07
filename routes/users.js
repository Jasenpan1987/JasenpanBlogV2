var express = require('express');
var router = express.Router();
var middlewares = require('../middlewares');

/* GET users listing. */
router.get('/reg', middlewares.checkNotLogin, function(req, res, next) {
  res.render('users/reg',{});
});

router.post('/reg', function(req, res, next) {
  var user =  req.body;//读取用户提交过来的注册表单
  //需要补齐服务器端的用户校验
  //1) username，email,password为空
  //2）两次输入密码不一致
  //3）用户名已被占用
  //4) 用户名，密码，邮箱不合法
  delete user.repassword;
  user.password = md5(user.password);
  user.avatar = "https://secure.gravatar.com/avatar/"+md5(user.email)+"?s=48";
  console.log(user);

  new Model('User')(user).save(function(err,user){
    if(err){
      console.log(err)
      req.flash('error', '保存错误');
      res.redirect('/users/reg');
    }else{
      req.flash('success', '注册成功');
      res.redirect('/users/login');
    }
  });

});

router.get('/login', middlewares.checkNotLogin, function(req, res, next) {
  res.render('users/login',{});
});

router.post('/login', function(req, res, next) {
  var login = req.body;
  //console.log(req.body);md5(user.password);
  Model('User').find({username:req.body.username, password:md5(req.body.password)}, function (err, doc){
   if(err){
     //console.log(err);
     req.flash('error', '登录出错，请重新登录');
     res.redirect('/users/login');
   }else{
     //console.log(doc);
     if(doc.length>0){
       req.flash('success', '登录成功');
       req.session.user = doc[0];
       res.redirect('/');
     }else{
       req.flash('error', '找不到该用户，请重新登陆');
       res.redirect('/users/login');
     }
   }
  });
});

router.get('/logout', middlewares.checkLogin, function(req, res, next) {
  req.session.user = null;
  req.flash('success', '退出成功');
  res.redirect('/users/login');
});

function md5(val){
  return require('crypto').createHash('md5').update(val).digest('hex');
}

module.exports = router;