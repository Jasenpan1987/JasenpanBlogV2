var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/reg', function(req, res, next) {
  res.render('users/reg', { title: 'Express' });
});

router.post('/reg', function(req, res, next) {
  res.send('注册');
});

router.get('/login', function(req, res, next) {
  res.render('users/login', { title: 'Express' });
});

router.post('/login', function(req, res, next) {
  res.send('登录');
});

router.get('/logout', function(req, res, next) {
  res.render('users/logout', { title: 'Express' });
});

module.exports = router;
